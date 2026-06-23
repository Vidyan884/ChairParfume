<script>
    import { onMount } from 'svelte';

    // State Variables
    let username = '';
    let password = '';
    let token = '';
    let isLoggedIn = false;
    let activeTab = 'overview'; // 'overview', 'manage', 'form'
    
    // Product Form State
    let editingId = null;
    let name = '';
    let price = '';
    let scent = '';
    let description = '';
    let badge = '';
    let outOfStock = false;
    let imageFile = null;
    let uploadUrl = '';
    
    // Status/UI States
    let uploading = false;
    let creating = false;
    let loadingList = false;
    let loggingIn = false;
    let products = [];
    let toasts = [];

    // Toast Notifications helper
    function showToast(text, type = 'info') {
        const id = Date.now() + Math.random();
        toasts = [...toasts, { id, text, type }];
        setTimeout(() => {
            toasts = toasts.filter((t) => t.id !== id);
        }, 4000);
    }

    const BACKEND_URL = 'http://localhost:3001';

    function authHeaders() {
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    function authHeadersNoContentType() {
        return {
            'Authorization': `Bearer ${token}`
        };
    }

    function getImageUrl(url) {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return BACKEND_URL + url;
    }

    // Auto load token on mount and check login
    onMount(async () => {
        const savedToken = localStorage.getItem('admin_token');
        if (savedToken) {
            token = savedToken;
            try {
                const res = await fetch(`${BACKEND_URL}/api/admin/verify`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Token invalid');
                isLoggedIn = true;
                showToast('Selamat datang kembali!', 'success');
                await loadProducts();
            } catch (e) {
                localStorage.removeItem('admin_token');
                token = '';
                showToast('Sesi habis. Silakan login ulang.', 'info');
            }
        }
    });

    // Login with username & password
    async function handleLogin() {
        if (!username || !password) {
            showToast('Username dan password wajib diisi', 'error');
            return;
        }
        loggingIn = true;
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login gagal');
            }

            token = data.token;
            localStorage.setItem('admin_token', token);
            isLoggedIn = true;
            showToast(`Selamat datang, ${data.username}!`, 'success');
            await loadProducts();
        } catch (e) {
            showToast('Login gagal: ' + e.message, 'error');
        }
        loggingIn = false;
    }

    function handleLogout() {
        localStorage.removeItem('admin_token');
        token = '';
        username = '';
        password = '';
        isLoggedIn = false;
        showToast('Berhasil keluar', 'info');
    }

    async function loadProducts() {
        loadingList = true;
        try {
            const response = await fetch(`${BACKEND_URL}/api/products`);
            if (!response.ok) throw new Error('Failed to fetch');
            const res = await response.json();
            products = res || [];
        } catch (e) {
            products = [];
            showToast('Gagal memuat produk dari server', 'error');
        }
        loadingList = false;
    }

    // Image Upload
    async function onFileChange(e) {
        const f = e.target.files && e.target.files[0];
        imageFile = f || null;
        if (!imageFile) return;

        showToast(`Mengunggah ${imageFile.name}...`, 'info');
        uploading = true;
        const form = new FormData();
        form.append('image', imageFile);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/upload`, {
                method: 'POST',
                headers: authHeadersNoContentType(),
                body: form
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || res.statusText);
            }
            const data = await res.json();
            uploadUrl = getImageUrl(data.url);
            showToast('Gambar berhasil diunggah', 'success');
        } catch (e) {
            showToast('Unggah gagal: ' + e.message, 'error');
        }
        uploading = false;
    }

    async function handleUpload() {
        if (!imageFile) {
            showToast('Pilih berkas gambar terlebih dahulu', 'error');
            return;
        }
        uploading = true;
        const form = new FormData();
        form.append('image', imageFile);
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/upload`, {
                method: 'POST',
                headers: authHeadersNoContentType(),
                body: form
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || res.statusText);
            }
            const data = await res.json();
            uploadUrl = getImageUrl(data.url);
            showToast('Gambar berhasil diunggah', 'success');
        } catch (e) {
            showToast('Unggah gagal: ' + e.message, 'error');
        }
        uploading = false;
    }

    // Create / Update Product
    async function handleSubmitProduct() {
        if (!name || !price) {
            showToast('Nama dan Harga produk wajib diisi', 'error');
            return;
        }
        creating = true;
        try {
            const body = {
                name,
                price: Number(price),
                scent,
                description,
                badge,
                image: uploadUrl || '',
                out_of_stock: outOfStock ? 1 : 0
            };

            const url = editingId
                ? `${BACKEND_URL}/api/admin/products/${editingId}`
                : `${BACKEND_URL}/api/admin/products`;

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || res.statusText);
            }

            showToast(
                editingId ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!', 
                'success'
            );

            resetForm();
            activeTab = 'manage';
            await loadProducts();
        } catch (e) {
            showToast('Simpan produk gagal: ' + e.message, 'error');
        }
        creating = false;
    }

    // Quick toggle stock status
    async function toggleStockStatus(product) {
        try {
            const nextStatus = product.out_of_stock ? 0 : 1;
            const res = await fetch(`${BACKEND_URL}/api/admin/products/${product.id}`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ out_of_stock: nextStatus })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || res.statusText);
            }

            showToast(
                `Produk "${product.name}" sekarang ${nextStatus ? 'Habis' : 'Tersedia'}`, 
                'success'
            );
            await loadProducts();
        } catch (e) {
            showToast('Gagal mengubah stok: ' + e.message, 'error');
        }
    }

    function editProduct(p) {
        editingId = p.id;
        name = p.name || '';
        price = p.price || '';
        scent = p.scent || '';
        description = p.description || '';
        badge = p.badge || '';
        uploadUrl = getImageUrl(p.image || '');
        outOfStock = p.out_of_stock === 1 || p.out_of_stock === true;
        activeTab = 'form';
        showToast('Produk dimuat ke formulir', 'info');
    }

    async function deleteProduct(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini secara permanen?')) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: authHeadersNoContentType()
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || res.statusText);
            }
            showToast('Produk berhasil dihapus', 'success');
            await loadProducts();
        } catch (e) {
            showToast('Hapus gagal: ' + e.message, 'error');
        }
    }

    function resetForm() {
        editingId = null;
        name = '';
        price = '';
        scent = '';
        description = '';
        badge = '';
        outOfStock = false;
        imageFile = null;
        uploadUrl = '';
        const el = document.getElementById('file-input');
        if (el) el.value = '';
    }

    // Dashboard Statistics
    $: totalProducts = products.length;
    $: outOfStockCount = products.filter(p => p.out_of_stock === 1 || p.out_of_stock === true).length;
    $: availableCount = totalProducts - outOfStockCount;
    $: averagePrice = totalProducts > 0 
        ? Math.round(products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalProducts)
        : 0;
</script>

<svelte:head>
    <title>Admin Dashboard - Chair Parfume</title>
</svelte:head>

<!-- TOAST ALERTS -->
{#if toasts.length}
    <div class="toast-container">
        {#each toasts as t (t.id)}
            <div class="toast {t.type}">
                <span>{t.text}</span>
            </div>
        {/each}
    </div>
{/if}

{#if !isLoggedIn}
    <!-- ==================== LOGIN GATE ==================== -->
    <div class="login-gate">
        <div class="login-bg"></div>
        <div class="login-card">
            <div class="brand">
                <img src="/logo.png" alt="Chair Parfume" class="login-logo" />
                <h2>CHAIR PARFUME</h2>
                <p>PANEL ADMIN PREMIUM</p>
            </div>
            <form on:submit|preventDefault={handleLogin}>
                <div class="input-group">
                    <label for="login-username">Username</label>
                    <input 
                        type="text" 
                        id="login-username" 
                        bind:value={username} 
                        placeholder="Masukkan username..." 
                        required 
                    />
                </div>
                <div class="input-group">
                    <label for="login-password">Password</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        bind:value={password} 
                        placeholder="Masukkan password..." 
                        required 
                    />
                </div>
                <button type="submit" disabled={loggingIn}>
                    {loggingIn ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
                </button>
            </form>
        </div>
    </div>
{:else}
    <!-- ==================== DASHBOARD PANEL ==================== -->
    <div class="dashboard-container">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
            <div class="sidebar-brand">
                <img src="/logo.png" alt="Chair Parfume" />
                <div>
                    <h2>CHAIR PARFUME</h2>
                    <span class="role-badge">ADMINISTRATOR</span>
                </div>
            </div>
            <nav class="sidebar-menu">
                <button 
                    class="menu-item" 
                    class:active={activeTab === 'overview'} 
                    on:click={() => activeTab = 'overview'}
                >
                    <span class="icon"></span> Ringkasan
                </button>
                <button 
                    class="menu-item" 
                    class:active={activeTab === 'manage'} 
                    on:click={() => activeTab = 'manage'}
                >
                    <span class="icon"></span> Kelola Produk
                </button>
                <button 
                    class="menu-item" 
                    class:active={activeTab === 'form'} 
                    on:click={() => { activeTab = 'form'; resetForm(); }}
                >
                    <span class="icon"></span> Tambah Produk
                </button>
            </nav>
            <div class="sidebar-footer">
                <button class="logout-btn" on:click={handleLogout}>
                     Keluar
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
            <header class="content-header">
                <h1>
                    {#if activeTab === 'overview'}📊 Ringkasan Toko{/if}
                    {#if activeTab === 'manage'}📦 Kelola Katalog Produk{/if}
                    {#if activeTab === 'form'}
                        {editingId ? '✏️ Edit Produk Parfume' : '➕ Tambah Parfume Baru'}
                    {/if}
                </h1>
                <div class="server-status">
                    <span class="status-dot"></span> Server Connected
                </div>
            </header>

            <div class="content-body">
                <!-- 1. OVERVIEW TAB -->
                {#if activeTab === 'overview'}
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-icon">📦</span>
                            <div class="stat-info">
                                <h3>Total Produk</h3>
                                <p class="stat-number">{totalProducts}</p>
                            </div>
                        </div>
                        <div class="stat-card success">
                            <span class="stat-icon">✅</span>
                            <div class="stat-info">
                                <h3>Produk Tersedia</h3>
                                <p class="stat-number">{availableCount}</p>
                            </div>
                        </div>
                        <div class="stat-card danger">
                            <span class="stat-icon">❌</span>
                            <div class="stat-info">
                                <h3>Produk Habis (Stok Kosong)</h3>
                                <p class="stat-number">{outOfStockCount}</p>
                            </div>
                        </div>
                        <div class="stat-card gold">
                            <span class="stat-icon">💰</span>
                            <div class="stat-info">
                                <h3>Rata-rata Harga</h3>
                                <p class="stat-number">Rp {averagePrice.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Shortcut panel -->
                    <div class="shortcut-box">
                        <h2>Selamat Datang di Panel Kontrol</h2>
                        <p>Kelola persediaan parfum Anda secara langsung, tandai parfum yang habis dengan sekali klik, atau tambahkan aroma baru ke halaman katalog.</p>
                        <div class="actions">
                            <button class="btn-primary" on:click={() => activeTab = 'manage'}>Kelola Katalog</button>
                            <button class="btn-secondary" on:click={() => { activeTab = 'form'; resetForm(); }}>Tambah Parfum</button>
                        </div>
                    </div>
                {/if}

                <!-- 2. MANAGE PRODUCTS TAB -->
                {#if activeTab === 'manage'}
                    <div class="table-container">
                        {#if loadingList}
                            <div class="loader">Memuat produk...</div>
                        {:else if products.length === 0}
                            <div class="empty-state">
                                <p>Belum ada produk di database. Klik "Tambah Produk" untuk memulai.</p>
                            </div>
                        {:else}
                            <table class="premium-table">
                                <thead>
                                    <tr>
                                        <th>Gambar</th>
                                        <th>Nama Produk</th>
                                        <th>Aroma (Scent)</th>
                                        <th>Harga</th>
                                        <th>Status Stok</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each products as p (p.id)}
                                        <tr class:out-of-stock-row={p.out_of_stock === 1}>
                                            <td>
                                                <div class="table-thumb">
                                                    {#if p.image}
                                                        <img src={getImageUrl(p.image)} alt={p.name} />
                                                    {:else}
                                                        <div class="no-img-placeholder">Null</div>
                                                    {/if}
                                                </div>
                                            </td>
                                            <td class="product-name">
                                                <strong>{p.name}</strong>
                                                {#if p.badge}
                                                    <span class="table-badge">{p.badge}</span>
                                                {/if}
                                            </td>
                                            <td class="product-scent">{p.scent || '-'}</td>
                                            <td class="product-price">Rp {p.price ? Number(p.price).toLocaleString('id-ID') : '-'}</td>
                                            <td>
                                                <button 
                                                    class="stock-toggle-btn {p.out_of_stock === 1 ? 'out-of-stock' : 'in-stock'}"
                                                    on:click={() => toggleStockStatus(p)}
                                                    title="Klik untuk mengubah status stok"
                                                >
                                                    {p.out_of_stock === 1 ? '🔴 Habis' : '🟢 Tersedia'}
                                                </button>
                                            </td>
                                            <td>
                                                <div class="table-actions">
                                                    <button class="edit-btn" on:click={() => editProduct(p)} title="Edit">✏️</button>
                                                    <button class="delete-btn" on:click={() => deleteProduct(p.id)} title="Hapus">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        {/if}
                    </div>
                {/if}

                <!-- 3. ADD/EDIT FORM TAB -->
                {#if activeTab === 'form'}
                    <div class="form-container">
                        <form on:submit|preventDefault={handleSubmitProduct}>
                            <div class="form-grid">
                                <div class="form-left">
                                    <div class="form-group">
                                        <label for="p-name">Nama Produk*</label>
                                        <input type="text" id="p-name" bind:value={name} placeholder="Contoh: Tobacco / Nine" required />
                                    </div>
                                    <div class="form-group">
                                        <label for="p-price">Harga (Rupiah)*</label>
                                        <input type="number" id="p-price" bind:value={price} placeholder="Contoh: 80000" required />
                                    </div>
                                    <div class="form-group">
                                        <label for="p-scent">Karakter Aroma (Scent Notes)</label>
                                        <input type="text" id="p-scent" bind:value={scent} placeholder="Contoh: Pineapple, Bergamot | Vanilla" />
                                    </div>
                                    <div class="form-group">
                                        <label for="p-badge">Lencana Promo (Badge)</label>
                                        <input type="text" id="p-badge" bind:value={badge} placeholder="Contoh: Terlaris / Baru / Edisi Terbatas" />
                                    </div>
                                    <div class="form-group switch-group">
                                        <span class="switch-label">Status Produk Langsung Habis?</span>
                                        <label class="switch">
                                            <input type="checkbox" bind:checked={outOfStock} />
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>

                                <div class="form-right">
                                    <div class="form-group">
                                        <label for="p-desc">Deskripsi Produk Lengkap</label>
                                        <textarea id="p-desc" rows="6" bind:value={description} placeholder="Tulis rincian aroma, ketahanan, jenis parfum (EDP)..."></textarea>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="file-input">Gambar Produk</label>
                                        <div class="upload-zone">
                                            <input id="file-input" type="file" accept="image/*" on:change={onFileChange} />
                                            <p class="upload-tip">Pilih berkas foto berkualitas tinggi</p>
                                            
                                            {#if imageFile}
                                                <button type="button" class="upload-btn" on:click={handleUpload} disabled={uploading}>
                                                    {uploading ? 'Mengunggah...' : '📤 Unggah Gambar Sekarang'}
                                                </button>
                                            {/if}
                                        </div>
                                    </div>

                                    {#if uploadUrl}
                                        <div class="image-preview">
                                            <span class="preview-title">Preview Gambar Terpilih:</span>
                                            <div class="preview-box">
                                                <img src={getImageUrl(uploadUrl)} alt="Preview" />
                                                <button type="button" class="remove-img-btn" on:click={() => uploadUrl = ''}>✕ Hapus</button>
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            </div>

                            <div class="form-actions">
                                {#if editingId}
                                    <button type="button" class="btn-cancel" on:click={resetForm}>Batal Edit</button>
                                    <button type="submit" class="btn-submit" disabled={creating}>
                                        {creating ? 'Menyimpan...' : 'Perbarui Parfum'}
                                    </button>
                                {:else}
                                    <button type="submit" class="btn-submit" disabled={creating}>
                                        {creating ? 'Menyimpan...' : 'Tambahkan Parfum'}
                                    </button>
                                {/if}
                            </div>
                        </form>
                    </div>
                {/if}
            </div>
        </main>
    </div>
{/if}

<style>
    /* Premium Styling Variables & Reset inside Admin scoped CSS */
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #050505;
        font-family: 'Lato', sans-serif;
    }

    /* ==================== LOGIN GATE STYLE ==================== */
    .login-gate {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        padding: 1.5rem;
    }

    .login-bg {
        position: absolute;
        inset: 0;
        background-color: #050505;
        background-image: 
            radial-gradient(circle at 30% 30%, rgba(214, 175, 55, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 70%, rgba(214, 175, 55, 0.05) 0%, transparent 60%);
        z-index: 1;
    }

    .login-card {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 440px;
        background: rgba(18, 18, 18, 0.6);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 3rem 2rem;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        text-align: center;
    }

    .login-logo {
        width: 80px;
        height: 80px;
        margin-bottom: 1.5rem;
        filter: brightness(1.1);
    }

    .login-card h2 {
        font-family: 'Playfair Display', serif;
        font-size: 1.8rem;
        color: var(--color-gold, #D4AF37);
        letter-spacing: 0.15em;
        margin-bottom: 0.25rem;
    }

    .login-card p {
        font-size: 0.8rem;
        color: #888888;
        letter-spacing: 0.2em;
        margin-bottom: 2.5rem;
    }

    .input-group {
        text-align: left;
        margin-bottom: 1.5rem;
    }

    .input-group label {
        display: block;
        color: #dddddd;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-bottom: 0.5rem;
    }

    .input-group input {
        width: 100%;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #ffffff;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .input-group input:focus {
        outline: none;
        border-color: var(--color-gold, #D4AF37);
    }

    .login-card button {
        width: 100%;
        padding: 1rem;
        background: var(--color-gold, #D4AF37);
        color: #050505;
        border: none;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .login-card button:hover {
        background: #f3cf55;
        box-shadow: 0 0 25px rgba(212, 175, 55, 0.3);
    }

    /* ==================== DASHBOARD LAYOUT ==================== */
    .dashboard-container {
        display: flex;
        min-height: 100vh;
        background: #050505;
        color: #F5F5F0;
    }

    /* Sidebar */
    .sidebar {
        width: 280px;
        background: #0e0e0e;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        padding: 2rem 1rem;
        flex-shrink: 0;
    }

    .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        margin-bottom: 2rem;
    }

    .sidebar-brand img {
        width: 44px;
        height: 44px;
    }

    .sidebar-brand h2 {
        font-family: 'Playfair Display', serif;
        font-size: 1.1rem;
        letter-spacing: 0.08em;
        color: var(--color-gold, #D4AF37);
        margin: 0;
    }

    .role-badge {
        font-size: 0.65rem;
        color: #888;
        letter-spacing: 0.15em;
    }

    .sidebar-menu {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: transparent;
        border: none;
        color: #aaaaaa;
        padding: 1rem;
        border-radius: 8px;
        font-size: 0.95rem;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .menu-item:hover, .menu-item.active {
        background: rgba(212, 175, 55, 0.1);
        color: var(--color-gold, #D4AF37);
    }

    .sidebar-footer {
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .logout-btn {
        width: 100%;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #ff5f6d;
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }

    .logout-btn:hover {
        background: rgba(255, 95, 109, 0.1);
        border-color: #ff5f6d;
    }

    /* Main Content */
    .main-content {
        flex: 1;
        padding: 2.5rem;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.5rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .content-header h1 {
        font-size: 2.2rem;
        color: #ffffff;
        margin: 0;
    }

    .server-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: #2ecc71;
        background: rgba(46, 204, 113, 0.1);
        padding: 0.4rem 1rem;
        border-radius: 50px;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #2ecc71;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(46, 204, 113, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
    }

    .content-body {
        flex: 1;
    }

    /* ==================== 1. OVERVIEW STATISTICS ==================== */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 3rem;
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 12px;
        padding: 1.75rem;
        display: flex;
        align-items: center;
        gap: 1.25rem;
        transition: transform 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-4px);
    }

    .stat-icon {
        font-size: 2.2rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .stat-info h3 {
        color: #888;
        font-size: 0.85rem;
        margin: 0 0 0.5rem 0;
        font-family: inherit;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .stat-number {
        font-size: 1.6rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
    }

    /* Colors variants */
    .stat-card.success .stat-icon { background: rgba(46, 204, 113, 0.1); }
    .stat-card.success .stat-number { color: #2ecc71; }
    .stat-card.danger .stat-icon { background: rgba(255, 95, 109, 0.1); }
    .stat-card.danger .stat-number { color: #ff5f6d; }
    .stat-card.gold .stat-icon { background: rgba(212, 175, 55, 0.1); }
    .stat-card.gold .stat-number { color: var(--color-gold, #D4AF37); }

    .shortcut-box {
        background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(18, 18, 18, 0.4) 100%);
        border: 1px solid rgba(212, 175, 55, 0.15);
        border-radius: 12px;
        padding: 2.5rem;
    }

    .shortcut-box h2 {
        color: var(--color-gold, #D4AF37);
        font-size: 1.6rem;
        margin-top: 0;
        margin-bottom: 0.75rem;
    }

    .shortcut-box p {
        color: #aaaaaa;
        line-height: 1.8;
        margin-bottom: 2rem;
        max-width: 700px;
    }

    .shortcut-box .actions {
        display: flex;
        gap: 1rem;
    }

    .btn-primary {
        background: var(--color-gold, #D4AF37);
        color: #050505;
        border: none;
        padding: 0.75rem 1.75rem;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-primary:hover {
        background: #f3cf55;
        box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
    }

    .btn-secondary {
        background: transparent;
        border: 1px solid var(--color-gold, #D4AF37);
        color: var(--color-gold, #D4AF37);
        padding: 0.75rem 1.75rem;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-secondary:hover {
        background: rgba(212, 175, 55, 0.1);
    }

    /* ==================== 2. TABLE KELOLA PRODUK ==================== */
    .table-container {
        background: #0e0e0e;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        overflow: hidden;
    }

    .premium-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    .premium-table th {
        background: rgba(255, 255, 255, 0.02);
        padding: 1.2rem;
        color: #888;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .premium-table td {
        padding: 1.2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        vertical-align: middle;
    }

    .premium-table tbody tr:hover {
        background: rgba(255, 255, 255, 0.01);
    }

    .table-thumb {
        width: 54px;
        height: 54px;
        border-radius: 6px;
        overflow: hidden;
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .table-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .no-img-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        color: #444;
    }

    .product-name {
        font-size: 1.05rem;
        color: #ffffff;
    }

    .table-badge {
        background: var(--color-gold, #D4AF37);
        color: #050505;
        padding: 0.15rem 0.5rem;
        font-size: 0.65rem;
        border-radius: 3px;
        font-weight: 700;
        margin-left: 0.5rem;
        text-transform: uppercase;
        vertical-align: middle;
    }

    .product-scent {
        font-size: 0.9rem;
        color: #aaaaaa;
        max-width: 250px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .product-price {
        font-weight: 700;
        color: #ffffff;
    }

    /* Toggle Stock Button */
    .stock-toggle-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
        font-weight: 700;
        border-radius: 6px;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.3s ease;
    }

    .stock-toggle-btn.in-stock {
        background: rgba(46, 204, 113, 0.15);
        color: #2ecc71;
        border-color: rgba(46, 204, 113, 0.25);
    }

    .stock-toggle-btn.in-stock:hover {
        background: rgba(46, 204, 113, 0.25);
    }

    .stock-toggle-btn.out-of-stock {
        background: rgba(255, 95, 109, 0.15);
        color: #ff5f6d;
        border-color: rgba(255, 95, 109, 0.25);
    }

    .stock-toggle-btn.out-of-stock:hover {
        background: rgba(255, 95, 109, 0.25);
    }

    .out-of-stock-row {
        opacity: 0.65;
    }

    .table-actions {
        display: flex;
        gap: 0.5rem;
    }

    .table-actions button {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        width: 36px;
        height: 36px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .table-actions .edit-btn:hover {
        background: rgba(212, 175, 55, 0.15);
        border-color: var(--color-gold, #D4AF37);
    }

    .table-actions .delete-btn:hover {
        background: rgba(255, 95, 109, 0.15);
        border-color: #ff5f6d;
    }

    .loader, .empty-state {
        padding: 4rem;
        text-align: center;
        color: #888;
    }

    /* ==================== 3. FORM TAMBAH/EDIT PRODUK ==================== */
    .form-container {
        background: #0e0e0e;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 2.5rem;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
    }

    .form-group {
        margin-bottom: 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .form-group label {
        color: #cccccc;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .form-group input[type="text"], 
    .form-group input[type="number"], 
    .form-group textarea {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 1rem;
        color: #ffffff;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        font-family: inherit;
    }

    .form-group input:focus, .form-group textarea:focus {
        outline: none;
        border-color: var(--color-gold, #D4AF37);
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.15);
    }

    /* Stock Toggle Switch */
    .switch-group {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin-top: 1rem;
    }

    .switch-label {
        font-size: 0.9rem;
        color: #ffffff;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: #333333;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #ff5f6d;
    }

    input:checked + .slider:before {
        transform: translateX(24px);
    }

    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    /* Image Drop / Upload */
    .upload-zone {
        border: 2px dashed rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        background: rgba(0, 0, 0, 0.2);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .upload-tip {
        font-size: 0.8rem;
        color: #666;
    }

    .upload-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s ease;
    }

    .upload-btn:hover {
        background: var(--color-gold, #D4AF37);
        color: #050505;
        border-color: var(--color-gold, #D4AF37);
    }

    .image-preview {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .preview-title {
        display: block;
        font-size: 0.8rem;
        color: #888;
        margin-bottom: 0.5rem;
    }

    .preview-box {
        position: relative;
        display: inline-block;
        border-radius: 6px;
        overflow: hidden;
        max-width: 180px;
    }

    .preview-box img {
        width: 100%;
        max-height: 240px;
        object-fit: cover;
    }

    .remove-img-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 95, 109, 0.9);
        color: white;
        border: none;
        padding: 0.4rem;
        font-size: 0.75rem;
        cursor: pointer;
        text-align: center;
    }

    .form-actions {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .btn-cancel {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        padding: 0.85rem 2rem;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-cancel:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .btn-submit {
        background: var(--color-gold, #D4AF37);
        color: #050505;
        border: none;
        padding: 0.85rem 2.5rem;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-submit:hover {
        background: #f3cf55;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
    }

    /* ==================== TOAST ALERT SYSTEM ==================== */
    .toast-container {
        position: fixed;
        right: 1.5rem;
        bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        z-index: 2000;
    }

    .toast {
        background: rgba(18, 18, 18, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #ffffff;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        font-weight: 600;
        min-width: 280px;
        max-width: 380px;
        animation: toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes toastIn {
        from { transform: translateY(40px) scale(0.9); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .toast.success {
        border-left: 4px solid #2ecc71;
        background: linear-gradient(90deg, rgba(46, 204, 113, 0.1) 0%, rgba(18, 18, 18, 0.98) 100%);
    }

    .toast.error {
        border-left: 4px solid #ff5f6d;
        background: linear-gradient(90deg, rgba(255, 95, 109, 0.1) 0%, rgba(18, 18, 18, 0.98) 100%);
    }

    .toast.info {
        border-left: 4px solid var(--color-gold, #D4AF37);
        background: linear-gradient(90deg, rgba(214, 175, 55, 0.05) 0%, rgba(18, 18, 18, 0.98) 100%);
    }

    /* Mobile Adaptations */
    @media (max-width: 900px) {
        .dashboard-container {
            flex-direction: column;
        }

        .sidebar {
            width: 100%;
            padding: 1rem;
        }

        .sidebar-brand {
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }

        .sidebar-menu {
            flex-direction: row;
            overflow-x: auto;
        }

        .menu-item {
            padding: 0.6rem 1rem;
            font-size: 0.85rem;
            white-space: nowrap;
        }

        .main-content {
            padding: 1.5rem;
        }

        .stats-grid {
            grid-template-columns: 1fr 1fr;
        }

        .form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
    }

    @media (max-width: 600px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }

        .premium-table th:nth-child(3), 
        .premium-table td:nth-child(3) {
            display: none; /* Hide Scent column on small screens */
        }
    }
</style>