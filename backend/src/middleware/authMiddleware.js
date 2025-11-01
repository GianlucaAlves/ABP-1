import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // pega o token após "Bearer "

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }
    req.user = user; // aqui fica { id, email, isAdmin }
    next();
  });
}

/**
 * Middleware para verificar se o usuário é administrador.
 * Deve ser usado **após** authenticateToken.
 */
export function verifyAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Acesso negado" });
  }
  next();
}
