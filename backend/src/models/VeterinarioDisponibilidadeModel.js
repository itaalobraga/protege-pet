import pool from "../config/database.js";

class VeterinarioDisponibilidadeModel {
  static async listarPorVeterinario(veterinario_id) {
    const [rows] = await pool.query(
      `SELECT id, veterinario_id, dow, start_time, end_time
       FROM disponibilidades_veterinarios
       WHERE veterinario_id = ?
       ORDER BY dow, start_time`,
      [veterinario_id]
    );
    return rows;
  }

  static async listarSlots(veterinario_id) {
    const [rows] = await pool.query(
      `SELECT dow,
              TIME_FORMAT(start_time, '%H:%i') AS start,
              TIME_FORMAT(end_time, '%H:%i') AS end
       FROM disponibilidades_veterinarios
       WHERE veterinario_id = ?
       ORDER BY dow, start_time`,
      [veterinario_id]
    );
    return rows;
  }

  static async criar({ veterinario_id, dow, start_time, end_time }) {
    const [result] = await pool.query(
      `INSERT INTO disponibilidades_veterinarios (veterinario_id, dow, start_time, end_time)
       VALUES (?, ?, ?, ?)`,
      [veterinario_id, dow, start_time, end_time]
    );

    return {
      id: result.insertId,
      veterinario_id,
      dow,
      start_time,
      end_time,
    };
  }

  static async excluirPorVeterinario(veterinario_id) {
    const [result] = await pool.query(
      `DELETE FROM disponibilidades_veterinarios WHERE veterinario_id = ?`,
      [veterinario_id]
    );
    return result.affectedRows;
  }

  static async substituirPorVeterinario(veterinario_id, slots) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `DELETE FROM disponibilidades_veterinarios WHERE veterinario_id = ?`,
        [veterinario_id]
      );

      if (Array.isArray(slots) && slots.length) {
        const values = slots.map((s) => [
          veterinario_id,
          s.dow,
          s.start_time,
          s.end_time,
        ]);

        await connection.query(
          `INSERT INTO disponibilidades_veterinarios (veterinario_id, dow, start_time, end_time)
           VALUES ?`,
          [values]
        );
      }

      await connection.commit();

      return this.listarPorVeterinario(veterinario_id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }


}

export default VeterinarioDisponibilidadeModel;
