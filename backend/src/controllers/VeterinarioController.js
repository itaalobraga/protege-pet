import VeterinarioModel from "../models/VeterinarioModel.js";

class VeterinarioController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let veterinarios;

      if (busca) {
        veterinarios = await VeterinarioModel.filtrar(busca);
      } else {
        veterinarios = await VeterinarioModel.listarTodos();
      }

      res.json(veterinarios);
    } catch (error) {
      console.error("Erro ao listar veterinários:", error);
      res.status(500).json({ error: "Erro ao listar veterinários" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const veterinario = await VeterinarioModel.buscarPorId(id);

      if (!veterinario) {
        return res.status(404).json({ error: "Veterinário não encontrado" });
      }

      res.json(veterinario);
    } catch (error) {
      console.error("Erro ao buscar veterinário:", error);
      res.status(500).json({ error: "Erro ao buscar veterinário" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, sobrenome, telefone, email, crmv, disponibilidade } = req.body;

      if (!nome || !sobrenome || !telefone || !email || !crmv || !disponibilidade) {
        return res.status(400).json({
          error: "Todos os campos são obrigatórios",
        });
      }

      const emailExistente = await VeterinarioModel.buscarPorEmail(email);
      if (emailExistente) {
        return res.status(400).json({ error: "Este email já está cadastrado" });
      }

      const veterinario = await VeterinarioModel.criar({
        nome,
        sobrenome,
        telefone,
        email,
        crmv,
        disponibilidade,
      });

      res.status(201).json(veterinario);
    } catch (error) {
      console.error("Erro ao criar veterinário:", error);
      res.status(500).json({ error: "Erro ao criar veterinário" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, sobrenome, telefone, email, crmv, disponibilidade } = req.body;

      const veterinarioExistente = await VeterinarioModel.buscarPorId(id);
      if (!veterinarioExistente) {
        return res.status(404).json({ error: "Veterinário não encontrado" });
      }

      const emailExistente = await VeterinarioModel.buscarPorEmail(email);
      if (emailExistente && emailExistente.id !== parseInt(id)) {
        return res.status(400).json({ error: "Este email já está cadastrado" });
      }

      const veterinario = await VeterinarioModel.atualizar(id, {
        nome,
        sobrenome,
        telefone,
        email,
        crmv,
        disponibilidade,
      });

      res.json(veterinario);
    } catch (error) {
      console.error("Erro ao atualizar veterinário:", error);
      res.status(500).json({ error: "Erro ao atualizar veterinário" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await VeterinarioModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Veterinário não encontrado" });
      }

      res.json({ message: "Veterinário excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir veterinário:", error);
      res.status(500).json({ error: "Erro ao excluir veterinário" });
    }
  }
}

export default VeterinarioController;
