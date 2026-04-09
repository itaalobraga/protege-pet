import TipoExameModel from "../models/TipoExameModel.js";

class TipoExameController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let tipos;

      if (busca) {
        tipos = await TipoExameModel.filtrar(busca);
      } else {
        tipos = await TipoExameModel.listarTodos();
      }

      res.json(tipos);
    } catch (error) {
      console.error("Erro ao listar tipos de exames:", error);
      res.status(500).json({ error: "Erro ao listar tipos de exames" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const tipo = await TipoExameModel.buscarPorId(id);

      if (!tipo) {
        return res.status(404).json({ error: "Tipo de exame não encontrado" });
      }

      res.json(tipo);
    } catch (error) {
      console.error("Erro ao buscar tipo de exame:", error);
      res.status(500).json({ error: "Erro ao buscar tipo de exame" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, descricao } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "O nome do tipo de exame é obrigatório" });
      }

      const tipo = await TipoExameModel.criar({ nome, descricao });

      res.status(201).json(tipo);
    } catch (error) {
      console.error("Erro ao criar tipo de exame:", error);
      res.status(500).json({ error: "Erro ao criar tipo de exame" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const existente = await TipoExameModel.buscarPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Tipo de exame não encontrado" });
      }

      if (!nome) {
        return res.status(400).json({ error: "O nome do tipo de exame é obrigatório" });
      }

      const tipo = await TipoExameModel.atualizar(id, { nome, descricao });

      res.json(tipo);
    } catch (error) {
      console.error("Erro ao atualizar tipo de exame:", error);
      res.status(500).json({ error: "Erro ao atualizar tipo de exame" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      const sucesso = await TipoExameModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Tipo de exame não encontrado" });
      }

      res.json({ message: "Tipo de exame excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir tipo de exame:", error);
      res.status(500).json({ error: "Erro ao excluir tipo de exame" });
    }
  }
}

export default TipoExameController;
