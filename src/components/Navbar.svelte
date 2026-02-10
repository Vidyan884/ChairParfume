<script>
    let scrollY = 0;
    let innerHeight = 0;
    let isMenuOpen = false;
</script>

<svelte:window bind:scrollY bind:innerHeight />

<nav class:scrolled={scrollY > 50}>
    <div class="container">
        <a href="/" class="logo">CHAIR PARFUME</a>

        <button
            class="hamburger"
            aria-label="Menu"
            on:click={() => (isMenuOpen = !isMenuOpen)}
        >
            <span class:open={isMenuOpen}></span>
            <span class:open={isMenuOpen}></span>
            <span class:open={isMenuOpen}></span>
        </button>

        <div class="links" class:open={isMenuOpen}>
            <a href="/" on:click={() => (isMenuOpen = false)}>Beranda</a>
            <a href="/collections" on:click={() => (isMenuOpen = false)}
                >Koleksi</a
            >
            <a href="/about" on:click={() => (isMenuOpen = false)}>Tentang</a>
            <a href="/contact" on:click={() => (isMenuOpen = false)}>Kontak</a>
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
        position: relative;
    }

    .hamburger {
        display: none;
        flex-direction: column;
        justify-content: space-around;
        width: 2rem;
        height: 1.5rem;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 102;
    }

    .hamburger span {
        width: 100%;
        height: 2px;
        background: var(--color-gold);
        transition: all 0.3s linear;
        position: relative;
        transform-origin: 1px;
    }

    .hamburger span.open:first-child {
        transform: rotate(45deg);
    }

    .hamburger span.open:nth-child(2) {
        opacity: 0;
        transform: translateX(20px);
    }

    .hamburger span.open:nth-child(3) {
        transform: rotate(-45deg);
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

    @media (max-width: 768px) {
        .hamburger {
            display: flex;
        }

        .links {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 100%;
            background: rgba(5, 5, 5, 0.95);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            z-index: 101;
        }

        .links.open {
            transform: translateX(0);
        }

        .links a {
            font-size: 1.5rem;
            margin: 1rem 0;
        }
    }
</style>
