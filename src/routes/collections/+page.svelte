<script>
    import ProductCard from "../../components/ProductCard.svelte";
    import QuickViewModal from "../../components/QuickViewModal.svelte";
    import { products } from "../../lib/products.js";
    import { onMount } from "svelte";

    let visible = false;
    let selectedProduct = null;

    function openQuickView(product) {
        selectedProduct = product;
    }

    function closeQuickView() {
        selectedProduct = null;
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

    <div class="product-grid">
        {#each products as product}
            <ProductCard {product} onQuickView={openQuickView} />
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
</style>
