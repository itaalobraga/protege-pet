import pool from "../config/database.js";

class Animal {
  static async listarTodos() {
    const query = `
      SELECT a.*, r.nome as nome_raca 
      FROM animais a 
      LEFT JOIN racas r ON a.raca_id = r.id 
      ORDER BY a.nome
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT a.*, r.nome as nome_raca 
      FROM animais a 
      LEFT JOIN racas r ON a.raca_id = r.id 
      WHERE a.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async criar(animal) {
    const {
      nome,
      especie,
      raca_id, 
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
      `INSERT INTO animais (nome, especie, raca_id, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, especie, raca_id, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status || "Apto"]
    );

    return { id: result.insertId, ...animal };
  }


  static async atualizar(id, animal) {
    const {
      nome,
      especie,
      raca_id, 
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
      `UPDATE animais SET nome = ?, especie = ?, raca_id = ?, pelagem = ?, sexo = ?, data_nascimento = ?, data_ocorrencia = ?, local_resgate = ?, porte = ?, peso = ?, status = ? WHERE id = ?`,
      [nome, especie, raca_id, pelagem, sexo, data_nascimento, data_ocorrencia, local_resgate, porte, peso, status, id]
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
    const query = `
      SELECT a.*, r.nome as nome_raca 
      FROM animais a 
      LEFT JOIN racas r ON a.raca_id = r.id 
      WHERE a.nome LIKE ? 
      OR a.especie LIKE ? 
      OR r.nome LIKE ?  
      OR a.status LIKE ?
      ORDER BY a.nome
    `;
    const [rows] = await pool.query(query, [termoBusca, termoBusca, termoBusca, termoBusca]);
    return rows;
  }
}

export default Animal;