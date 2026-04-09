import { randomUUID } from "crypto";
import pool from "../config/database.js";

class MinistracaoModel {
  static async listarTodos(prescricaoId = "") {
    const prescricao = String(prescricaoId || "").trim();

    const sqlBase = `
      SELECT
        mi.*,
        p.consulta_id,
        p.medicamento_id,
        p.status AS prescricao_status,
        m.nome AS medicamento_nome,
        c.animal_id,
        a.nome AS animal_nome,
        CONCAT(v.nome, ' ', v.sobrenome) AS responsavel_nome
      FROM ministracoes mi
      INNER JOIN prescricoes p ON p.id = mi.prescricao_id
      INNER JOIN medicamentos m ON m.id = p.medicamento_id
      INNER JOIN consultas_veterinarias c ON c.id = p.consulta_id
      INNER JOIN animais a ON a.id = c.animal_id
      INNER JOIN veterinarios v ON v.id = mi.responsavel_id
    `;

    if (!prescricao) {
      const [rows] = await pool.query(`${sqlBase} ORDER BY mi.data_hora DESC`);
      return rows;
    }

    const [rows] = await pool.query(
      `${sqlBase}
       WHERE mi.prescricao_id = ?
       ORDER BY mi.data_hora DESC`,
      [prescricao]
    );

    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `
        SELECT
          mi.*,
          p.consulta_id,
          p.medicamento_id,
          p.status AS prescricao_status,
          m.nome AS medicamento_nome,
          c.animal_id,
          a.nome AS animal_nome,
          CONCAT(v.nome, ' ', v.sobrenome) AS responsavel_nome
        FROM ministracoes mi
        INNER JOIN prescricoes p ON p.id = mi.prescricao_id
        INNER JOIN medicamentos m ON m.id = p.medicamento_id
        INNER JOIN consultas_veterinarias c ON c.id = p.consulta_id
        INNER JOIN animais a ON a.id = c.animal_id
        INNER JOIN veterinarios v ON v.id = mi.responsavel_id
        WHERE mi.id = ?
        LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  static async criarComBaixaEstoque(dados) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        prescricao_id,
        quantidade_aplicada,
        data_hora,
        responsavel_id,
        observacao,
      } = dados;

      const quantidade = Number(quantidade_aplicada);
      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error("Quantidade aplicada inválida");
      }

      const [prescricoes] = await connection.query(
        `
          SELECT
            p.id,
            p.status,
            p.medicamento_id,
            m.nome AS medicamento_nome
          FROM prescricoes p
          INNER JOIN medicamentos m ON m.id = p.medicamento_id
          WHERE p.id = ?
          FOR UPDATE
        `,
        [prescricao_id]
      );

      const prescricao = prescricoes[0];
      if (!prescricao) {
        throw new Error("Prescrição não encontrada");
      }

      if (prescricao.status !== "ATIVA") {
        throw new Error("Só é possível registrar ministração em prescrição ativa");
      }

      const [veterinarios] = await connection.query(
        `
          SELECT id, nome, sobrenome
          FROM veterinarios
          WHERE id = ?
          LIMIT 1
        `,
        [responsavel_id]
      );

      const responsavel = veterinarios[0];
      if (!responsavel) {
        throw new Error("Veterinário responsável não encontrado");
      }

      const produtoId = `m${prescricao.medicamento_id}`;

      const [produtos] = await connection.query(
        `
          SELECT id, nome, sku, quantidade
          FROM produtos
          WHERE id = ?
          FOR UPDATE
        `,
        [produtoId]
      );

      const produto = produtos[0];
      if (!produto) {
        throw new Error("Produto de estoque do medicamento não encontrado");
      }

      const quantidadeAtual = Number(produto.quantidade);
      if (quantidade > quantidadeAtual) {
        throw new Error("Saída maior que o estoque disponível");
      }

      const novaQuantidade = quantidadeAtual - quantidade;

      await connection.query(
        `
          UPDATE produtos
          SET quantidade = ?
          WHERE id = ?
        `,
        [novaQuantidade, produto.id]
      );

      const movimentacaoId = randomUUID();
      await connection.query(
        `
          INSERT INTO movimentacoes_estoque
          (
            id,
            produto_id,
            tipo,
            quantidade,
            motivo,
            observacao,
            responsavel
          )
          VALUES (?, ?, 'SAIDA', ?, 'USO_CLINICO', ?, ?)
        `,
        [
          movimentacaoId,
          produto.id,
          quantidade,
          observacao || `Ministração da prescrição ${prescricao.id}`,
          `${responsavel.nome} ${responsavel.sobrenome}`,
        ]
      );

      const [result] = await connection.query(
        `
          INSERT INTO ministracoes
          (
            prescricao_id,
            quantidade_aplicada,
            data_hora,
            responsavel_id,
            observacao
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          prescricao_id,
          quantidade,
          data_hora,
          responsavel_id,
          observacao || null,
        ]
      );

      await connection.commit();

      const [rows] = await connection.query(
        `
          SELECT
            mi.*,
            p.consulta_id,
            p.medicamento_id,
            p.status AS prescricao_status,
            m.nome AS medicamento_nome,
            c.animal_id,
            a.nome AS animal_nome,
            CONCAT(v.nome, ' ', v.sobrenome) AS responsavel_nome
          FROM ministracoes mi
          INNER JOIN prescricoes p ON p.id = mi.prescricao_id
          INNER JOIN medicamentos m ON m.id = p.medicamento_id
          INNER JOIN consultas_veterinarias c ON c.id = p.consulta_id
          INNER JOIN animais a ON a.id = c.animal_id
          INNER JOIN veterinarios v ON v.id = mi.responsavel_id
          WHERE mi.id = ?
          LIMIT 1
        `,
        [result.insertId]
      );

      return rows[0] || null;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default MinistracaoModel;
