// backend/src/db.js
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Se você usa DATABASE_URL:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // descomente apenas se precisar de SSL (ex: DB remoto)
});

// Alternativa: usar variáveis separadas (descomente e comente o connectionString acima)
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT
// });

export default pool;