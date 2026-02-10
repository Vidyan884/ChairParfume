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
                <div class="media-side">
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
                    {#if product.badge}
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
    }

    .media-side img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
</style>
