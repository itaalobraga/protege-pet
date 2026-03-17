import pool from "../config/database.js";
import crypto from "crypto";

class PasswordResetToken {
  static async criar(usuarioId) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiraEm = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await pool.query(
      `INSERT INTO tokens_recuperacao_senha (usuario_id, token, expira_em)
       VALUES (?, ?, ?)`,
      [usuarioId, token, expiraEm]
    );

    return { token, expiraEm };
  }

  static async buscarPorToken(token) {
    const [rows] = await pool.query(
      `SELECT prt.*, u.email
       FROM tokens_recuperacao_senha prt
       INNER JOIN usuarios u ON prt.usuario_id = u.id
       WHERE prt.token = ? AND prt.usado_em IS NULL AND prt.expira_em > NOW()`,
      [token]
    );
    return rows[0];
  }

  static async marcarComoUsado(token) {
    const [result] = await pool.query(
      `UPDATE tokens_recuperacao_senha SET usado_em = NOW() WHERE token = ?`,
      [token]
    );
    return result.affectedRows > 0;
  }

  static async invalidarTokensDoUsuario(usuarioId) {
    await pool.query(
      `UPDATE tokens_recuperacao_senha SET usado_em = NOW() WHERE usuario_id = ? AND usado_em IS NULL`,
      [usuarioId]
    );
  }
}

export default PasswordResetToken;
