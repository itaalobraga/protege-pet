import pool from "../config/database.js";

function toMysqlDateTime(value) {
  if (!value) return value;
  if (typeof value === "string") return value;
  if (value instanceof Date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(
      value.getHours()
    )}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  }
  return value;
}

function normalizeRow(row) {
  if (!row) return row;
  return {
    ...row,
    data_consulta: toMysqlDateTime(row.data_consulta),
  };
}

class ConsultaVeterinariaModel {
  static async criar({ veterinario_id, animal_id, data_consulta, observacao }) {
    const [result] = await pool.query(
      `INSERT INTO consultas_veterinarias (veterinario_id, animal_id, data_consulta, observacao)
       VALUES (?, ?, ?, ?)`,
      [veterinario_id, animal_id, data_consulta, observacao ?? null]
    );

    return {
      id: result.insertId,
      veterinario_id,
      animal_id,
      data_consulta,
      observacao: observacao ?? null,
    };
  }

  static async atualizar(id, { veterinario_id, animal_id, data_consulta, observacao }) {
    const [result] = await pool.query(
      `UPDATE consultas_veterinarias
       SET veterinario_id = ?, animal_id = ?, data_consulta = ?, observacao = ?
       WHERE id = ?`,
      [veterinario_id, animal_id, data_consulta, observacao ?? null, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id,
      veterinario_id,
      animal_id,
      data_consulta,
      observacao: observacao ?? null,
    };
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `SELECT * FROM consultas_veterinarias WHERE id = ?`,
      [id]
    );
    return normalizeRow(rows[0]);
  }

  static async buscarDetalhesPorId(id) {
    const [rows] = await pool.query(
      `SELECT
        consultas_veterinarias.*,
        veterinarios.nome AS veterinario_nome,
        veterinarios.sobrenome AS veterinario_sobrenome,
        veterinarios.email AS veterinario_email,
        animais.nome AS animal_nome
      FROM consultas_veterinarias
      INNER JOIN veterinarios ON veterinarios.id = consultas_veterinarias.veterinario_id
      INNER JOIN animais ON animais.id = consultas_veterinarias.animal_id
      WHERE consultas_veterinarias.id = ?
      LIMIT 1`,
      [id]
    );
    return normalizeRow(rows[0]);
  }

  static async listar({ veterinario_id, animal_id, inicio, fim }) {
    const where = [];
    const params = [];

    if (veterinario_id) {
      where.push("veterinario_id = ?");
      params.push(veterinario_id);
    }

    if (animal_id) {
      where.push("animal_id = ?");
      params.push(animal_id);
    }

    if (inicio) {
      where.push("data_consulta >= ?");
      params.push(inicio);
    }

    if (fim) {
      where.push("data_consulta <= ?");
      params.push(fim);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT
        consultas_veterinarias.*,
        veterinarios.nome AS veterinario_nome,
        animais.nome AS animal_nome
      FROM consultas_veterinarias
      INNER JOIN veterinarios ON veterinarios.id = consultas_veterinarias.veterinario_id
      INNER JOIN animais ON animais.id = consultas_veterinarias.animal_id
      ${whereSql}
      ORDER BY data_consulta DESC`,
      params
    );

    return rows.map(normalizeRow);
  }

  static async existeConflito({ veterinario_id, data_consulta }) {
    const [rows] = await pool.query(
      `SELECT 1
       FROM consultas_veterinarias
       WHERE veterinario_id = ?
         AND data_consulta = ?
       LIMIT 1`,
      [veterinario_id, data_consulta]
    );
    return rows.length > 0;
  }

  static async existeConflitoDiferente({ id, veterinario_id, data_consulta }) {
    const [rows] = await pool.query(
      `SELECT 1
       FROM consultas_veterinarias
       WHERE veterinario_id = ?
         AND data_consulta = ?
         AND id <> ?
       LIMIT 1`,
      [veterinario_id, data_consulta, id]
    );
    return rows.length > 0;
  }

  static async excluir(id) {
    const [result] = await pool.query(
      `DELETE FROM consultas_veterinarias WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default ConsultaVeterinariaModel;
