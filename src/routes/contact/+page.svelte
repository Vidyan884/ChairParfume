<script>
    import { onMount } from "svelte";

    let visible = false;
    let formData = { name: "", email: "", phone: "", message: "" };
    let submitted = false;

    onMount(() => {
        setTimeout(() => (visible = true), 100);
    });

    function handleSubmit() {
        // In a real app, this would send data to a server
        submitted = true;
    }
</script>

<svelte:head>
    <title>Contact - Chair Parfume</title>
</svelte:head>

<section class="contact-page {visible ? 'visible' : ''}">
    <div class="header">
        <span class="subtitle">Mari Terhubung</span>
        <h1>Hubungi Kami</h1>
        <p>
            Kami senang mendengar dari Anda. Silakan hubungi kami untuk
            pertanyaan atau pemesanan.
        </p>
    </div>

    <div class="contact-content">
        <div class="contact-info">
            <div class="info-item">
                <h3>📍 Alamat</h3>
                <p>Toko Chair ,Jln. Raya Blumbungan, Kec. Larangan,<br /> Kabupaten Pamekasan </p>
            </div>
            <div class="info-item">
                <h3>📞 Telepon</h3>
                <p>+62 851-9833-6623</p>
            </div>
            <div class="info-item">
                <h3>✉️ Email</h3>
                <p>chairparfume@gmail.com</p>
            </div>
            <div class="info-item">
                <h3>🕐 Jam Operasional</h3>
                <p>Senin - Jumat: 09:00 - 18:00<br />Sabtu: 10:00 - 15:00</p>
            </div>
        </div>

        <div class="contact-form">
            {#if submitted}
                <div class="success-message">
                    <h3>Terima Kasih!</h3>
                    <p>
                        Pesan Anda telah terkirim. Kami akan segera menghubungi
                        Anda.
                    </p>
                </div>
            {:else}
                <form on:submit|preventDefault={handleSubmit}>
                    <div class="form-group">
                        <label for="name">Nama Lengkap</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={formData.name}
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            bind:value={formData.email}
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="phone">No. Telepon</label>
                        <input
                            type="tel"
                            id="phone"
                            bind:value={formData.phone}
                        />
                    </div>
                    <div class="form-group">
                        <label for="message">Pesan</label>
                        <textarea
                            id="message"
                            rows="5"
                            bind:value={formData.message}
                            required
                        ></textarea>
                    </div>
                    <button type="submit">Kirim Pesan</button>
                </form>
            {/if}
        </div>
    </div>
</section>

<style>
    .contact-page {
        padding: 10rem 2rem 6rem;
        max-width: 1200px;
        margin: 0 auto;
        opacity: 0;
        transform: translateY(20px);
        transition: all 1s ease;
    }

    .contact-page.visible {
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
        font-size: 3rem;
        color: var(--color-text-main);
        margin-bottom: 1.5rem;
    }

    .header p {
        color: var(--color-text-muted);
        max-width: 500px;
        margin: 0 auto;
    }

    .contact-content {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 4rem;
    }

    @media (max-width: 768px) {
        .contact-content {
            grid-template-columns: 1fr;
        }
    }

    .info-item {
        margin-bottom: 2rem;
    }

    .info-item h3 {
        color: var(--color-text-main);
        font-family: var(--font-sans);
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }

    .info-item p {
        color: var(--color-text-muted);
        line-height: 1.6;
    }

    .contact-form {
        background: var(--color-surface);
        padding: 3rem;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        color: var(--color-text-main);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    input,
    textarea {
        width: 100%;
        padding: 1rem;
        background: var(--color-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--color-text-main);
        font-family: var(--font-sans);
        font-size: 1rem;
        border-radius: 4px;
        transition: border-color 0.3s ease;
    }

    input:focus,
    textarea:focus {
        outline: none;
        border-color: var(--color-gold);
    }

    button {
        width: 100%;
        padding: 1rem 2rem;
        background: var(--color-gold);
        color: var(--color-bg);
        border: none;
        font-family: var(--font-sans);
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    button:hover {
        background: var(--color-gold-light);
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }

    .success-message {
        text-align: center;
        padding: 3rem;
    }

    .success-message h3 {
        color: var(--color-gold);
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .success-message p {
        color: var(--color-text-muted);
    }
</style>
