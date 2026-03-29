const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

// ミドルウェア
// Reactからのアクセス(ポート5173など)を許可
app.use(cors());
app.use(express.json());

// PostgreSQLの接続設定（Docker Composeの環境変数を読み込む）
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'pokemon_db',
});

// ポケモン一覧を取得するAPI
app.get('/api/v2/pokemon', async (req, res) => {
  console.log(`[API] GET /api/v2/pokemon requested from ${req.headers.origin || 'unknown'}`);
  try {
    const result = await pool.query('SELECT * FROM pokemons ORDER BY id ASC');
    console.log(`[API] Returning ${result.rows.length} records to frontend.`);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 特定のポケモン詳細情報を取得するAPI
app.get('/api/v2/pokemon/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`[API] GET /api/v2/pokemon/${id} requested`);
  try {
    const result = await pool.query('SELECT * FROM pokemons WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      console.log(`[API] Pokemon with id ${id} not found.`);
      return res.status(404).json({ error: 'Pokemon not found' });
    }
    console.log(`[API] Returning details for pokemon id ${id}.`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// サーバー起動
app.listen(port, () => {
  console.log(`Backend API server is running on http://localhost:${port}`);
});
