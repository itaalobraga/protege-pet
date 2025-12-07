import pool from "../config/database.js";

class Animal {
  static async listarTodos() {
    const [rows] = await pool.query("SELECT * FROM animais ORDER BY nome");
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query("SELECT * FROM animais WHERE id = ?", [id]);
    return rows[0];
  }

  static async criar(animal) {
    const {
      nome,
      especie,
      raca,
      pelagem,
      sexo,
      data_nascimento,
      data_ocorrencia,
      local_resgate,
      porte,
      peso,
      status,
    } = animal;

    const [result] = await pool.query(
      `INSERT INTO animais (nome, especie, raca, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, especie, raca, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status || "Apto"]
    );

    return { id: result.insertId, ...animal };
  }

  static async atualizar(id, animal) {
    const {
      nome,
      especie,
      raca,
      pelagem,
      sexo,
      data_nascimento,
      data_ocorrencia,
      local_resgate,
      porte,
      peso,
      status,
    } = animal;

    const [result] = await pool.query(
      `UPDATE animais SET nome = ?, especie = ?, raca = ?, pelagem = ?, sexo = ?, data_nascimento = ?, data_ocorrencia = ?, local_resgate = ?, porte = ?, peso = ?, status = ? WHERE id = ?`,
      [nome, especie, raca, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }
    return { id, ...animal };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM animais WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `SELECT * FROM animais 
       WHERE nome LIKE ? 
       OR especie LIKE ? 
       OR raca LIKE ?
       OR status LIKE ?
       ORDER BY nome`,
      [termoBusca, termoBusca, termoBusca, termoBusca]
    );
    return rows;
  }
}

export default Animal;

