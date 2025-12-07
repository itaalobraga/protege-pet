import pool from "../config/database.js";

class Voluntario {
  static async listarTodos() {
    const [rows] = await pool.query(
      "SELECT * FROM voluntarios order by vlt_nome "
    );
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM voluntarios WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }

  static async criar(voluntario) {
    const { nome, cpf, telefone, vlt_tel_Residencial, email, disponibilidade } =
      voluntario;
    const [result] = await pool.query(
      `INSERT INTO voluntarios (vlt_nome, vlt_cpf, vlt_telefone, vlt_tel_Residencial, vlt_email, vlt_disponibilidade) VALUES (?,?,?,?,?,?)`,
      [nome, cpf, telefone, vlt_tel_Residencial, email, disponibilidade]
    );
    return {
      id: result.insertId,
      nome,
      cpf,
      telefone,
      vlt_tel_Residencial,
      email,
      disponibilidade,
    };
  }

  static async atualizar(id, voluntario) {
    const { nome, cpf, telefone, vlt_tel_Residencial, email, disponibilidade } =
      voluntario;
    const [result] = await pool.query(
      `UPDATE voluntarios SET vlt_nome = ?, vlt_cpf = ?, vlt_telefone = ?, vlt_tel_Residencial = ? ,vlt_email = ?, vlt_disponibilidade = ? WHERE id = ?`,
      [nome, cpf, telefone, vlt_tel_Residencial, email, disponibilidade, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }
    return {
      id: result.insertId,
      nome,
      cpf,
      telefone,
      vlt_tel_Residencial,
      email,
      disponibilidade,
    };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM voluntarios WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM voluntarios 
       WHERE vlt_nome LIKE ? 
       OR vlt_cpf LIKE ? 
       OR vlt_email LIKE ? 
       OR vlt_telefone LIKE ?
       ORDER BY vlt_nome`,
      [termoBusca, termoBusca, termoBusca, termoBusca]
    );
    return rows;
  }
}
export default Voluntario;
