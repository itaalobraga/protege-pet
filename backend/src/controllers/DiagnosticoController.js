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
}

export default DiagnosticoController;