<script>
    import { onMount } from "svelte";
    import ProductCard from "../components/ProductCard.svelte";
    import AboutSection from "../components/AboutSection.svelte";
    import QuickViewModal from "../components/QuickViewModal.svelte";
    import { products } from "../lib/products.js";

    let visible = false;
    let featuredRef;
    let featuredVisible = false;
    let selectedProduct = null;

    function openQuickView(product) {
        selectedProduct = product;
    }

    function closeQuickView() {
        selectedProduct = null;
    }

    onMount(() => {
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
    });
</script>

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

    <div class="product-grid {featuredVisible ? 'visible' : ''}">
        {#each products as product}
            <ProductCard {product} onQuickView={openQuickView} />
        {/each}
    </div>
</section>

<style>
    .hero {
        height: 100vh;
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
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }

    .content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 1.5s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .content.visible {
        opacity: 1;
        transform: translateY(0);
    }

    h1 {
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

    @media (max-width: 768px) {
        h1 {
            font-size: 3rem;
            letter-spacing: 0.2rem;
        }
    }

    p {
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
</style>
