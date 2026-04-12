<script>
    import ProductCard from "../../components/ProductCard.svelte";
    import QuickViewModal from "../../components/QuickViewModal.svelte";
    import { products } from "../../lib/products.js";
    import { onMount } from "svelte";

    let visible = false;
    let selectedProduct = null;
    let carouselRef;
    let activeIndex = 0;
    let activeFilter = "Semua";

    const filters = [
        { label: "Semua", keywords: [] },
        { label: "Manis", keywords: ["manis", "sweet", "vanilla", "caramel", "musk"] },
        { label: "Fresh", keywords: ["fresh", "segar", "citrus", "lemon", "lime", "bergamot", "pineapple", "green"] },
        { label: "Hangat", keywords: ["hangat", "warm", "amber", "tobacco"] },
        { label: "Woody", keywords: ["woody", "kayu", "cedarwood", "dry wood", "oakmoss", "leather"] },
        { label: "Floral", keywords: ["floral", "bunga", "peony"] },
        { label: "Spicy", keywords: ["spicy", "rempah", "herbal", "gin"] },
    ];

    // Read filter from URL query param on mount (set by landing page scent discovery)
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const filterParam = params.get("filter");
        if (filterParam) {
            const matched = filters.find(
                (f) => f.label.toLowerCase() === filterParam.toLowerCase()
            );
            if (matched) {
                activeFilter = matched.label;
            }
        }
        setTimeout(() => (visible = true), 100);
    });

    $: filteredProducts = products.filter((p) => {
        if (activeFilter === "Semua") return true;
        const filter = filters.find((f) => f.label === activeFilter);
        if (!filter) return true;
        const text = `${p.name} ${p.scent} ${p.description}`.toLowerCase();
        return filter.keywords.some((kw) => text.includes(kw));
    });

    function setFilter(label) {
        activeFilter = label;
        activeIndex = 0;
    }

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


</script>

<svelte:head>
    <title>Koleksi - Chair Parfume</title>
</svelte:head>

<QuickViewModal product={selectedProduct} onClose={closeQuickView} />

<section class="collections {visible ? 'visible' : ''}">
    <div class="header">
        <span class="subtitle">Koleksi Kami</span>
        <h1>Semua Wewangian</h1>
        <p>
            Jelajahi koleksi lengkap parfum premium kami yang dibuat dengan
            bahan-bahan terbaik.
        </p>
    </div>

    <!-- Filter Tags -->
    <div class="filter-bar">
        {#each filters as filter}
            <button
                class="filter-tag {activeFilter === filter.label ? 'active' : ''}"
                on:click={() => setFilter(filter.label)}
                id="filter-{filter.label.toLowerCase()}"
            >
                {filter.label}
            </button>
        {/each}
    </div>

    {#if activeFilter !== "Semua"}
        <p class="filter-info">
            Menampilkan <strong>{filteredProducts.length}</strong> parfum dengan aroma
            <strong>{activeFilter.toLowerCase()}</strong>
        </p>
    {/if}

    {#if filteredProducts.length > 0}
        <div class="product-grid" bind:this={carouselRef} on:scroll={handleScroll}>
            {#each filteredProducts as product (product.id)}
                <div class="carousel-item">
                    <ProductCard {product} onQuickView={openQuickView} />
                </div>
            {/each}
        </div>

        <div class="carousel-dots">
            {#each filteredProducts as _, i}
                <button
                    class="dot {activeIndex === i ? 'active' : ''}"
                    on:click={() => scrollToIndex(i)}
                    aria-label="Produk {i + 1}"
                ></button>
            {/each}
        </div>
    {:else}
        <div class="no-results">
            <div class="no-results-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M8 11h6" />
                </svg>
            </div>
            <h3>Belum Ada Wewangian</h3>
            <p>Belum ada parfum dengan kategori ini. Coba filter lainnya.</p>
            <button class="reset-btn" on:click={() => setFilter("Semua")}>Lihat Semua Koleksi</button>
        </div>
    {/if}
</section>

<style>
    .collections {
        padding: 10rem 2rem 6rem;
        max-width: 1400px;
        margin: 0 auto;
        opacity: 0;
        transform: translateY(20px);
        transition: all 1s ease;
    }

    .collections.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .subtitle {
        color: var(--color-gold);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 1rem;
    }

    h1 {
        font-size: 3.5rem;
        margin-bottom: 1.5rem;
        color: var(--color-text-main);
    }

    .header p {
        color: var(--color-text-muted);
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.8;
    }

    /* Filter Bar */
    .filter-bar {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 2rem;
    }

    .filter-tag {
        padding: 0.6rem 1.5rem;
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: transparent;
        color: var(--color-text-muted);
        font-family: var(--font-sans);
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
    }

    .filter-tag::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.15) 0%,
            rgba(212, 175, 55, 0.05) 100%
        );
        opacity: 0;
        transition: opacity 0.35s ease;
    }

    .filter-tag:hover {
        border-color: var(--color-gold-dim);
        color: var(--color-text-main);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .filter-tag:hover::before {
        opacity: 1;
    }

    .filter-tag.active {
        background: var(--color-gold);
        border-color: var(--color-gold);
        color: var(--color-bg);
        font-weight: 700;
        box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
    }

    .filter-tag.active::before {
        opacity: 0;
    }

    /* Filter Info */
    .filter-info {
        text-align: center;
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-bottom: 2.5rem;
        animation: fadeInUp 0.4s ease;
    }

    .filter-info strong {
        color: var(--color-gold);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* No Results */
    .no-results {
        text-align: center;
        padding: 5rem 2rem;
        animation: fadeInUp 0.5s ease;
    }

    .no-results-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.06);
        border: 1px solid rgba(212, 175, 55, 0.15);
    }

    .no-results-icon svg {
        width: 36px;
        height: 36px;
        color: var(--color-gold-dim);
    }

    .no-results h3 {
        font-family: var(--font-serif);
        font-size: 1.5rem;
        color: var(--color-text-main);
        margin-bottom: 1rem;
    }

    .no-results p {
        color: var(--color-text-muted);
        font-size: 0.95rem;
        margin-bottom: 2rem;
    }

    .reset-btn {
        padding: 0.75rem 2rem;
        border-radius: 50px;
        border: 1px solid var(--color-gold);
        background: transparent;
        color: var(--color-gold);
        font-family: var(--font-sans);
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .reset-btn:hover {
        background: var(--color-gold);
        color: var(--color-bg);
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 3rem 2rem;
    }

    /* Carousel dots - hidden on desktop */
    .carousel-dots {
        display: none;
    }

    /* Mobile */
    @media (max-width: 768px) {
        .collections {
            padding: 7rem 0 3rem;
        }

        .header {
            padding: 0 1.25rem;
            margin-bottom: 2rem;
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }

        .header p {
            font-size: 0.9rem;
        }

        .filter-bar {
            padding: 0 1rem;
            justify-content: flex-start;
            flex-wrap: nowrap;
            overflow-x: auto;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
            gap: 0.5rem;
            margin-bottom: 1.25rem;
            /* fade hint on right edge */
            mask-image: linear-gradient(to right, black 85%, transparent 100%);
            -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }

        .filter-bar::-webkit-scrollbar {
            display: none;
        }

        .filter-tag {
            flex-shrink: 0;
            font-size: 0.78rem;
            padding: 0.5rem 1.1rem;
        }

        .filter-tag:hover {
            transform: none;
        }

        .filter-info {
            font-size: 0.8rem;
            padding: 0 1rem;
            margin-bottom: 1.5rem;
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

        .no-results {
            padding: 3rem 1.5rem;
        }

        .no-results-icon {
            width: 64px;
            height: 64px;
        }

        .no-results-icon svg {
            width: 28px;
            height: 28px;
        }

        .no-results h3 {
            font-size: 1.2rem;
        }

        .no-results p {
            font-size: 0.85rem;
        }
    }
</style>
