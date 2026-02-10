<script>
    export let product;
    export let onQuickView = () => {};
</script>

<div class="card">
    <div class="image-container">
        <img src={product.image} alt={product.name} />
        {#if product.badge}
            <span class="badge">{product.badge}</span>
        {/if}
        <div class="overlay">
            <button on:click={() => onQuickView(product)}>Lihat Detail</button>
        </div>
    </div>
    <div class="info">
        <h3>{product.name}</h3>
        <p class="scent">{product.scent}</p>
        <p class="description">{product.description}</p>
        <p class="price">Rp {product.price.toLocaleString("id-ID")}</p>
    </div>
</div>

<style>
    .card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        cursor: pointer;
    }

    .image-container {
        width: 100%;
        aspect-ratio: 3/4;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .card:hover .image-container {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    }

    .card:hover .image-container img {
        transform: scale(1.05);
    }

    .badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: var(--color-gold);
        color: var(--color-bg);
        padding: 0.25rem 0.75rem;
        font-size: 0.7rem;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.1em;
        z-index: 2;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.4s ease;
    }

    .card:hover .overlay {
        opacity: 1;
    }

    button {
        background: var(--color-bg);
        color: var(--color-text-main);
        border: 1px solid var(--color-text-main);
        padding: 0.75rem 1.5rem;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.1em;
        cursor: pointer;
        transform: translateY(20px);
        transition: all 0.4s ease;
    }

    .card:hover button {
        transform: translateY(0);
    }

    button:hover {
        background: var(--color-gold);
        border-color: var(--color-gold);
        color: var(--color-bg);
    }

    .info {
        text-align: center;
        padding: 0 0.5rem;
    }

    h3 {
        font-size: 1.3rem;
        color: var(--color-text-main);
        margin-bottom: 0.25rem;
        font-family: var(--font-serif);
    }

    .scent {
        font-size: 0.85rem;
        color: var(--color-gold);
        margin-bottom: 0.75rem;
        font-style: italic;
    }

    .description {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        margin-bottom: 1rem;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .price {
        color: var(--color-text-main);
        font-weight: 700;
        font-size: 1.1rem;
    }
</style>
