import express from "express";
import db from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rota protegida — acessível apenas com token válido
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await db.query("SELECT id_membro, me_nome, me_email, me_cargo FROM membros WHERE id_membro = $1", [req.userId]);
    const user = result.rows[0];
    res.json(user);
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

export default router;