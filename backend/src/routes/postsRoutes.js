import express from "express";
import pool from "../db.js";


async function getPostById(req, res) {
  try {
    const { id } = req.params; // Pega o 'id' da URL (ex: /posts/7)
    
    // Query pra buscar UM item pelo ID, juntando nome do autor
    const query = `
      SELECT c.*, m.me_nome AS autor_nome
      FROM conteudo c
      LEFT JOIN membros m ON c.co_autor = m.id_membro
      WHERE c.id_conteudo = $1
    `;
    
    const result = await pool.query(query, [id]);

    // Vê se achou alguma coisa
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vaga não encontrada" });
    }

    // Se achou, manda pro frontend (só o primeiro item)
    res.json(result.rows[0]);

  } catch (err) {
    console.error("Erro ao buscar conteúdo por ID:", err);
    res.status(500).json({ error: "Erro ao buscar conteúdo por ID" });
  }
}

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

router.get("/:id", getPostById); // Isso vai pegar o /posts/7

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(req.body)) {
      // Ignorar campos vazios ou nulos (evitar "")
      if (value === "" || value === null || value === undefined) continue;

      // Converter para número quando fizer sentido (evita erro em INT)
      const parsedValue =
        !isNaN(value) && value !== "" && value !== null
          ? Number(value)
          : value;

      fields.push(`${key} = $${index}`);
      values.push(parsedValue);
      index++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "Nenhum dado válido enviado para atualização" });
    }

    // Adiciona ID ao final
    values.push(Number(id));

    const query = `
      UPDATE conteudo
      SET ${fields.join(", ")}
      WHERE id_conteudo = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Conteúdo não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar conteúdo:", err.message, err);
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
