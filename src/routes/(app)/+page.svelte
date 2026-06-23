<script>
    import { onMount } from "svelte";
    import ProductCard from "../../components/ProductCard.svelte";
    import AboutSection from "../../components/AboutSection.svelte";
    import QuickViewModal from "../../components/QuickViewModal.svelte";
    import { products as fallbackProducts, fetchProducts } from "../../lib/products.js";

    // === Scent Discovery State ===
    let showDiscovery = true;
    let discoveryVisible = false;
    let discoveryCardsVisible = false;

    const scentCategories = [
        {
            id: "manis",
            label: "Manis",
            icon: "🍯",
            description: "Aroma vanilla, caramel & musk yang lembut dan memikat",
            gradient: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #DEB887 100%)",
            accent: "#DEB887",
        },
        {
            id: "fresh",
            label: "Fresh",
            icon: "🍃",
            description: "Kesegaran citrus, lemon & bergamot yang menyegarkan",
            gradient: "linear-gradient(135deg, #2E8B57 0%, #3CB371 50%, #98FB98 100%)",
            accent: "#3CB371",
        },
        {
            id: "hangat",
            label: "Hangat",
            icon: "🔥",
            description: "Kehangatan amber, tobacco & rempah yang mendalam",
            gradient: "linear-gradient(135deg, #8B0000 0%, #CD853F 50%, #DAA520 100%)",
            accent: "#DAA520",
        },
        {
            id: "woody",
            label: "Woody",
            icon: "🌲",
            description: "Nuansa cedarwood, oakmoss & leather yang maskulin",
            gradient: "linear-gradient(135deg, #3E2723 0%, #5D4037 50%, #8D6E63 100%)",
            accent: "#8D6E63",
        },
        {
            id: "floral",
            label: "Floral",
            icon: "🌸",
            description: "Sentuhan bunga peony & mawar yang anggun dan feminin",
            gradient: "linear-gradient(135deg, #880E4F 0%, #AD1457 50%, #E91E63 100%)",
            accent: "#E91E63",
        },
        {
            id: "spicy",
            label: "Spicy",
            icon: "🌿",
            description: "Perpaduan herbal & rempah yang berani dan berkarakter",
            gradient: "linear-gradient(135deg, #33691E 0%, #558B2F 50%, #7CB342 100%)",
            accent: "#7CB342",
        },
    ];

    function selectCategory(categoryId) {
        window.location.href = `/collections?filter=${categoryId}`;
    }

    function goToBeranda() {
        showDiscovery = false;
        document.body.style.overflow = "";
    }

    // === Original Beranda State ===
    let visible = false;
    let featuredRef;
    let featuredVisible = false;
    let selectedProduct = null;
    let carouselRef;
    let activeIndex = 0;

    let products = fallbackProducts;

    function openQuickView(product) {
        selectedProduct = product;
    }

    function closeQuickView() {
        selectedProduct = null;
    }

    function scrollToIndex(index) {
        if (!carouselRef) return;
        const items = carouselRef.querySelectorAll(".carousel-item");
        if (items[index]) {
            items[index].scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
            activeIndex = index;
        }
    }

    function handleScroll() {
        if (!carouselRef) return;
        const items = carouselRef.querySelectorAll(".carousel-item");
        const scrollLeft = carouselRef.scrollLeft;
        const containerWidth = carouselRef.clientWidth;

        let closest = 0;
        let minDist = Infinity;
        items.forEach((item, i) => {
            const dist = Math.abs(
                item.offsetLeft -
                    scrollLeft -
                    (containerWidth - item.clientWidth) / 2,
            );
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        });
        activeIndex = closest;
    }

    onMount(() => {
        // Discovery intro animation
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            discoveryVisible = true;
        }, 100);
        setTimeout(() => {
            discoveryCardsVisible = true;
        }, 600);

        // Hero Animation
        setTimeout(() => {
            visible = true;
        }, 100);

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        featuredVisible = true;
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 },
        );

        if (featuredRef) observer.observe(featuredRef);

        // try to load products from backend
        fetchProducts().then((res) => {
            products = res;
        });
    });
</script>

<!-- ==================== SCENT DISCOVERY OVERLAY ==================== -->
{#if showDiscovery}
<div class="discovery-overlay" class:fade-out={!showDiscovery}>
    <!-- Background Layer -->
    <div class="discovery-bg"></div>

    <!-- Floating particles -->
    <div class="particles">
        {#each Array(20) as _, i}
            <div
                class="particle"
                style="
                    left: {Math.random() * 100}%;
                    top: {Math.random() * 100}%;
                    animation-delay: {Math.random() * 8}s;
                    animation-duration: {6 + Math.random() * 8}s;
                    width: {2 + Math.random() * 4}px;
                    height: {2 + Math.random() * 4}px;
                "
            ></div>
        {/each}
    </div>

    <!-- Discovery Content -->
    <div class="discovery-content {discoveryVisible ? 'visible' : ''}">
        <div class="brand-mark">
            <img src="/logo.png" alt="Chair Parfume Logo" class="discovery-logo" />
        </div>

        <h1 class="discovery-title">Temukan Aroma<br /><span class="highlight">Favoritmu</span></h1>

        <p class="discovery-subtitle">
            Pilih karakter wangi yang paling menggambarkan dirimu
        </p>

        <!-- Scent Cards Grid -->
        <div class="scent-grid {discoveryCardsVisible ? 'visible' : ''}">
            {#each scentCategories as cat, i}
                <button
                    class="scent-card"
                    id="scent-{cat.id}"
                    style="
                        --card-gradient: {cat.gradient};
                        --card-accent: {cat.accent};
                        animation-delay: {0.1 * i}s;
                    "
                    on:click={() => selectCategory(cat.id)}
                >
                    <div class="card-glow"></div>
                    <div class="card-inner">
                        <span class="card-icon">{cat.icon}</span>
                        <h3 class="card-label">{cat.label}</h3>
                        <p class="card-desc">{cat.description}</p>
                    </div>
                    <div class="card-shimmer"></div>
                </button>
            {/each}
        </div>

        <!-- Lanjut ke Beranda -->
        <button class="skip-btn {discoveryCardsVisible ? 'visible' : ''}" on:click={goToBeranda} id="skip-to-beranda">
            <span>Lanjut ke Beranda</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </button>
    </div>
</div>
{/if}

<!-- ==================== ORIGINAL BERANDA ==================== -->
<QuickViewModal product={selectedProduct} onClose={closeQuickView} />

<div class="hero">
    <div class="content {visible ? 'visible' : ''}">
        <h1>CHAIR PARFUME</h1>
        <p>Rasakan Esensi Kemewahan</p>
        <a href="/collections" class="cta">Temukan Koleksi</a>
    </div>
</div>

<AboutSection />

<section class="featured" bind:this={featuredRef}>
    <div class="section-header {featuredVisible ? 'visible' : ''}">
        <span class="subtitle">Koleksi Kami</span>
        <h2>Aroma Khas</h2>
    </div>

    <div
        class="product-grid {featuredVisible ? 'visible' : ''}"
        bind:this={carouselRef}
        on:scroll={handleScroll}
    >
        {#each products as product}
            <div class="carousel-item">
                <ProductCard {product} onQuickView={openQuickView} />
            </div>
        {/each}
    </div>

    <div class="carousel-dots {featuredVisible ? 'visible' : ''}">
        {#each products as _, i}
            <button
                class="dot {activeIndex === i ? 'active' : ''}"
                on:click={() => scrollToIndex(i)}
                aria-label="Produk {i + 1}"
            ></button>
        {/each}
    </div>
</section>

<style>
    /* ===================== DISCOVERY OVERLAY ===================== */
    .discovery-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
    }

    .discovery-bg {
        position: fixed;
        inset: 0;
        background-color: var(--color-bg);
        background-image:
            radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(212, 175, 55, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 40%);
        z-index: 0;
    }

    /* Floating Particles */
    .particles {
        position: fixed;
        inset: 0;
        z-index: 1;
        pointer-events: none;
    }

    .particle {
        position: absolute;
        border-radius: 50%;
        background: var(--color-gold);
        opacity: 0.12;
        animation: floatParticle linear infinite;
    }

    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.08;
        }
        25% {
            transform: translateY(-30px) translateX(15px) scale(1.2);
            opacity: 0.2;
        }
        50% {
            transform: translateY(-15px) translateX(-10px) scale(0.9);
            opacity: 0.12;
        }
        75% {
            transform: translateY(-40px) translateX(20px) scale(1.1);
            opacity: 0.15;
        }
    }

    /* Discovery Content */
    .discovery-content {
        position: relative;
        z-index: 2;
        text-align: center;
        padding: 2rem 1.5rem;
        max-width: 900px;
        width: 100%;
        opacity: 0;
        transform: translateY(30px);
        transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .discovery-content.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .brand-mark {
        margin-bottom: 1.5rem;
    }

    .discovery-logo {
        width: 60px;
        height: 60px;
        object-fit: contain;
        opacity: 0.9;
        filter: brightness(1.1);
    }

    .discovery-title {
        font-family: var(--font-serif);
        font-size: 3.2rem;
        font-weight: 400;
        line-height: 1.15;
        letter-spacing: 0.02em;
        color: var(--color-text-main);
        margin-bottom: 1rem;
        background: none;
        -webkit-text-fill-color: unset;
        background-clip: unset;
        -webkit-background-clip: unset;
        animation: none;
    }

    .highlight {
        background: linear-gradient(
            90deg,
            var(--color-gold),
            var(--color-gold-light),
            var(--color-gold)
        );
        background-size: 200% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmerGold 3s ease-in-out infinite;
    }

    @keyframes shimmerGold {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .discovery-subtitle {
        font-family: var(--font-sans);
        font-size: 1.05rem;
        color: var(--color-text-muted);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 3rem;
    }

    /* Scent Grid */
    .scent-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
        margin-bottom: 2.5rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .scent-grid.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Scent Card */
    .scent-card {
        position: relative;
        background: var(--color-surface);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        padding: 2rem 1.25rem;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        font-family: inherit;
        text-align: center;
        animation: cardFadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes cardFadeIn {
        from {
            opacity: 0;
            transform: translateY(25px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .card-glow {
        position: absolute;
        inset: 0;
        background: var(--card-gradient);
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: 0;
    }

    .scent-card:hover .card-glow {
        opacity: 0.12;
    }

    .scent-card:hover {
        border-color: var(--card-accent);
        transform: translateY(-6px);
        box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 30px color-mix(in srgb, var(--card-accent) 20%, transparent);
    }

    .card-shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.04) 50%,
            transparent 100%
        );
        z-index: 1;
        transition: left 0.6s ease;
    }

    .scent-card:hover .card-shimmer {
        left: 100%;
    }

    .card-inner {
        position: relative;
        z-index: 2;
    }

    .card-icon {
        font-size: 2.2rem;
        display: block;
        margin-bottom: 0.75rem;
        filter: grayscale(0.2);
        transition: all 0.3s ease;
    }

    .scent-card:hover .card-icon {
        transform: scale(1.15);
        filter: grayscale(0);
    }

    .card-label {
        font-family: var(--font-serif);
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--color-text-main);
        margin-bottom: 0.5rem;
        letter-spacing: 0.03em;
        transition: color 0.3s ease;
    }

    .scent-card:hover .card-label {
        color: var(--card-accent);
    }

    .card-desc {
        font-family: var(--font-sans);
        font-size: 0.78rem;
        color: var(--color-text-muted);
        line-height: 1.5;
        letter-spacing: 0.01em;
    }

    /* Skip / Lanjut ke Beranda Button */
    .skip-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        background: transparent;
        border: 1px solid rgba(212, 175, 55, 0.3);
        color: var(--color-gold);
        font-family: var(--font-sans);
        font-size: 0.9rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        padding: 0.9rem 2.2rem;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        opacity: 0;
        transform: translateY(10px);
    }

    .skip-btn.visible {
        opacity: 1;
        transform: translateY(0);
        transition-delay: 0.8s;
    }

    .skip-btn svg {
        transition: transform 0.3s ease;
    }

    .skip-btn:hover {
        background: var(--color-gold);
        color: var(--color-bg);
        border-color: var(--color-gold);
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.25);
    }

    .skip-btn:hover svg {
        transform: translateX(4px);
    }

    /* ===================== ORIGINAL BERANDA ===================== */
    .hero {
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background-color: var(--color-bg);
        background-image: linear-gradient(
                rgba(5, 5, 5, 0.6),
                rgba(5, 5, 5, 0.8)
            ),
            url("/hero-bg.png");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 1.5s cubic-bezier(0.22, 1, 0.36, 1);
        padding: 0 1rem;
    }

    .content.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .hero h1 {
        font-size: 5rem;
        letter-spacing: 0.5rem;
        margin-bottom: 1rem;
        background: linear-gradient(
            90deg,
            var(--color-gold),
            var(--color-text-main),
            var(--color-gold),
            var(--color-text-main)
        );
        background-size: 300% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 4s ease-in-out infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    /* Carousel dots - hidden on desktop */
    .carousel-dots {
        display: none;
    }

    .hero p {
        font-size: 1.2rem;
        margin-bottom: 3rem;
        color: var(--color-text-muted);
        letter-spacing: 0.2rem;
        text-transform: uppercase;
    }

    .cta {
        background: transparent;
        border: 1px solid var(--color-gold);
        color: var(--color-gold);
        padding: 1rem 3rem;
        font-family: var(--font-sans);
        text-transform: uppercase;
        letter-spacing: 0.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cta:hover {
        background: var(--color-gold);
        color: var(--color-bg);
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }

    /* Featured Section */
    .featured {
        padding: 8rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .section-header {
        text-align: center;
        margin-bottom: 5rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .section-header h2 {
        font-size: 3rem;
        margin-bottom: 1rem;
        letter-spacing: 0.1em;
        color: var(--color-text-main);
    }

    .subtitle {
        color: var(--color-text-muted);
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        display: block;
        margin-bottom: 1rem;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 3rem 2rem;
        opacity: 0;
        transform: translateY(30px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: 0.2s;
    }

    .section-header.visible,
    .product-grid.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===================== MOBILE ===================== */
    @media (max-width: 768px) {
        /* Discovery mobile */
        .discovery-overlay {
            align-items: flex-start;
            padding-top: 3rem;
        }

        .discovery-content {
            padding: 1rem 1rem 3rem;
        }

        .brand-mark {
            margin-bottom: 1rem;
        }

        .discovery-logo {
            width: 48px;
            height: 48px;
        }

        .discovery-title {
            font-size: 2rem;
            margin-bottom: 0.75rem;
        }

        .discovery-subtitle {
            font-size: 0.85rem;
            margin-bottom: 2.5rem;
            letter-spacing: 0.06em;
            padding: 0 1rem;
        }

        .scent-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 1rem;
            padding: 0.5rem 1rem 1.5rem;
            margin: 0 -1.5rem 2rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }

        .scent-grid::-webkit-scrollbar {
            display: none;
        }

        .scent-card {
            flex: 0 0 75%;
            scroll-snap-align: center;
            padding: 2rem 1.5rem;
            border-radius: 16px;
        }

        .card-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .card-label {
            font-size: 1.4rem;
            margin-bottom: 0.6rem;
        }

        .card-desc {
            font-size: 0.9rem;
            line-height: 1.5;
            padding: 0 0.5rem;
        }

        .skip-btn {
            font-size: 0.85rem;
            padding: 0.85rem 1.8rem;
            margin-top: 1rem;
        }

        /* Beranda mobile */
        .hero h1 {
            font-size: 2.5rem;
            letter-spacing: 0.2rem;
            line-height: 1.2;
        }

        .section-header h2 {
            font-size: 2rem;
        }

        .featured {
            padding: 4rem 0;
            overflow: hidden;
        }

        .section-header {
            padding: 0 1rem;
        }

        .product-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 1rem;
            padding: 0 1rem 1rem 1rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
        }

        .product-grid::-webkit-scrollbar {
            display: none;
        }

        .carousel-item {
            flex: 0 0 85%;
            max-width: 85%;
            scroll-snap-align: center;
        }

        .carousel-dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
            opacity: 0;
            transition: opacity 1s ease;
        }

        .carousel-dots.visible {
            opacity: 1;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 1px solid var(--color-gold);
            background: transparent;
            padding: 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .dot.active {
            background: var(--color-gold);
            transform: scale(1.3);
        }
    }

    /* Tablet */
    @media (min-width: 769px) and (max-width: 1024px) {
        .scent-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }

        .discovery-title {
            font-size: 2.8rem;
        }
    }

    /* Large screens */
    @media (min-width: 1200px) {
        .discovery-title {
            font-size: 3.8rem;
        }

        .scent-card {
            padding: 2.5rem 1.5rem;
        }
    }
</style>
