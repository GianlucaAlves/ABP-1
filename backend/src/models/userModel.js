import pool from "../db.js";

export async function findUserByEmail(email) {
  const result = await pool.query("SELECT * FROM membros WHERE me_email = $1", [email]);
  return result.rows[0];
}

export async function createUser(name, cpf, email, hashedPassword, isAdmin, role) {
  const result = await pool.query(
    "INSERT INTO membros (me_nome, me_cpf, me_email, me_senha, me_administrador, me_cargo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, cpf, email, hashedPassword, isAdmin, role]
  );
  return result.rows[0];
}