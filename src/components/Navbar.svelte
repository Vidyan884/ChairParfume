<script>
    let scrollY = 0;
    let innerHeight = 0;
</script>

<svelte:window bind:scrollY bind:innerHeight />

<nav class:scrolled={scrollY > 50}>
    <div class="container">
        <a href="/" class="logo">CHAIR PARFUME</a>
        <div class="links">
            <a href="/">Beranda</a>
            <a href="/collections">Koleksi</a>
            <a href="/about">Tentang</a>
            <a href="/contact">Kontak</a>
        </div>
    </div>
</nav>

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
        padding: 2rem 0;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    nav.scrolled {
        padding: 1rem 0;
        background: rgba(5, 5, 5, 0.85);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        font-family: var(--font-serif);
        font-size: 1.3rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--color-gold);
        text-transform: uppercase;
        transition: opacity 0.3s ease;
    }

    .logo:hover {
        opacity: 0.8;
    }

    .links {
        display: flex;
        gap: 3rem;
    }

    .links a {
        font-family: var(--font-sans);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-main);
        position: relative;
    }

    .links a::after {
        content: "";
        position: absolute;
        width: 0;
        height: 1px;
        bottom: -5px;
        left: 0;
        background-color: var(--color-gold);
        transition: width 0.3s ease;
    }

    .links a:hover {
        color: var(--color-gold);
    }

    .links a:hover::after {
        width: 100%;
    }
</style>
