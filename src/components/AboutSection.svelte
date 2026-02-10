<script>
    import { onMount } from "svelte";

    let visible = false;
    let sectionRef;

    let videoRef;

    onMount(() => {
        // Animation Observer (Once)
        const animationObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visible = true;
                        animationObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 },
        );

        if (sectionRef) animationObserver.observe(sectionRef);

        // Video Playback Observer (Continuous)
        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.play().catch(() => {
                            // Autoplay might be blocked by browser policy
                            console.log("Autoplay prevented");
                        });
                    } else {
                        videoRef.pause();
                    }
                });
            },
            { threshold: 0.5 }, // Play when at least 50% visible
        );

        if (videoRef) videoObserver.observe(videoRef);

        return () => {
            if (sectionRef) animationObserver.unobserve(sectionRef);
            if (videoRef) videoObserver.disconnect();
        };
    });
</script>

<section class="about" bind:this={sectionRef}>
    <div class="content {visible ? 'visible' : ''}">
        <span class="subtitle">Kisah Kami</span>
        <h2>Menciptakan Kenangan dalam Botol</h2>
        <p>
            Di Chair Parfume, kami percaya bahwa aroma adalah penghubung paling
            kuat dengan kenangan. Wewangian kami diracik dengan cermat
            menggunakan bahan-bahan terbaik dari seluruh dunia, dirancang untuk
            membawa Anda ke momen kebahagiaan murni dan keanggunan yang canggih.
        </p>
        <button class="cta-link">Baca Kisah Kami</button>
    </div>
    <div class="image {visible ? 'visible' : ''}">
        <div class="video-container">
            <video
                bind:this={videoRef}
                src="/vidiochair.mp4"
                controls
                playsinline
                loop
                muted
            >
                <track kind="captions" />
                Browser Anda tidak mendukung tag video.
            </video>
        </div>
    </div>
</section>

<style>
    .about {
        padding: 8rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }

    @media (max-width: 768px) {
        .about {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 4rem 1.5rem;
            gap: 2rem;
        }
    }

    .content,
    .image {
        opacity: 0;
        transform: translateY(30px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .content.visible,
    .image.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .image {
        transition-delay: 0.2s;
        display: flex;
        justify-content: center;
    }

    .subtitle {
        color: var(--color-gold);
        font-family: var(--font-sans);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 1rem;
    }

    h2 {
        font-size: 2.5rem;
        line-height: 1.2;
        margin-bottom: 2rem;
        color: var(--color-text-main);
    }

    p {
        color: var(--color-text-muted);
        margin-bottom: 2rem;
        font-size: 1.1rem;
        line-height: 1.8;
    }

    .cta-link {
        background: none;
        border: none;
        color: var(--color-text-main);
        font-family: var(--font-sans);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        cursor: pointer;
        border-bottom: 1px solid var(--color-gold);
        padding-bottom: 5px;
        transition: color 0.3s ease;
    }

    .cta-link:hover {
        color: var(--color-gold);
    }

    .video-container {
        width: 100%;
        max-width: 400px;
        aspect-ratio: 9/16;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(212, 175, 55, 0.2);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        background: #000;
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
