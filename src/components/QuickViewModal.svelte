<script>
    import { fade, scale } from "svelte/transition";

    /** @type {any} */
    export let product = null;
    export let onClose = () => {};
</script>

{#if product}
    <div
        class="modal-backdrop"
        on:click={onClose}
        on:keydown={(e) =>
            (e.key === "Escape" || e.key === "Enter" || e.key === " ") &&
            onClose()}
        role="button"
        tabindex="0"
        aria-label="Tutup modal"
        transition:fade={{ duration: 200 }}
    >
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <div
            class="modal"
            on:click|stopPropagation={() => {}}
            on:keydown|stopPropagation={() => {}}
            role="dialog"
            aria-modal="true"
            transition:scale={{ duration: 300, start: 0.9 }}
        >
            <button class="close-btn" on:click={onClose}>✕</button>

            <div class="modal-content">
                <div class="media-side" class:dimmed={product.out_of_stock}>
                    {#if product.video}
                        <div class="video-wrapper">
                            <video
                                src={product.video}
                                autoplay
                                playsinline
                                loop
                                muted
                                controls
                            >
                                <track kind="captions" />
                                Browser Anda tidak mendukung tag video.
                            </video>
                        </div>
                    {:else}
                        <img src={product.image} alt={product.name} />
                    {/if}
                    {#if product.out_of_stock}
                        <span class="badge badge-sold-out">Stok Habis</span>
                    {:else if product.badge}
                        <span class="badge">{product.badge}</span>
                    {/if}
                </div>

                <div class="info-side">
                    <span class="category">Eau de Parfum</span>
                    <h2>{product.name}</h2>
                    <p class="scent">{product.scent}</p>
                    <p class="description">{product.description}</p>
                    <p class="price">
                        Rp {product.price.toLocaleString("id-ID")}
                    </p>

                    <div class="actions">
                        {#if product.out_of_stock}
                            <button class="btn-disabled" disabled>
                                📦 Stok Habis
                            </button>
                        {:else}
                            <a
                                class="btn-wa"
                                href="https://wa.me/6285198336623?text=Halo%20Chair%20Parfume,%20saya%20tertarik%20dengan%20parfum%20*{encodeURIComponent(product.name)}*%20seharga%20Rp%20{product.price.toLocaleString('id-ID')}.%20Apakah%20masih%20tersedia%3F"
                                target="_blank"
                                rel="noopener"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                                </svg>
                                Pesan via WhatsApp
                            </a>
                            <a
                                href="https://www.tiktok.com/@chairparfume?_r=1&_t=ZS-93mKnUEfJEv"
                                target="_blank"
                                rel="noopener"
                                class="btn-tiktok"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                                    />
                                </svg>
                                Beli di TikTok Shop
                            </a>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
    }

    .modal {
        background: var(--color-surface);
        border-radius: 8px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow: auto;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: var(--color-text-main);
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 10;
        transition: color 0.3s ease;
    }

    .close-btn:hover {
        color: var(--color-gold);
    }

    .modal-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 768px) {
        .modal-content {
            grid-template-columns: 1fr;
        }
    }

    .media-side {
        position: relative;
        display: flex;
    }

    .media-side img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .media-side.dimmed img, .media-side.dimmed video {
        filter: grayscale(0.5) brightness(0.6);
    }

    .video-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
    }

    .video-wrapper video {
        width: 100%;
        height: 100%;
        object-fit: cover;
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

    .info-side {
        padding: 3rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .category {
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.8rem;
        margin-bottom: 0.5rem;
    }

    h2 {
        font-size: 2.5rem;
        color: var(--color-text-main);
        margin-bottom: 0.5rem;
    }

    .scent {
        color: var(--color-gold);
        font-style: italic;
        margin-bottom: 1.5rem;
    }

    .description {
        color: var(--color-text-muted);
        line-height: 1.8;
        margin-bottom: 2rem;
    }

    .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-main);
        margin-bottom: 2rem;
    }

    .actions {
        display: flex;
        gap: 1rem;
    }

    .btn-tiktok {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #ff0050 0%, #00f2ea 100%);
        color: white;
        border: none;
        border-radius: 4px;
        font-family: var(--font-sans);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-tiktok:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(255, 0, 80, 0.3);
    }

    .btn-disabled {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
        padding: 1rem 2rem;
        background: #2a2a2a;
        color: #888888;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        font-family: var(--font-sans);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: not-allowed;
        transition: all 0.3s ease;
    }

    .btn-wa {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        width: 100%;
        padding: 1rem 2rem;
        background: #25D366;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-family: var(--font-sans);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-wa:hover {
        background: #1ebe57;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(37, 211, 102, 0.35);
    }

    .actions {
        flex-direction: column;
    }

    @media (min-width: 769px) {
        .actions {
            flex-direction: row;
        }
    }
</style>
