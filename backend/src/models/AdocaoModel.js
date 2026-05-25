import pool from "../config/database.js";

class Adocao {
  static async listarTodos() {
    const [rows] = await pool.query(`
      SELECT
        a.*,
        arq.id AS termo_arquivo_id,
        arq.nome_original AS termo_nome_original,
        arq.mime_type AS termo_mime_type,
        arq.tamanho_bytes AS termo_tamanho_bytes,
        an.nome AS animal_nome,
        an.especie AS animal_especie,
        r.nome AS raca_nome
      FROM adocoes a
      JOIN animais an ON a.animal_id = an.id
      LEFT JOIN racas r ON an.raca_id = r.id
      LEFT JOIN arquivos arq ON arq.id = a.termo_arquivo_id
      ORDER BY a.created_at DESC
    `);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT a.*,
              arq.id AS termo_arquivo_id,
              arq.nome_original AS termo_nome_original,
              arq.mime_type AS termo_mime_type,
              arq.tamanho_bytes AS termo_tamanho_bytes,
              an.nome AS animal_nome,
              an.especie AS animal_especie,
              r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       LEFT JOIN arquivos arq ON arq.id = a.termo_arquivo_id
       WHERE a.id = ?`,
      [id],
    );
    return rows[0];
  }

  static async criar(adocao, connectionParam = null) {
    const { nome, cpf, telefone, email, animal_id, termo_arquivo_id = null } = adocao;
    const connection = connectionParam || pool;

    const [result] = await connection.query(
      `INSERT INTO adocoes (nome, cpf, telefone, email, animal_id, termo_arquivo_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, cpf, telefone, email, animal_id, termo_arquivo_id],
    );

    return {
      id: result.insertId,
      nome,
      cpf,
      telefone,
      email,
      animal_id,
      termo_arquivo_id,
    };
  }

  static async atualizar(id, adocao) {
    const { nome, cpf, telefone, email, animal_id, termo_arquivo_id = undefined } = adocao;

    // update parcial: se termo_arquivo_id vier como undefined, não mexe.
    const sets = [
      "nome = ?",
      "cpf = ?",
      "telefone = ?",
      "email = ?",
      "animal_id = ?",
    ];
    const params = [nome, cpf, telefone, email, animal_id];

    if (termo_arquivo_id !== undefined) {
      sets.push("termo_arquivo_id = ?");
      params.push(termo_arquivo_id);
    }

    params.push(id);

    const [result] = await pool.query(
      `UPDATE adocoes
       SET ${sets.join(", ")}
       WHERE id = ?`,
      params,
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.buscarPorId(id);
  }

  static async excluir(id, connectionParam = null) {
    const connection = connectionParam || pool;
    const [result] = await connection.query("DELETE FROM adocoes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }



  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;

    const [rows] = await pool.query(
      `SELECT a.*,
              arq.id AS termo_arquivo_id,
              arq.nome_original AS termo_nome_original,
              arq.mime_type AS termo_mime_type,
              arq.tamanho_bytes AS termo_tamanho_bytes,
              an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       LEFT JOIN arquivos arq ON arq.id = a.termo_arquivo_id
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
      `SELECT a.*,
              arq.id AS termo_arquivo_id,
              arq.nome_original AS termo_nome_original,
              arq.mime_type AS termo_mime_type,
              arq.tamanho_bytes AS termo_tamanho_bytes,
              an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       LEFT JOIN arquivos arq ON arq.id = a.termo_arquivo_id
       WHERE a.animal_id = ?
       ORDER BY a.created_at DESC`,
      [animal_id],
    );
    return rows;
  }

  static async buscarPorCPF(cpf) {
    const [rows] = await pool.query(
      `SELECT a.*,
              arq.id AS termo_arquivo_id,
              arq.nome_original AS termo_nome_original,
              arq.mime_type AS termo_mime_type,
              arq.tamanho_bytes AS termo_tamanho_bytes,
              an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       LEFT JOIN arquivos arq ON arq.id = a.termo_arquivo_id
       WHERE a.cpf = ?`,
      [cpf],
    );
    return rows[0];
  }

  static async buscarPorEmail(email) {
    const [rows] = await pool.query(
      `SELECT a.*,
              arq.id AS termo_arquivo_id,
              arq.nome_original AS termo_nome_original,
              arq.mime_type AS termo_mime_type,
              arq.tamanho_bytes AS termo_tamanho_bytes,
              an.nome AS animal_nome, an.especie AS animal_especie, r.nome AS raca_nome
       FROM adocoes a
       JOIN animais an ON a.animal_id = an.id
       LEFT JOIN racas r ON an.raca_id = r.id
       LEFT JOIN arquivos arq ON arq.id = a.termo_arquivo_id
       WHERE a.email = ?`,
      [email],
    );
    return rows[0];
  }
}

export default Adocao;
