import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.JWT_SECRET;

// =======================
// ROTA DE REGISTRO
// =======================
export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword);

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
}

// =======================
// ROTA DE LOGIN
// =======================
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    console.log("Usuário encontrado:", user);
    
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado." });
    }

    const passwordMatch = await bcrypt.compare(password, user.me_senha);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    console.log("Valor de me_administrador antes do token:", user.me_administrador);
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id_membro, email: user.me_email, isAdmin: user.me_administrador === true || user.me_administrador === "t" },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login bem-sucedido!",
      token,
      user: { id: user.id_membro, name: user.me_nome, email: user.me_email, isAdmin: user.me_administrador === true || user.me_administrador === "t" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
}