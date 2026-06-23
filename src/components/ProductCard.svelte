<script>
    export let product;
    export let onQuickView = (_) => {};

    function handleKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            onQuickView(product);
        }
    }
</script>

<div
    class="card"
    on:click={() => onQuickView(product)}
    on:keydown={handleKeydown}
    role="button"
    tabindex="0"
>
    <div class="image-container" class:out-of-stock={product.out_of_stock}>
        <img src={product.image} alt={product.name} />
        {#if product.out_of_stock}
            <span class="badge badge-sold-out">Stok Habis</span>
        {:else if product.badge}
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
        {#if !product.out_of_stock}
            <a
                class="wa-btn"
                href="https://wa.me/6285198336623?text=Halo%20Chair%20Parfume,%20saya%20tertarik%20dengan%20parfum%20*{encodeURIComponent(product.name)}*%20seharga%20Rp%20{product.price.toLocaleString('id-ID')}.%20Apakah%20masih%20tersedia%3F"
                target="_blank"
                rel="noopener"
                on:click|stopPropagation
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span>Pesan via WhatsApp</span>
            </a>
        {/if}
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

    .image-container.out-of-stock img {
        filter: grayscale(0.5) brightness(0.6);
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

    .badge-sold-out {
        background: #222222;
        color: #aaaaaa;
        border: 1px solid rgba(255, 255, 255, 0.15);
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
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .price {
        color: var(--color-text-main);
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
    }

    .wa-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.25rem;
        padding: 0.65rem 1.2rem;
        background: #25D366;
        color: #fff;
        border: none;
        border-radius: 50px;
        font-family: var(--font-sans);
        font-size: 0.82rem;
        font-weight: 600;
        text-decoration: none;
        letter-spacing: 0.03em;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        z-index: 3;
    }

    .wa-btn:hover {
        background: #1ebe57;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
    }

    .wa-btn svg {
        flex-shrink: 0;
    }
</style>
