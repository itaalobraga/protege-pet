import AtendimentoModel from "../models/AtendimentoModel.js";
import pool from "../config/database.js";

class AtendimentoController {
  static async listar(req, res) {
    try {
      const atendimentos = await AtendimentoModel.listarTodos();
      res.json(atendimentos);
    } catch (error) {
      console.error("Erro ao listar atendimentos:", error);
      res.status(500).json({ error: "Erro ao carregar o histórico de atendimentos" });
    }
  }

  static async criar(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { animal_id, veterinario_id, diagnostico_id, peso, observacoes, exames, data_atendimento } = req.body;

      if (!animal_id || !veterinario_id) {
        return res.status(400).json({ error: "Selecione o Animal e o Veterinário responsável." });
      }

      const novoAtendimento = await AtendimentoModel.registrar({
        animal_id,
        veterinario_id,
        diagnostico_id,
        peso,
        observacoes,
        data_atendimento
      }, exames, connection); l

      await connection.commit();
      res.status(201).json(novoAtendimento);

    } catch (error) {
      await connection.rollback();
      console.error("Erro ao registrar atendimento:", error);
      res.status(500).json({ error: "Erro interno ao salvar atendimento clínico" });
    } finally {
      connection.release();
    }
  }
}

export default AtendimentoController;