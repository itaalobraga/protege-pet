import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// Permite rodar do host: MySQL em Docker expõe porta no localhost
const dbHost = process.env.DB_HOST === "mysql" ? "localhost" : process.env.DB_HOST;

import mysql2 from "mysql2/promise";
const pool = mysql2.createPool({
  host: dbHost,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
import { randomUUID } from "crypto";

async function criarUsuarioTeste() {
  const email = "jusileana@quinz.me";
  const senha = "123";

  const senhaHash = await bcrypt.hash(senha, 10);
  const id = randomUUID();

  try {
    await pool.query(
      `INSERT INTO usuarios (id, nome, funcao_id, telefone, email, disponibilidade, senha)
       VALUES (?, ?, 1, '(18) 99999-9999', ?, 'Integral', ?)`,
      [id, "Jusileana Teste", email, senhaHash]
    );
    console.log(`✓ Usuário criado com sucesso!`);
    console.log(`  Email: ${email}`);
    console.log(`  Senha: ${senha}`);
    process.exit(0);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.log(`Usuário com email ${email} já existe.`);
      process.exit(0);
    }
    console.error("Erro:", err.message);
    process.exit(1);
  }
}

criarUsuarioTeste();
