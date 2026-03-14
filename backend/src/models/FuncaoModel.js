import pool from "../config/database.js";

const permissoesDeRow = (row) => {
  if (!row.funcao_permissoes) return [];
  return row.funcao_permissoes.split(",").map((p) => p.trim()).filter(Boolean);
};

const mapearFuncao = (row) => ({
  ...row,
  permissoes: permissoesDeRow(row),
});

const queryBase = `
  SELECT f.*, GROUP_CONCAT(p.nome ORDER BY p.nome) as funcao_permissoes
  FROM funcoes f
  LEFT JOIN funcoes_permissoes fp ON f.id = fp.funcao_id
  LEFT JOIN permissoes p ON fp.permissao_id = p.id
`;

const queryGroupBy = `
  GROUP BY f.id, f.nome, f.created_at, f.updated_at
`;

class Funcao {
  static async listarTodos() {
    const [rows] = await pool.query(
      `${queryBase} ${queryGroupBy} ORDER BY f.nome`
    );
    return rows.map(mapearFuncao);
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `${queryBase} WHERE f.id = ? ${queryGroupBy}`,
      [id]
    );
    return rows[0] ? mapearFuncao(rows[0]) : null;
  }

  static async criar(funcao) {
    const { nome, permissoes } = funcao;
    const [result] = await pool.query(
      "INSERT INTO funcoes (nome) VALUES (?)",
      [nome]
    );
    const funcaoId = result.insertId;
    if (permissoes?.length) {
      const [permRows] = await pool.query(
        "SELECT id, nome FROM permissoes WHERE nome IN (?)",
        [permissoes]
      );
      const permMap = Object.fromEntries(permRows.map((r) => [r.nome, r.id]));
      for (const nomePerm of permissoes) {
        const permId = permMap[nomePerm];
        if (permId) {
          await pool.query(
            "INSERT INTO funcoes_permissoes (funcao_id, permissao_id) VALUES (?, ?)",
            [funcaoId, permId]
          );
        }
      }
    }
    return { id: funcaoId, nome, permissoes: permissoes || [] };
  }

  static async atualizar(id, funcao) {
    const { nome, permissoes } = funcao;
    const [result] = await pool.query(
      "UPDATE funcoes SET nome = ? WHERE id = ?",
      [nome, id]
    );
    if (result.affectedRows === 0) return null;
    await pool.query("DELETE FROM funcoes_permissoes WHERE funcao_id = ?", [
      id,
    ]);
    if (permissoes?.length) {
      const [permRows] = await pool.query(
        "SELECT id, nome FROM permissoes WHERE nome IN (?)",
        [permissoes]
      );
      const permMap = Object.fromEntries(permRows.map((r) => [r.nome, r.id]));
      for (const nomePerm of permissoes) {
        const permId = permMap[nomePerm];
        if (permId) {
          await pool.query(
            "INSERT INTO funcoes_permissoes (funcao_id, permissao_id) VALUES (?, ?)",
            [id, permId]
          );
        }
      }
    }
    return { id: parseInt(id), nome, permissoes: permissoes || [] };
  }

  static async excluir(id) {
    const [result] = await pool.query("DELETE FROM funcoes WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }

  static async filtrar(termo) {
    const termoBusca = `%${termo}%`;
    const [rows] = await pool.query(
      `${queryBase} WHERE f.nome LIKE ? ${queryGroupBy} ORDER BY f.nome`,
      [termoBusca]
    );
    return rows.map(mapearFuncao);
  }

  static async buscarPorNome(nome) {
    const [rows] = await pool.query(
      `${queryBase} WHERE f.nome = ? ${queryGroupBy}`,
      [nome]
    );
    return rows[0] ? mapearFuncao(rows[0]) : null;
  }

  static async contarUsuarios(funcaoId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM usuarios WHERE funcao_id = ?",
      [funcaoId]
    );
    return rows[0].total;
  }

  static async listarPermissoes() {
    const [rows] = await pool.query("SELECT nome FROM permissoes ORDER BY nome");
    return rows.map((r) => r.nome);
  }
}

export default Funcao;
