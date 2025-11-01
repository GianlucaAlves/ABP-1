import express from "express";
import pool from "../db.js";

const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const { co_titulo, co_autor, co_pdf, co_citacao, co_doi, co_data, co_lide,
            co_status, co_data_inicio, co_data_termino, co_objetivo, co_requisitos,
            co_plano_trabalho, co_atividades, co_tipo_conteudo } = req.body;

    if (!co_titulo || !co_tipo_conteudo) 
      return res.status(400).json({ error: "Título e tipo de conteúdo são obrigatórios" });

    const result = await pool.query(
  `INSERT INTO conteudo
  (co_titulo, co_autor, co_tipo_conteudo, co_pdf, co_citacao, co_doi, co_lide, co_status,
   co_data_inicio, co_data_termino, co_objetivo, co_requisitos, co_plano_trabalho, co_atividades)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
  [
    co_titulo,
    co_autor,
    co_tipo_conteudo,
    co_pdf || null,
    co_citacao || null,
    co_doi || null,
    co_lide || null,
    co_status || null,
    co_data_inicio || null,
    co_data_termino || null,
    co_objetivo || null,
    co_requisitos || null,
    co_plano_trabalho || null,
    co_atividades || null
  ]
);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar conteúdo:", err);
    res.status(500).json({ error: "Erro ao criar conteúdo" });
  }
});

// READ ALL ou por tipo
router.get("/", async (req, res) => {
  try {
    const { tipo } = req.query; // opcional, id do tipo de conteúdo
    let query = `
      SELECT c.*, t.tc_conteudo, m.me_nome AS autor_nome
      FROM conteudo c
      LEFT JOIN tipo_conteudo t ON c.co_tipo_conteudo = t.id_tipo_conteudo
      LEFT JOIN membros m ON c.co_autor = m.id_membro
    `;
    const params = [];

    if (tipo) {
      query += " WHERE c.co_tipo_conteudo = $1";
      params.push(tipo);
    }

    query += " ORDER BY c.co_data DESC NULLS LAST";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao listar conteúdos:", err);
    res.status(500).json({ error: "Erro ao listar conteúdos" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { co_titulo, co_autor, co_pdf, co_citacao, co_doi, co_data, co_lide,
            co_status, co_data_inicio, co_data_termino, co_objetivo, co_requisitos,
            co_plano_trabalho, co_atividades, co_tipo_conteudo } = req.body;

    const result = await pool.query(
      `UPDATE conteudo SET
        co_titulo=$1, co_autor=$2, co_pdf=$3, co_citacao=$4, co_doi=$5, co_data=$6, co_lide=$7,
        co_status=$8, co_data_inicio=$9, co_data_termino=$10, co_objetivo=$11, co_requisitos=$12,
        co_plano_trabalho=$13, co_atividades=$14, co_tipo_conteudo=$15
       WHERE id_conteudo=$16 RETURNING *`,
      [co_titulo, co_autor, co_pdf, co_citacao, co_doi, co_data, co_lide,
       co_status, co_data_inicio, co_data_termino, co_objetivo, co_requisitos,
       co_plano_trabalho, co_atividades, co_tipo_conteudo, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Conteúdo não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar conteúdo:", err);
    res.status(500).json({ error: "Erro ao atualizar conteúdo" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM conteudo WHERE id_conteudo=$1", [id]);
    res.json({ message: "Conteúdo removido com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir conteúdo:", err);
    res.status(500).json({ error: "Erro ao excluir conteúdo" });
  }
});

export default router;
