import pool from "../config/database.js";
import { randomUUID } from "crypto";

class MovimentacaoEstoqueModel {
  static async listarTodos(termo = "") {
    let query = `
      SELECT
        m.id,
        m.produto_id,
        p.nome AS produto_nome,
        p.sku AS produto_sku,
        m.tipo,
        m.quantidade,
        m.motivo,
        m.observacao,
        m.responsavel,
        m.created_at
      FROM movimentacoes_estoque m
      JOIN produtos p ON p.id = m.produto_id
    `;

    const params = [];

    if (termo) {
      query += `
        WHERE
          p.nome LIKE ?
          OR p.sku LIKE ?
          OR m.tipo LIKE ?
          OR m.motivo LIKE ?
          OR REPLACE(m.motivo, '_', ' ') LIKE ?
          OR COALESCE(m.responsavel, '') LIKE ?
          OR COALESCE(m.observacao, '') LIKE ?
      `;
      const like = `%${termo}%`;
      params.push(like, like, like, like, like, like, like);
    }

    query += ` ORDER BY m.created_at DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async buscarPorId(id) {
    const [rows] = await pool.query(
      `
      SELECT
        m.id,
        m.produto_id,
        p.nome AS produto_nome,
        p.sku AS produto_sku,
        m.tipo,
        m.quantidade,
        m.motivo,
        m.observacao,
        m.responsavel,
        m.created_at
      FROM movimentacoes_estoque m
      JOIN produtos p ON p.id = m.produto_id
      WHERE m.id = ?
      `,
      [id]
    );
    return rows[0] || null;
  }

  static async criarMovimentacao(dados) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        produto_id,
        tipo,
        quantidade,
        motivo,
        observacao,
        responsavel,
      } = dados;

      const [produtos] = await connection.query(
        `
          SELECT id, nome, sku, quantidade
          FROM produtos
          WHERE id = ?
          FOR UPDATE
        `,
        [produto_id]
      );

      const produto = produtos[0];

      if (!produto) {
        throw new Error("Produto não encontrado");
      }

      const quantidadeNumero = Number(quantidade);

      if (!Number.isInteger(quantidadeNumero) || quantidadeNumero <= 0) {
        throw new Error("Quantidade inválida");
      }

      let novaQuantidade = Number(produto.quantidade);

      if (tipo === "ENTRADA") {
        novaQuantidade += quantidadeNumero;
      } else if (tipo === "SAIDA") {
        if (quantidadeNumero > novaQuantidade) {
          throw new Error("Saída maior que o estoque disponível");
        }
        novaQuantidade -= quantidadeNumero;
      } else {
        throw new Error("Tipo de movimentação inválido");
      }

      await connection.query(
        `
          UPDATE produtos
          SET quantidade = ?
          WHERE id = ?
        `,
        [novaQuantidade, produto_id]
      );

      const id = randomUUID();

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
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          produto_id,
          tipo,
          quantidadeNumero,
          motivo,
          observacao || null,
          responsavel || null,
        ]
      );

      await connection.commit();

      return {
        id,
        produto_id,
        produto_nome: produto.nome,
        produto_sku: produto.sku,
        tipo,
        quantidade: quantidadeNumero,
        motivo,
        observacao: observacao || null,
        responsavel: responsavel || null,
        quantidade_anterior: Number(produto.quantidade),
        quantidade_atual: novaQuantidade,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default MovimentacaoEstoqueModel;