import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const conectar = async (tentativas = 10, intervalo = 3000) => {
  for (let i = 1; i <= tentativas; i++) {
    try {
      const connection = await pool.getConnection();
      console.log("✓ Banco de dados conectado!");
      connection.release();
      return;
    } catch {
      if (i < tentativas) {
        console.log(`Aguardando MySQL... (${i}/${tentativas})`);
        await new Promise((r) => setTimeout(r, intervalo));
      } else {
        console.error("✗ Falha ao conectar ao banco de dados");
        process.exit(1);
      }
    }
  }
};

conectar();

export default pool;
