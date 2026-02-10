<script>
    import "../app.css";
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte";
</script>

<Navbar />
<main>
    <slot />
</main>
<Footer />

<style>
    /* Make sure footer stays at bottom if content is short */
    :global(body) {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    main {
        flex: 1;
    }
</style>
