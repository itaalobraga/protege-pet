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
}

export default AtendimentoModel;