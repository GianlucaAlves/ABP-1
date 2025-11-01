import express from "express";
import pool from "../db.js";
import { verifyAdmin, authenticateToken } from "../middleware/authMiddleware.js";
import bcrypt, { hash } from "bcrypt";

const router = express.Router();

// =======================
// LISTAR MEMBROS (GET) + filtro opcional por cargo
// =======================
router.get("/", async (req, res) => {
  try {
    const { cargo } = req.query; // filtro opcional
    let query = `
      SELECT m.*, c.ca_nome_cargo
      FROM membros m
      LEFT JOIN cargo c ON m.me_cargo = c.id_cargo
    `;
    const params = [];

    if (cargo) {
      query += " WHERE m.me_cargo = $1";
      params.push(cargo);
    }

    query += " ORDER BY m.id_membro DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar membros:", err);
    res.status(500).json({ error: "Erro ao listar membros" });
  }
});

router.get("/tipos-cargo", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cargo ORDER BY ca_nome_cargo");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar cargos" });
  }
});


// =======================
// CRIAR MEMBRO (POST)
// =======================
router.post("/", authenticateToken, verifyAdmin, async (req, res) => {
  try {
    const { me_nome, me_cpf, me_email, me_descricao, me_lattes, me_senha, me_imagem, me_administrador, me_cargo } = req.body;

    if (!me_nome || !me_cpf || !me_email || !me_senha) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

     const hashedPassword = await bcrypt.hash(me_senha, 10);

    const result = await pool.query(
      `INSERT INTO membros 
        (me_nome, me_cpf, me_email, me_descricao, me_lattes, me_senha, me_imagem, me_administrador, me_cargo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [me_nome, me_cpf, me_email, me_descricao || null, me_lattes || null, hashedPassword, me_imagem || null, me_administrador || false, me_cargo || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar membro:", err);
    res.status(500).json({ error: "Erro ao criar membro" });
  }
});

// =======================
// ATUALIZAR MEMBRO (PUT)
// =======================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { me_nome, me_cpf, me_email, me_descricao, me_lattes, hashedPassword, me_imagem, me_administrador, me_cargo } = req.body;

    const result = await pool.query(
      `UPDATE membros SET 
        me_nome=$1, me_cpf=$2, me_email=$3, me_descricao=$4, me_lattes=$5, me_senha=$6,
        me_imagem=$7, me_administrador=$8, me_cargo=$9
       WHERE id_membro=$10 RETURNING *`,
      [me_nome, me_cpf, me_email, me_descricao || null, me_lattes || null, hashedPassword, me_imagem || null, me_administrador || false, me_cargo || null, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Membro não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar membro:", err);
    res.status(500).json({ error: "Erro ao atualizar membro" });
  }
});

// =======================
// EXCLUIR MEMBRO (DELETE)
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM membros WHERE id_membro=$1", [id]);
    res.json({ message: "Membro removido com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir membro:", err);
    res.status(500).json({ error: "Erro ao excluir membro" });
  }
});

export default router;
