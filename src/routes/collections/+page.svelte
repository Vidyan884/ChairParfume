<script>
    import ProductCard from "../../components/ProductCard.svelte";
    import QuickViewModal from "../../components/QuickViewModal.svelte";
    import { products } from "../../lib/products.js";
    import { onMount } from "svelte";

    let visible = false;
    let selectedProduct = null;
    let carouselRef;
    let activeIndex = 0;

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
        setTimeout(() => (visible = true), 100);
    });
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

    <div class="product-grid" bind:this={carouselRef} on:scroll={handleScroll}>
        {#each products as product}
            <div class="carousel-item">
                <ProductCard {product} onQuickView={openQuickView} />
            </div>
        {/each}
    </div>

    <div class="carousel-dots">
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
        margin-bottom: 5rem;
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

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 3rem 2rem;
    }

    /* Carousel dots - hidden on desktop */
    .carousel-dots {
        display: none;
    }

    /* Mobile carousel - after .product-grid to override grid */
    @media (max-width: 768px) {
        .collections {
            padding: 8rem 0 4rem;
        }

        .header {
            padding: 0 1rem;
        }

        h1 {
            font-size: 2.5rem;
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
    }
</style>
