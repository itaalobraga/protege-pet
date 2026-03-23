import AdocaoModel from "../models/AdocaoModel.js";
import AnimalModel from "../models/AnimalModel.js";
import {
  aplicarMascaraCpf,
  aplicarMascaraTelefone,
  validarTelefone,
} from "../validation/mascaras.js";

class AdocaoController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let adocoes;

      if (busca) {
        adocoes = await AdocaoModel.filtrar(busca);
      } else {
        adocoes = await AdocaoModel.listarTodos();
      }

      res.json(adocoes);
    } catch (error) {
      console.error("Erro ao listar adoções:", error);
      res.status(500).json({ error: "Erro ao listar adoções" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const adocao = await AdocaoModel.buscarPorId(id);

      if (!adocao) {
        return res.status(404).json({ error: "Adoção não encontrada" });
      }

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao buscar adoção:", error);
      res.status(500).json({ error: "Erro ao buscar adoção" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, cpf, telefone, email, animal_id } = req.body;

      if (!nome || !cpf || !telefone || !email || !animal_id) {
        return res.status(400).json({
          error: "nome, cpf, telefone, email e animal_id são obrigatórios",
        });
      }

      const cpfLimpo = cpf.replace(/\D/g, "");
      if (cpfLimpo.length !== 11) {
        return res.status(400).json({
          error: "CPF deve conter 11 dígitos",
        });
      }

      if (!validarTelefone(telefone)) {
        return res.status(400).json({
          error: "Telefone deve conter 10 ou 11 dígitos",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Email deve ter um formato válido",
        });
      }

      const animal = await AnimalModel.buscarPorId(animal_id);
      if (!animal) {
        return res.status(404).json({ error: "Animal não encontrado" });
      }

      if (animal.status !== "Apto") {
        return res.status(400).json({
          error: "Este animal não está disponível para adoção",
        });
      }

      const adocaoExistente = await AdocaoModel.buscarPorCPF(cpfLimpo);
      if (adocaoExistente) {
        return res.status(400).json({
          error: "Já existe uma adoção registrada para este CPF",
        });
      }

      const adocao = await AdocaoModel.criar({
        nome: nome.trim(),
        cpf: aplicarMascaraCpf(cpfLimpo),
        telefone: aplicarMascaraTelefone(telefone),
        email: email.toLowerCase().trim(),
        animal_id,
      });

      res.status(201).json(adocao);
    } catch (error) {
      console.error("Erro ao criar adoção:", error);
      res.status(500).json({ error: "Erro ao criar adoção" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, cpf, telefone, email, animal_id } = req.body;

      const adocaoExistente = await AdocaoModel.buscarPorId(id);
      if (!adocaoExistente) {
        return res.status(404).json({ error: "Adoção não encontrada" });
      }

      const cpfLimpo = cpf.replace(/\D/g, "");
      if (cpfLimpo.length !== 11) {
        return res.status(400).json({
          error: "CPF deve conter 11 dígitos",
        });
      }

      if (!validarTelefone(telefone)) {
        return res.status(400).json({
          error: "Telefone deve conter 10 ou 11 dígitos",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Email deve ter um formato válido",
        });
      }

      if (cpfLimpo !== adocaoExistente.cpf.replace(/\D/g, "")) {
        const adocaoComMesmoCPF = await AdocaoModel.buscarPorCPF(cpfLimpo);
        if (adocaoComMesmoCPF && adocaoComMesmoCPF.id !== parseInt(id)) {
          return res.status(400).json({
            error: "Este CPF já está sendo usado em outra adoção",
          });
        }
      }

      const adocao = await AdocaoModel.atualizar(id, {
        nome: nome.trim(),
        cpf: aplicarMascaraCpf(cpfLimpo),
        telefone: aplicarMascaraTelefone(telefone),
        email: email.toLowerCase().trim(),
        animal_id,
      });

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao atualizar adoção:", error);
      res.status(500).json({ error: "Erro ao atualizar adoção" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      const adocao = await AdocaoModel.buscarPorId(id);
      if (!adocao) {
        return res.status(404).json({ error: "Adoção não encontrada" });
      }

      const sucesso = await AdocaoModel.excluir(id);

      if (!sucesso) {
        return res.status(500).json({ error: "Erro ao excluir adoção" });
      }

      res.json({ message: "Adoção excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir adoção:", error);
      res.status(500).json({ error: "Erro ao excluir adoção" });
    }
  }

  static async buscarPorCPF(req, res) {
    try {
      const { cpf } = req.params;
      const adocao = await AdocaoModel.buscarPorCPF(cpf);

      if (!adocao) {
        return res
          .status(404)
          .json({ error: "Adoção não encontrada para este CPF" });
      }

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao buscar adoção por CPF:", error);
      res.status(500).json({ error: "Erro ao buscar adoção por CPF" });
    }
  }

  static async buscarPorEmail(req, res) {
    try {
      const { email } = req.params;
      const adocao = await AdocaoModel.buscarPorEmail(email);

      if (!adocao) {
        return res
          .status(404)
          .json({ error: "Adoção não encontrada para este email" });
      }

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao buscar adoção por email:", error);
      res.status(500).json({ error: "Erro ao buscar adoção por email" });
    }
  }
}

export default AdocaoController;
