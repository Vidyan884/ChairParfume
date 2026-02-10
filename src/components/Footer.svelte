<footer>
    <div class="content">
        <div class="brand">
            <h3>CHAIR</h3>
            <p>Esensi Kemewahan</p>
        </div>
        <div class="social-links">
            <h4>Ikuti Kami</h4>
            <div class="social-icons">
                <a
                    href="https://www.instagram.com/chairparfume?igsh=dXV5N3ZvMHJxMmEy"
                    target="_blank"
                    rel="noopener"
                    aria-label="Instagram"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"
                        ></rect>
                        <path
                            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                        ></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>Instagram</span>
                </a>
                <a
                    href="https://www.tiktok.com/@chairparfume?_r=1&_t=ZS-93mKnUEfJEv"
                    target="_blank"
                    rel="noopener"
                    aria-label="TikTok"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                        />
                    </svg>
                    <span>TikTok</span>
                </a>
            </div>
        </div>
        <div class="contact-info">
            <h4>Kontak</h4>
            <p>chairparfume@gmail.com</p>
            <p>@+62 851-9833-6623</p>
        </div>
    </div>
    <div class="bottom">
        <p>
            &copy; {new Date().getFullYear()} Chair Parfume. Hak cipta dilindungi
            undang-undang.
        </p>
    </div>
</footer>

<style>
    footer {
        background-color: var(--color-surface);
        padding: 4rem 2rem 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 3rem;
        margin-bottom: 3rem;
    }

    .brand h3 {
        font-size: 2rem;
        letter-spacing: 0.2em;
        margin-bottom: 0.5rem;
        color: var(--color-gold);
    }

    .brand p {
        color: var(--color-text-muted);
        font-style: italic;
        font-family: var(--font-serif);
    }

    h4 {
        font-family: var(--font-sans);
        color: var(--color-text-main);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 1.5rem;
    }

    .social-icons {
        display: flex;
        gap: 2rem;
    }

    .social-icons a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-text-muted);
        transition: color 0.3s ease;
    }

    .social-icons a:hover {
        color: var(--color-gold);
    }

    .social-icons span {
        font-size: 0.9rem;
    }

    .contact-info p {
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .bottom {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        color: var(--color-text-muted);
        font-size: 0.8rem;
    }

    @media (max-width: 600px) {
        .content {
            flex-direction: column;
            text-align: center;
            align-items: center;
        }

        .social-icons {
            justify-content: center;
        }
    }
</style>
