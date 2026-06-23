require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_me';
const API_KEY = process.env.BACKEND_API_KEY;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const DB_CONFIG_KEYS = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

const hasDbConfig = DB_CONFIG_KEYS.every((key) => Boolean(process.env[key]));

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Also serve the root static/ folder for product images from SvelteKit
const ROOT_STATIC = path.join(__dirname, '..', 'static');
app.use(express.static(ROOT_STATIC));
console.log(`Static files served from: ${ROOT_STATIC}`);

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, UPLOAD_DIR);
    },
    filename(req, file, cb) {
      const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      cb(null, safeName);
    }
  })
});

const pool = hasDbConfig
  ? mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true
    })
  : null;

function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Server API key not configured. Set BACKEND_API_KEY.' });
  }
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// JWT Authentication middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7);

  // Fallback: also accept x-api-key for backwards compatibility
  if (!token) {
    return requireApiKey(req, res, next);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid atau kadaluarsa' });
  }
}

async function ensureUsersTableReady() {
  if (!pool) {
    console.log('Database not configured. Using .env credentials for admin login fallback.');
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Seed default admin if table is empty
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
  if (rows[0].total === 0) {
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'Ch41rparfum3';
    const hash = await bcrypt.hash(adminPass, 10);
    await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [adminUser, hash, 'admin']
    );
    console.log(`Default admin user created: "${adminUser}"`);
  }
}

function readSeedProducts() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || [];
  } catch (error) {
    return [];
  }
}

function readLocalProducts() {
  return readSeedProducts();
}

function writeLocalProducts(products) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf8');
}

async function ensureDatabaseReady() {
  if (!hasDbConfig) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      scent TEXT NULL,
      description LONGTEXT NULL,
      price INT NOT NULL DEFAULT 0,
      image VARCHAR(255) NULL,
      video VARCHAR(255) NULL,
      badge VARCHAR(255) NULL,
      out_of_stock TINYINT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Try to add out_of_stock column to existing tables (fails safely if column already exists)
  try {
    await pool.query('ALTER TABLE products ADD COLUMN out_of_stock TINYINT NOT NULL DEFAULT 0');
  } catch (err) {
    // Column already exists, ignore
  }

  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM products');
  if (rows[0].total === 0) {
    const seedProducts = readSeedProducts();
    if (seedProducts.length > 0) {
      for (const product of seedProducts) {
        await pool.query(
          `INSERT INTO products (id, name, scent, description, price, image, video, badge)
           VALUES (:id, :name, :scent, :description, :price, :image, :video, :badge)`,
          product
        );
      }
    }
  }
}

async function getProducts() {
  if (!pool) {
    return readLocalProducts().map(p => ({ ...p, out_of_stock: p.out_of_stock ? 1 : 0 }));
  }

  const [rows] = await pool.query(
    'SELECT id, name, scent, description, price, image, video, badge, out_of_stock FROM products ORDER BY id ASC'
  );
  return rows;
}

async function getProductById(id) {
  if (!pool) {
    const p = readLocalProducts().find((product) => product.id === id) || null;
    return p ? { ...p, out_of_stock: p.out_of_stock ? 1 : 0 } : null;
  }

  const [rows] = await pool.query(
    'SELECT id, name, scent, description, price, image, video, badge, out_of_stock FROM products WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function insertProduct(body) {
  if (!pool) {
    const products = readLocalProducts();
    const nextId = products.reduce((maximum, product) => Math.max(maximum, product.id || 0), 0) + 1;
    const product = {
      id: nextId,
      name: body.name,
      scent: body.scent || '',
      description: body.description || '',
      price: Number(body.price) || 0,
      image: body.image || '',
      video: body.video || '',
      badge: body.badge || '',
      out_of_stock: body.out_of_stock ? 1 : 0
    };
    products.push(product);
    writeLocalProducts(products);
    return product;
  }

  const [result] = await pool.query(
    `INSERT INTO products (name, scent, description, price, image, video, badge, out_of_stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.name,
      body.scent || '',
      body.description || '',
      Number(body.price) || 0,
      body.image || '',
      body.video || '',
      body.badge || '',
      body.out_of_stock ? 1 : 0
    ]
  );
  return getProductById(result.insertId);
}

async function updateProduct(id, body) {
  if (!pool) {
    const products = readLocalProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...body,
      price: body.price ?? products[index].price,
      out_of_stock: typeof body.out_of_stock !== 'undefined' ? (body.out_of_stock ? 1 : 0) : (products[index].out_of_stock ? 1 : 0)
    };
    writeLocalProducts(products);
    return products[index];
  }

  const existing = await getProductById(id);
  if (!existing) return null;

  const next = {
    name: body.name ?? existing.name,
    scent: body.scent ?? existing.scent,
    description: body.description ?? existing.description,
    price: body.price ?? existing.price,
    image: body.image ?? existing.image,
    video: body.video ?? existing.video,
    badge: body.badge ?? existing.badge,
    out_of_stock: typeof body.out_of_stock !== 'undefined' ? (body.out_of_stock ? 1 : 0) : (existing.out_of_stock ? 1 : 0)
  };

  await pool.query(
    `UPDATE products
     SET name = ?, scent = ?, description = ?, price = ?, image = ?, video = ?, badge = ?, out_of_stock = ?
     WHERE id = ?`,
    [
      next.name,
      next.scent,
      next.description,
      Number(next.price) || 0,
      next.image,
      next.video,
      next.badge,
      next.out_of_stock,
      id
    ]
  );

  return getProductById(id);
}

async function deleteProduct(id) {
  if (!pool) {
    const products = readLocalProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return null;

    const removed = products.splice(index, 1)[0];
    writeLocalProducts(products);
    return removed;
  }

  const existing = await getProductById(id);
  if (!existing) return null;

  await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return existing;
}

app.get('/', (req, res) => {
  res.json({ message: 'ChairParfume Backend API', endpoints: ['/api/products', '/api/health'] });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load products', detail: error.message });
  }
});

app.post('/api/admin/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

app.post('/api/admin/products', requireAuth, async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.name || typeof body.price === 'undefined') {
      return res.status(400).json({ error: 'Missing required fields: name, price' });
    }

    const product = await insertProduct(body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', detail: error.message });
  }
});

app.put('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await updateProduct(id, req.body || {});
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', detail: error.message });
  }
});

app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const removed = await deleteProduct(id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json(removed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', detail: error.message });
  }
});

app.get('/api/admin/verify', requireAuth, (req, res) => {
  res.json({ ok: true, message: 'Authenticated', user: req.user || null });
});

// --- AUTH ENDPOINTS ---

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    if (!pool) {
      // Fallback: check against .env credentials
      const envUser = process.env.ADMIN_USERNAME || 'admin';
      const envPass = process.env.ADMIN_PASSWORD || 'Ch41rparfum3';
      if (username === envUser && password === envPass) {
        const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, username, role: 'admin' });
      }
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Database mode
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login gagal', detail: error.message });
  }
});

// Change password (authenticated)
app.put('/api/admin/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Password lama dan baru wajib diisi' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter' });
    }

    if (!pool) {
      // Fallback mode: update .env credentials (note: in production this would need .env file write)
      return res.status(400).json({ error: 'Ganti password hanya tersedia dalam mode database' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: 'Token tidak valid' });
    }

    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Password lama salah' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, userId]);

    res.json({ ok: true, message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengubah password', detail: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: rows[0].ok === 1 });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

async function start() {
  try {
    await ensureDatabaseReady();
    await ensureUsersTableReady();
    app.listen(PORT, () => {
      if (pool) {
        console.log(`ChairParfume backend running on http://localhost:${PORT} (MySQL mode)`);
      } else {
        console.log(`ChairParfume backend running on http://localhost:${PORT} (local fallback mode)`);
        console.log('Database env vars are missing. Fill .env to enable MySQL/HeidiSQL mode.');
      }
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
}

start();
