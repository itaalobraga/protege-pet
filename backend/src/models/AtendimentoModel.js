import pool from "../config/database.js";

class AtendimentoModel {
  static async listarTodos() {
    const query = `
      SELECT 
        c.id, 
        c.data_consulta AS data_atendimento, 
        c.peso, 
        c.observacao AS observacoes,
        a.nome AS animal_nome,
        v.nome AS veterinario_nome,
        d.nome AS diagnostico_nome
      FROM consultas_veterinarias c
      INNER JOIN animais a ON c.animal_id = a.id
      INNER JOIN veterinarios v ON c.veterinario_id = v.id
      LEFT JOIN diagnosticos d ON c.diagnostico_id = d.id
      ORDER BY c.data_consulta DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT
        c.id,
        c.data_consulta AS data_atendimento,
        c.peso,
        c.observacao AS observacoes,
        c.created_at,
        c.updated_at,
        a.id AS animal_id,
        a.nome AS animal_nome,
        v.id AS veterinario_id,
        v.nome AS veterinario_nome,
        c.diagnostico_id,
        d.nome AS diagnostico_nome
      FROM consultas_veterinarias c
      INNER JOIN animais a ON c.animal_id = a.id
      INNER JOIN veterinarios v ON c.veterinario_id = v.id
      LEFT JOIN diagnosticos d ON c.diagnostico_id = d.id
      WHERE c.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    const base = rows[0];
    if (!base) return null;

    const [examesRows] = await pool.query(
      `
      SELECT te.id, te.nome, te.descricao
      FROM consulta_exames ce
      INNER JOIN tipos_exames te ON ce.tipo_exame_id = te.id
      WHERE ce.consulta_id = ?
      ORDER BY te.nome ASC
    `,
      [id],
    );

    return { ...base, exames: examesRows };
  }

  static async registrar(dados, examesIds, connection) {
    const { animal_id, veterinario_id, diagnostico_id, peso, observacoes, data_atendimento } = dados;

    const queryConsulta = `
      INSERT INTO consultas_veterinarias 
      (animal_id, veterinario_id, diagnostico_id, peso, observacao, data_consulta)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const dataConsultaStr = data_atendimento || new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await connection.query(queryConsulta, [
      animal_id, 
      veterinario_id, 
      diagnostico_id || null, 
      peso || null, 
      observacoes || null,
      dataConsultaStr
    ]);

    const consultaId = result.insertId;

    if (examesIds && examesIds.length > 0) {
      const queryExames = `INSERT INTO consulta_exames (consulta_id, tipo_exame_id) VALUES ?`;
      
      const values = examesIds.map(exameId => [consultaId, exameId]);
      await connection.query(queryExames, [values]);
    }

    return { id: consultaId, ...dados, exames_solicitados: examesIds };
  }

  static async atualizar(id, dados, examesIds, connection) {
    const {
      animal_id,
      veterinario_id,
      diagnostico_id,
      peso,
      observacoes,
      data_atendimento,
    } = dados;

    const dataConsultaStr =
      data_atendimento ||
      new Date().toISOString().slice(0, 19).replace("T", " ");

    const [result] = await connection.query(
      `UPDATE consultas_veterinarias SET
        animal_id = ?,
        veterinario_id = ?,
        diagnostico_id = ?,
        peso = ?,
        observacao = ?,
        data_consulta = ?
      WHERE id = ?`,
      [
        animal_id,
        veterinario_id,
        diagnostico_id || null,
        peso ?? null,
        observacoes ?? null,
        dataConsultaStr,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return false;
    }

    await connection.query("DELETE FROM consulta_exames WHERE consulta_id = ?", [
      id,
    ]);

    if (examesIds && examesIds.length > 0) {
      const values = examesIds.map((exameId) => [id, exameId]);
      await connection.query(
        "INSERT INTO consulta_exames (consulta_id, tipo_exame_id) VALUES ?",
        [values],
      );
    }

    return true;
  }
}

export default AtendimentoModel;