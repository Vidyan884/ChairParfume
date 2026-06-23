Backend for Chair Parfume - Express admin API with MySQL

Setup

1. Copy `.env.example` to `.env` and fill in your MySQL credentials from HeidiSQL:

```powershell
copy .env.example .env
```

2. Open a terminal in `backend` and install dependencies:

```bash
cd backend
npm install
```

3. Create the table in MySQL using `schema.sql` in HeidiSQL or run it manually.

4. Set the admin API key (export or use a process manager). Example (Windows PowerShell):

```powershell
$env:BACKEND_API_KEY = "your-secret-key"
npm start
```

Database setup

- Database name: use the same name in `DB_NAME` and HeidiSQL.
- The server creates the `products` table automatically on startup if it does not exist.
- Existing seed data from `data/products.json` is inserted once when the table is empty.
- If the DB env vars are missing, the server still starts in local fallback mode so you can continue testing, but MySQL/HeidiSQL mode will only activate after `.env` is filled.

Endpoints

- `GET /api/products` — public list of products
- `POST /api/admin/products` — create product (requires header `x-api-key`)
- `PUT /api/admin/products/:id` — update product (requires header `x-api-key`)
- `DELETE /api/admin/products/:id` — delete product (requires header `x-api-key`)

- `POST /api/admin/upload` — upload an image file (multipart form, field name `image`) (requires header `x-api-key`). Responds with `{ url: '/uploads/<filename>' }`.

Example create (cURL):

```bash
curl -X POST http://localhost:3001/api/admin/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{"name":"New","price":50000,"scent":"Fresh","description":"...","image":"/new.jpg"}'
```

Example upload then create (bash + curl):

```bash
# upload image file (field name 'image')
curl -X POST http://localhost:3001/api/admin/upload \
  -H "x-api-key: your-secret-key" \
  -F "image=@/path/to/local-file.jpg"

# response: { "url": "/uploads/1627384738-local-file.jpg" }

# then create product referencing returned url
curl -X POST http://localhost:3001/api/admin/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{"name":"New","price":50000,"scent":"Fresh","description":"...","image":"/uploads/1627384738-local-file.jpg"}'
```

Frontend (example using fetch):

```js
// upload image
const form = new FormData();
form.append('image', fileInput.files[0]);
const up = await fetch('http://localhost:3001/api/admin/upload', { method: 'POST', headers: { 'x-api-key': 'your-secret-key' }, body: form });
const { url } = await up.json();

// create product
await fetch('http://localhost:3001/api/admin/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': 'your-secret-key' },
  body: JSON.stringify({ name: 'New', price: 50000, image: url, scent: 'Fresh', description: '...' })
});
```

Notes

- Do not commit secrets. Use env vars or a secrets manager for `BACKEND_API_KEY`.
- Uploaded files are still stored locally in `backend/public/uploads`.
- `backend/data/products.json` is only used as initial seed data for the database.
