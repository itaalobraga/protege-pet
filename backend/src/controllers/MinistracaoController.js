import PrescricaoModel from "../models/PrescricaoModel.js";
import MinistracaoModel from "../models/MinistracaoModel.js";
import VeterinarioModel from "../models/VeterinarioModel.js";

class MinistracaoController {
  static async listarResponsaveis(req, res) {
    try {
      const veterinarios = await VeterinarioModel.listarTodos();
      res.json(veterinarios || []);
    } catch (error) {
      console.error("Erro ao listar responsáveis:", error);
      res.status(500).json({ error: "Erro ao listar responsáveis" });
    }
  }

  static async listar(req, res) {
    try {
      const { prescricao_id } = req.query;
      const ministracoes = await MinistracaoModel.listarTodos(prescricao_id || "");
      res.json(ministracoes);
    } catch (error) {
      console.error("Erro ao listar ministrações:", error);
      res.status(500).json({ error: "Erro ao listar ministrações" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const ministracao = await MinistracaoModel.buscarPorId(id);

      if (!ministracao) {
        return res.status(404).json({ error: "Ministração não encontrada" });
      }

      res.json(ministracao);
    } catch (error) {
      console.error("Erro ao buscar ministração:", error);
      res.status(500).json({ error: "Erro ao buscar ministração" });
    }
  }

  static async criar(req, res) {
    try {
      const { prescricao_id, quantidade_aplicada, data_hora, responsavel_id, observacao } = req.body;

      if (!prescricao_id || !quantidade_aplicada || !data_hora || !responsavel_id) {
        return res.status(400).json({
          error: "Prescrição, quantidade aplicada, data/hora e responsável são obrigatórios",
        });
      }

      const prescricao = await PrescricaoModel.buscarPorId(prescricao_id);
      if (!prescricao) {
        return res.status(404).json({ error: "Prescrição não encontrada" });
      }

      const quantidade = Number(quantidade_aplicada);
      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return res.status(400).json({ error: "Quantidade aplicada inválida" });
      }

      const ministracao = await MinistracaoModel.criarComBaixaEstoque({
        prescricao_id,
        quantidade_aplicada: quantidade,
        data_hora,
        responsavel_id,
        observacao: observacao?.trim() || null,
      });

      return res.status(201).json(ministracao);
    } catch (error) {
      console.error("Erro ao criar ministração:", error);

      if (
        error.message === "Prescrição não encontrada" ||
        error.message === "Só é possível registrar ministração em prescrição ativa" ||
        error.message === "Veterinário responsável não encontrado" ||
        error.message === "Produto de estoque do medicamento não encontrado" ||
        error.message === "Quantidade aplicada inválida" ||
        error.message === "Saída maior que o estoque disponível"
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Erro ao registrar ministração" });
    }
  }
}

export default MinistracaoController;
