import pool from '../config/database.js';

const RacaModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM racas ORDER BY nome ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM racas WHERE id = ?', [id]);
    return rows[0]; 
  },

  create: async (nome, especie) => {
    const [result] = await pool.query('INSERT INTO racas (nome, especie) VALUES (?, ?)', [nome, especie]);
    return result;
  },

  update: async (id, nome, especie) => {
    const [result] = await pool.query('UPDATE racas SET nome = ?, especie = ? WHERE id = ?', [nome, especie, id]);
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM racas WHERE id = ?', [id]);
    return result;
  }
};

export default RacaModel;