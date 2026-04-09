import PrescricaoModel from "../models/PrescricaoModel.js";
import ConsultaVeterinariaModel from "../models/ConsultaVeterinariaModel.js";
import MedicamentoModel from "../models/MedicamentoModel.js";

const STATUS_VALIDOS = ["ATIVA", "ENCERRADA", "CANCELADA"];

class PrescricaoController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      const prescricoes = await PrescricaoModel.listarTodos(busca || "");
      res.json(prescricoes);
    } catch (error) {
      console.error("Erro ao listar prescrições:", error);
      res.status(500).json({ error: "Erro ao listar prescrições" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const prescricao = await PrescricaoModel.buscarPorId(id);

      if (!prescricao) {
        return res.status(404).json({ error: "Prescrição não encontrada" });
      }

      res.json(prescricao);
    } catch (error) {
      console.error("Erro ao buscar prescrição:", error);
      res.status(500).json({ error: "Erro ao buscar prescrição" });
    }
  }

  static async criar(req, res) {
    try {
      const {
        consulta_id,
        medicamento_id,
        dosagem,
        frequencia,
        duracao_dias,
        observacao,
        status,
      } = req.body;

      if (!consulta_id || !medicamento_id || !dosagem || !frequencia || !duracao_dias) {
        return res.status(400).json({
          error: "Consulta, medicamento, dosagem, frequência e duração são obrigatórios",
        });
      }

      const statusFinal = String(status || "ATIVA").trim().toUpperCase();
      if (!STATUS_VALIDOS.includes(statusFinal)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const duracao = Number(duracao_dias);
      if (!Number.isInteger(duracao) || duracao <= 0) {
        return res.status(400).json({ error: "Duração inválida" });
      }

      const consulta = await ConsultaVeterinariaModel.buscarPorId(consulta_id);
      if (!consulta) {
        return res.status(404).json({ error: "Consulta não encontrada" });
      }

      const medicamento = await MedicamentoModel.buscarPorId(medicamento_id);
      if (!medicamento) {
        return res.status(404).json({ error: "Medicamento não encontrado" });
      }

      const prescricao = await PrescricaoModel.criar({
        consulta_id,
        medicamento_id,
        dosagem: String(dosagem).trim(),
        frequencia: String(frequencia).trim(),
        duracao_dias: duracao,
        observacao: observacao?.trim() || null,
        status: statusFinal,
      });

      res.status(201).json(prescricao);
    } catch (error) {
      console.error("Erro ao criar prescrição:", error);
      res.status(500).json({ error: "Erro ao criar prescrição" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        consulta_id,
        medicamento_id,
        dosagem,
        frequencia,
        duracao_dias,
        observacao,
        status,
      } = req.body;

      if (!consulta_id || !medicamento_id || !dosagem || !frequencia || !duracao_dias || !status) {
        return res.status(400).json({
          error: "Consulta, medicamento, dosagem, frequência, duração e status são obrigatórios",
        });
      }

      const existente = await PrescricaoModel.buscarPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Prescrição não encontrada" });
      }

      const statusFinal = String(status).trim().toUpperCase();
      if (!STATUS_VALIDOS.includes(statusFinal)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const duracao = Number(duracao_dias);
      if (!Number.isInteger(duracao) || duracao <= 0) {
        return res.status(400).json({ error: "Duração inválida" });
      }

      const consulta = await ConsultaVeterinariaModel.buscarPorId(consulta_id);
      if (!consulta) {
        return res.status(404).json({ error: "Consulta não encontrada" });
      }

      const medicamento = await MedicamentoModel.buscarPorId(medicamento_id);
      if (!medicamento) {
        return res.status(404).json({ error: "Medicamento não encontrado" });
      }

      const prescricao = await PrescricaoModel.atualizar(id, {
        consulta_id,
        medicamento_id,
        dosagem: String(dosagem).trim(),
        frequencia: String(frequencia).trim(),
        duracao_dias: duracao,
        observacao: observacao?.trim() || null,
        status: statusFinal,
      });

      res.json(prescricao);
    } catch (error) {
      console.error("Erro ao atualizar prescrição:", error);
      res.status(500).json({ error: "Erro ao atualizar prescrição" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      const existente = await PrescricaoModel.buscarPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Prescrição não encontrada" });
      }

      const sucesso = await PrescricaoModel.excluir(id);
      if (!sucesso) {
        return res.status(500).json({ error: "Erro ao excluir prescrição" });
      }

      return res.json({ message: "Prescrição excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir prescrição:", error);
      return res.status(500).json({ error: "Erro ao excluir prescrição" });
    }
  }

}

export default PrescricaoController;
