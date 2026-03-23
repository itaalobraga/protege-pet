import pool from "../config/database.js";

class Adocao {
  static async listarTodos() {
    const [rows] = await pool.query(`
      SELECT
        a.*,
        an.nome AS animal_nome,
        an.especie AS animal_especie,
        r.nome AS raca_nome
      FROM adocoes a
      JOIN animais an ON a.animal_id = an.id
      LEFT JOIN racas r ON an.raca_id = r.id
      ORDER BY a.created_at DESC
    `);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT a.*, an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       WHERE a.id = ?`,
      [id],
    );
    return rows[0];
  }

  static async criar(adocao) {
    const { nome, cpf, telefone, email, animal_id } = adocao;

    const [result] = await pool.query(
      `INSERT INTO adocoes (nome, cpf, telefone, email, animal_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, cpf, telefone, email, animal_id],
    );

    return {
      id: result.insertId,
      nome,
      cpf,
      telefone,
      email,
      animal_id,
    };
  }

  static async atualizar(id, adocao) {
    const { nome, cpf, telefone, email, animal_id } = adocao;

    const [result] = await pool.query(
      `UPDATE adocoes
       SET nome = ?, cpf = ?, telefone = ?, email = ?, animal_id = ?
       WHERE id = ?`,
      [nome, cpf, telefone, email, animal_id, id],
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return { id, nome, cpf, telefone, email, animal_id };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM adocoes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;

    const [rows] = await pool.query(
      `SELECT a.*, an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       WHERE a.nome LIKE ?
       OR a.email LIKE ?
       OR a.cpf LIKE ?
       OR an.nome LIKE ?
       ORDER BY a.created_at DESC`,
      [termoBusca, termoBusca, termoBusca, termoBusca],
    );

    return rows;
  }

  static async buscarPorAnimal(animal_id) {
    const [rows] = await pool.query(
      `SELECT a.*, an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       WHERE a.animal_id = ?
       ORDER BY a.created_at DESC`,
      [animal_id],
    );
    return rows;
  }

  static async buscarPorCPF(cpf) {
    const [rows] = await pool.query(
      `SELECT a.*, an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       WHERE a.cpf = ?`,
      [cpf],
    );
    return rows[0];
  }

  static async buscarPorEmail(email) {
    const [rows] = await pool.query(
      `SELECT a.*, an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       WHERE a.email = ?`,
      [email],
    );
    return rows[0];
  }
}

export default Adocao;
