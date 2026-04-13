import DiagnosticoModel from "../models/DiagnosticoModel.js";

class DiagnosticoController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      const diagnosticos = await DiagnosticoModel.listarTodos(busca || "");
      res.json(diagnosticos);
    } catch (error) {
      console.error("Erro ao listar diagnósticos:", error);
      res.status(500).json({ error: "Erro ao listar diagnósticos" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Identificador inválido" });
      }
      const diagnostico = await DiagnosticoModel.buscarPorId(id);
      if (!diagnostico) {
        return res.status(404).json({ error: "Diagnóstico não encontrado" });
      }
      res.json(diagnostico);
    } catch (error) {
      console.error("Erro ao buscar diagnóstico:", error);
      res.status(500).json({ error: "Erro ao buscar diagnóstico" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, descricao } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "O nome do diagnóstico é obrigatório" });
      }

      const novoDiagnostico = await DiagnosticoModel.criar({ nome: nome.trim(), descricao: descricao?.trim() });
      res.status(201).json(novoDiagnostico);
    } catch (error) {
      console.error("Erro ao criar diagnóstico:", error);
      res.status(500).json({ error: "Erro ao registrar diagnóstico" });
    }
  }

  static async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Identificador inválido" });
      }
      const { nome, descricao } = req.body;
      if (!nome || !String(nome).trim()) {
        return res.status(400).json({ error: "O nome do diagnóstico é obrigatório" });
      }
      const atualizado = await DiagnosticoModel.atualizar(id, {
        nome: nome.trim(),
        descricao: descricao?.trim(),
      });
      if (!atualizado) {
        return res.status(404).json({ error: "Diagnóstico não encontrado" });
      }
      const diagnostico = await DiagnosticoModel.buscarPorId(id);
      res.json(diagnostico);
    } catch (error) {
      console.error("Erro ao atualizar diagnóstico:", error);
      res.status(500).json({ error: "Erro ao atualizar diagnóstico" });
    }
  }

  static async excluir(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: "Identificador inválido" });
      }
      const resultado = await DiagnosticoModel.excluir(id);
      if (resultado.motivo === "vinculos") {
        return res.status(409).json({
          error:
            "Não é possível excluir: existem atendimentos (consultas) vinculados a este diagnóstico.",
        });
      }
      if (!resultado.removido) {
        return res.status(404).json({ error: "Diagnóstico não encontrado" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir diagnóstico:", error);
      res.status(500).json({ error: "Erro ao excluir diagnóstico" });
    }
  }
}

export default DiagnosticoController;