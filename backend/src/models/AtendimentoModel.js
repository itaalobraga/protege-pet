import pool from "../config/database.js";

class AtendimentoModel {
  static async listarTodos() {
    const query = `
      SELECT 
        a.id,
        a.consulta_id,
        c.data_consulta AS data_atendimento,
        a.peso,
        a.observacao AS observacoes,
        anim.nome AS animal_nome,
        v.nome AS veterinario_nome,
        d.nome AS diagnostico_nome
      FROM atendimentos a
      INNER JOIN consultas_veterinarias c ON a.consulta_id = c.id
      INNER JOIN animais anim ON c.animal_id = anim.id
      INNER JOIN veterinarios v ON c.veterinario_id = v.id
      LEFT JOIN diagnosticos d ON a.diagnostico_id = d.id
      ORDER BY c.data_consulta DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }

  static async buscarPorId(id) {
    const query = `
      SELECT
        a.id,
        a.consulta_id,
        c.data_consulta AS data_atendimento,
        a.peso,
        a.observacao AS observacoes,
        a.created_at,
        a.updated_at,
        c.animal_id,
        anim.nome AS animal_nome,
        c.veterinario_id,
        v.nome AS veterinario_nome,
        c.observacao AS observacao_agenda,
        a.diagnostico_id,
        d.nome AS diagnostico_nome
      FROM atendimentos a
      INNER JOIN consultas_veterinarias c ON a.consulta_id = c.id
      INNER JOIN animais anim ON c.animal_id = anim.id
      INNER JOIN veterinarios v ON c.veterinario_id = v.id
      LEFT JOIN diagnosticos d ON a.diagnostico_id = d.id
      WHERE a.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    const base = rows[0];
    if (!base) return null;

    const [examesRows] = await pool.query(
      `
      SELECT te.id, te.nome, te.descricao
      FROM atendimento_exames ae
      INNER JOIN tipos_exames te ON ae.tipo_exame_id = te.id
      WHERE ae.atendimento_id = ?
      ORDER BY te.nome ASC
    `,
      [id],
    );

    return { ...base, exames: examesRows };
  }

  static async registrar(dados, examesIds, connection) {
    const { consulta_id, diagnostico_id, peso, observacoes } = dados;

    const queryAtendimento = `
      INSERT INTO atendimentos 
      (consulta_id, diagnostico_id, peso, observacao)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await connection.query(queryAtendimento, [
      consulta_id,
      diagnostico_id || null,
      peso ?? null,
      observacoes || null,
    ]);

    const atendimentoId = result.insertId;

    if (examesIds && examesIds.length > 0) {
      const queryExames = `INSERT INTO atendimento_exames (atendimento_id, tipo_exame_id) VALUES ?`;
      const values = examesIds.map((exameId) => [atendimentoId, exameId]);
      await connection.query(queryExames, [values]);
    }

    return { id: atendimentoId, consulta_id, ...dados, exames_solicitados: examesIds };
  }

  static async atualizar(id, dadosConsulta, dadosAtendimento, examesIds, connection) {
    const { animal_id, veterinario_id, data_consulta } = dadosConsulta;
    const { diagnostico_id, peso, observacoes } = dadosAtendimento;

    const [atRows] = await connection.query(
      "SELECT consulta_id FROM atendimentos WHERE id = ? FOR UPDATE",
      [id],
    );
    const consultaId = atRows[0]?.consulta_id;
    if (!consultaId) {
      return false;
    }

    const dataConsultaStr =
      data_consulta ||
      new Date().toISOString().slice(0, 19).replace("T", " ");

    const [updConsulta] = await connection.query(
      `UPDATE consultas_veterinarias SET
        animal_id = ?,
        veterinario_id = ?,
        data_consulta = ?
      WHERE id = ?`,
      [animal_id, veterinario_id, dataConsultaStr, consultaId],
    );

    if (updConsulta.affectedRows === 0) {
      return false;
    }

    const [updAt] = await connection.query(
      `UPDATE atendimentos SET
        diagnostico_id = ?,
        peso = ?,
        observacao = ?
      WHERE id = ?`,
      [diagnostico_id || null, peso ?? null, observacoes ?? null, id],
    );

    if (updAt.affectedRows === 0) {
      return false;
    }

    await connection.query("DELETE FROM atendimento_exames WHERE atendimento_id = ?", [id]);

    if (examesIds && examesIds.length > 0) {
      const values = examesIds.map((exameId) => [id, exameId]);
      await connection.query(
        "INSERT INTO atendimento_exames (atendimento_id, tipo_exame_id) VALUES ?",
        [values],
      );
    }

    return true;
  }
}

export default AtendimentoModel;
