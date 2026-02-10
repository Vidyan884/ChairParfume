<script>
    import { onMount } from "svelte";

    let visible = false;
    let valuesVisible = false;
    let valuesRef;

    onMount(() => {
        setTimeout(() => (visible = true), 100);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        valuesVisible = true;
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 },
        );

        if (valuesRef) observer.observe(valuesRef);

        return () => {
            if (valuesRef) observer.unobserve(valuesRef);
        };
    });
</script>

<svelte:head>
    <title>About - Chair Parfume</title>
</svelte:head>

<section class="about-page {visible ? 'visible' : ''}">
    <div class="hero-section">
        <img src="/logo.png" alt="" class="hero-logo" aria-hidden="true" />
        <span class="subtitle">Kisah Kami</span>
        <h1>Chair Parfume</h1>
        <p class="tagline">Menciptakan Kenangan dalam Setiap Botol</p>
    </div>

    <div class="content-section">
        <div class="story">
            <h2>Perjalanan Kami</h2>
            <p>
                Chair Parfume lahir dari passion mendalam terhadap seni
                pembuatan parfum. Kami percaya bahwa setiap aroma memiliki
                kekuatan untuk membangkitkan kenangan, emosi, dan pengalaman
                yang tak terlupakan.
            </p>
            <p>
                Setiap produk kami dibuat dengan bahan-bahan berkualitas tinggi
                yang dipilih secara cermat dari berbagai penjuru dunia. Dari
                bunga-bunga eksotis hingga rempah-rempah langka, kami memastikan
                setiap tetes parfum mencerminkan kemewahan dan keunikan.
            </p>
        </div>

        <div class="values" bind:this={valuesRef}>
            <h2>Nilai-Nilai Kami</h2>
            <div class="value-grid">
                <div
                    class="value-item {valuesVisible ? 'animate' : ''}"
                    style="--delay: 0s"
                >
                    <div class="icon-wrapper">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            />
                        </svg>
                    </div>
                    <h3>Kualitas Premium</h3>
                    <p>
                        Hanya menggunakan bahan-bahan terbaik untuk hasil yang
                        sempurna.
                    </p>
                    <div class="card-glow"></div>
                </div>
                <div
                    class="value-item {valuesVisible ? 'animate' : ''}"
                    style="--delay: 0.15s"
                >
                    <div class="icon-wrapper">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <path
                                d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"
                            />
                            <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
                            <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </div>
                    <h3>Keunikan</h3>
                    <p>
                        Setiap aroma dirancang untuk memberikan pengalaman yang
                        berbeda.
                    </p>
                    <div class="card-glow"></div>
                </div>
                <div
                    class="value-item {valuesVisible ? 'animate' : ''}"
                    style="--delay: 0.3s"
                >
                    <div class="icon-wrapper">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <path
                                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                            />
                        </svg>
                    </div>
                    <h3>Ketahanan</h3>
                    <p>
                        Formula khusus yang menjamin ketahanan aroma sepanjang
                        hari.
                    </p>
                    <div class="card-glow"></div>
                </div>
                <div
                    class="value-item {valuesVisible ? 'animate' : ''}"
                    style="--delay: 0.45s"
                >
                    <div class="icon-wrapper">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <path
                                d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
                            />
                        </svg>
                    </div>
                    <h3>Keindahan</h3>
                    <p>
                        Kemasan elegan yang mencerminkan kemewahan di dalamnya.
                    </p>
                    <div class="card-glow"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .about-page {
        opacity: 0;
        transform: translateY(20px);
        transition: all 1s ease;
    }

    .about-page.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .hero-section {
        height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;
        overflow: hidden;
        background: radial-gradient(
            circle at center,
            #1a1a1a 0%,
            var(--color-bg) 70%
        );
    }

    .hero-logo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        height: auto;
        opacity: 0.06;
        pointer-events: none;
        user-select: none;
    }

    .subtitle {
        color: var(--color-gold);
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    h1 {
        font-size: 4rem;
        color: var(--color-text-main);
        margin-bottom: 1rem;
        letter-spacing: 0.2em;
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

    .tagline {
        color: var(--color-text-muted);
        font-style: italic;
        font-family: var(--font-serif);
        font-size: 1.2rem;
    }

    .content-section {
        max-width: 900px;
        margin: 0 auto;
        padding: 6rem 2rem;
    }

    .story,
    .values {
        margin-bottom: 5rem;
    }

    h2 {
        color: var(--color-gold);
        font-size: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    .story p {
        color: var(--color-text-muted);
        line-height: 2;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .value-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }

    @media (max-width: 600px) {
        .value-grid {
            grid-template-columns: 1fr;
        }
    }

    .value-item {
        position: relative;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 2.5rem 2rem;
        border-radius: 16px;
        border: 1px solid rgba(212, 175, 55, 0.1);
        text-align: center;
        overflow: hidden;
        transition:
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        opacity: 0;
        transform: translateY(40px);
    }

    .value-item.animate {
        animation: cardSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: var(--delay);
    }

    @keyframes cardSlideIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .value-item:hover {
        transform: translateY(-8px);
        border-color: rgba(212, 175, 55, 0.3);
        box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(212, 175, 55, 0.08);
    }

    .card-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
            circle at center,
            rgba(212, 175, 55, 0.06) 0%,
            transparent 60%
        );
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
    }

    .value-item:hover .card-glow {
        opacity: 1;
    }

    .icon-wrapper {
        width: 64px;
        height: 64px;
        margin: 0 auto 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(212, 175, 55, 0.08);
        border: 1px solid rgba(212, 175, 55, 0.15);
        transition:
            transform 0.4s ease,
            background 0.4s ease;
    }

    .icon-wrapper svg {
        width: 28px;
        height: 28px;
        color: var(--color-gold);
        transition: transform 0.4s ease;
    }

    .value-item:hover .icon-wrapper {
        transform: scale(1.1);
        background: rgba(212, 175, 55, 0.15);
    }

    .value-item:hover .icon-wrapper svg {
        transform: rotate(5deg) scale(1.1);
    }

    .value-item h3 {
        color: var(--color-text-main);
        font-size: 1.15rem;
        margin-bottom: 0.75rem;
        font-family: var(--font-serif);
        letter-spacing: 0.02em;
    }

    .value-item p {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        line-height: 1.7;
    }
</style>
