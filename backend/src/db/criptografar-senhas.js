import bcrypt from "bcrypt";
import pool from "../db.js"; // ajusta o caminho se seu db.js estiver em outro local

async function criptografarSenhas() {
  try {
    console.log("🔍 Buscando membros...");

    const { rows: membros } = await pool.query("SELECT id_membro, me_senha FROM membros");

    for (const membro of membros) {
      const senha = membro.me_senha;

      // Se a senha já começar com "$2b$", ela já está criptografada
      if (senha.startsWith("$2b$")) {
        console.log(`✅ Membro ${membro.id_membro} já possui senha criptografada.`);
        continue;
      }

      // Criptografa a senha
      const hashed = await bcrypt.hash(senha, 10);

      // Atualiza no banco
      await pool.query("UPDATE membros SET me_senha = $1 WHERE id_membro = $2", [hashed, membro.id_membro]);
      console.log(`🔒 Senha do membro ${membro.id_membro} criptografada com sucesso.`);
    }

    console.log("✨ Todas as senhas foram processadas!");
    process.exit();
  } catch (err) {
    console.error("❌ Erro ao criptografar senhas:", err);
    process.exit(1);
  }
}

criptografarSenhas();
