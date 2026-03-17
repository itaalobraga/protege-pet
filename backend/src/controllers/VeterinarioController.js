import VeterinarioModel from "../models/VeterinarioModel.js";
import VeterinarioDisponibilidadeModel from "../models/VeterinarioDisponibilidadeModel.js";

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

      const veterinariosComDisponibilidade = await Promise.all(
        veterinarios.map(async (v) => ({
          ...v,
          disponibilidade: await VeterinarioDisponibilidadeModel.listarPorVeterinario(v.id),
        }))
      );

      res.json(veterinariosComDisponibilidade);
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

      res.json({
        ...veterinario,
        disponibilidade: await VeterinarioDisponibilidadeModel.listarPorVeterinario(id),
      });
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

      if (!Array.isArray(disponibilidade) || disponibilidade.length === 0) {
        return res.status(400).json({ error: "Disponibilidade inválida" });
      }

      const emailExistente = await VeterinarioModel.buscarPorEmail(email);
      if (emailExistente) {
        return res.status(409).json({ error: "Este email já está cadastrado" });
      }

      const veterinario = await VeterinarioModel.criar({
        nome,
        sobrenome,
        telefone,
        email,
        crmv,
      });

      const slots = disponibilidade.map((s) => ({
        dow: s.dow,
        start_time: s.start_time,
        end_time: s.end_time,
      }));

      await VeterinarioDisponibilidadeModel.substituirPorVeterinario(veterinario.id, slots);

      res.status(201).json({
        ...veterinario,
        disponibilidade: await VeterinarioDisponibilidadeModel.listarPorVeterinario(veterinario.id),
      });
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
        return res.status(409).json({ error: "Este email já está cadastrado" });
      }

      const veterinario = await VeterinarioModel.atualizar(id, {
        nome,
        sobrenome,
        telefone,
        email,
        crmv,
      });

      if (disponibilidade !== undefined) {
        if (!Array.isArray(disponibilidade) || disponibilidade.length === 0) {
          return res.status(400).json({ error: "Disponibilidade inválida" });
        }

        const slots = disponibilidade.map((s) => ({
          dow: s.dow,
          start_time: s.start_time,
          end_time: s.end_time,
        }));

        await VeterinarioDisponibilidadeModel.substituirPorVeterinario(id, slots);
      }

      res.json({
        ...veterinario,
        disponibilidade: await VeterinarioDisponibilidadeModel.listarPorVeterinario(id),
      });
    } catch (error) {
      console.error("Erro ao atualizar veterinário:", error);
      res.status(500).json({ error: "Erro ao atualizar veterinário" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      const consultasAssociadas = await VeterinarioModel.contarConsultas(id);
      if (consultasAssociadas > 0) {
        return res.status(400).json({
          error: `Não é possível excluir este veterinário. Existem ${consultasAssociadas} consulta(s) vinculada(s) a ele.`
        });
      }

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
