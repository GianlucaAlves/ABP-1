// backend/src/test-db.js
import pool from "./db.js";

async function test() {
  try {
    const res = await pool.query("SELECT NOW() as now");
    console.log("Conexão OK - hora do banco:", res.rows[0].now);
    await pool.end();
  } catch (err) {
    console.error("Erro ao conectar no banco:", err);
    process.exit(1);
  }
}

test();