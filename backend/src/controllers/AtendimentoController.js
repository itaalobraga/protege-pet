import AtendimentoModel from "../models/AtendimentoModel.js";
import pool from "../config/database.js";

class AtendimentoController {
  static async listar(req, res) {
    try {
      const atendimentos = await AtendimentoModel.listarTodos();
      res.json(atendimentos);
    } catch (error) {
      console.error("Erro ao listar atendimentos:", error);
      res
        .status(500)
        .json({ error: "Erro ao carregar o histórico de atendimentos" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Identificador inválido" });
      }
      const atendimento = await AtendimentoModel.buscarPorId(id);
      if (!atendimento) {
        return res.status(404).json({ error: "Atendimento não encontrado" });
      }
      res.json(atendimento);
    } catch (error) {
      console.error("Erro ao buscar atendimento:", error);
      res.status(500).json({ error: "Erro ao carregar o atendimento" });
    }
  }

  static async criar(req, res) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        animal_id,
        veterinario_id,
        diagnostico_id,
        peso,
        observacoes,
        exames,
        data_atendimento,
      } = req.body;

      if (!animal_id || !veterinario_id) {
        return res
          .status(400)
          .json({ error: "Selecione o Animal e o Veterinário responsável." });
      }

      const novoAtendimento = await AtendimentoModel.registrar(
        {
          animal_id,
          veterinario_id,
          diagnostico_id,
          peso,
          observacoes,
          data_atendimento,
        },
        exames,
        connection,
      );

      await connection.commit();
      res.status(201).json(novoAtendimento);
    } catch (error) {
      await connection.rollback();
      console.error("Erro ao registrar atendimento:", error);
      res
        .status(500)
        .json({ error: "Erro interno ao salvar atendimento clínico" });
    } finally {
      connection.release();
    }
  }

  static async atualizar(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Identificador inválido" });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const existente = await AtendimentoModel.buscarPorId(id);
      if (!existente) {
        await connection.rollback();
        return res.status(404).json({ error: "Atendimento não encontrado" });
      }

      const {
        animal_id,
        veterinario_id,
        diagnostico_id,
        peso,
        observacoes,
        exames,
        data_atendimento,
      } = req.body;

      if (!animal_id || !veterinario_id) {
        await connection.rollback();
        return res
          .status(400)
          .json({ error: "Selecione o Animal e o Veterinário responsável." });
      }

      const ok = await AtendimentoModel.atualizar(
        id,
        {
          animal_id,
          veterinario_id,
          diagnostico_id,
          peso,
          observacoes,
          data_atendimento,
        },
        exames,
        connection,
      );

      if (!ok) {
        await connection.rollback();
        return res.status(404).json({ error: "Atendimento não encontrado" });
      }

      await connection.commit();
      const atualizado = await AtendimentoModel.buscarPorId(id);
      res.json(atualizado);
    } catch (error) {
      await connection.rollback();
      console.error("Erro ao atualizar atendimento:", error);
      res
        .status(500)
        .json({ error: "Erro interno ao atualizar atendimento clínico" });
    } finally {
      connection.release();
    }
  }
}

export default AtendimentoController;
