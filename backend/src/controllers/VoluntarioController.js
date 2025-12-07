import VoluntarioModel from "../models/VoluntarioModel.js";
import {
  aplicarMascaraCpf,
  aplicarMascaraTelefone,
} from "../validation/mascaras.js";

class VoluntarioController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let voluntarios;

      if (busca) {
        voluntarios = await VoluntarioModel.filtrar(busca);
      } else {
        voluntarios = await VoluntarioModel.listarTodos();
      }

      res.json(voluntarios);
    } catch (error) {
      console.error("Erro ao listar voluntários: ", error);
      res.status(500).json({ error: "Erro ao listar voluntários" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const voluntario = await VoluntarioModel.buscarPorId(id);
      if (!voluntario) {
        return res.status(404).json({ error: "Voluntário não encontrado" });
      }
      res.json(voluntario);
    } catch (error) {
      console.error("Erro ao buscar voluntário: ", error);
      res.status(500).json({ error: "Erro ao buscar voluntário" });
    }
  }

  static async criar(req, res) {
    try {
      const {
        nome,
        cpf,
        telefone,
        vlt_tel_Residencial,
        email,
        disponibilidade,
      } = req.body;
      if (
        !nome ||
        !cpf ||
        !telefone ||
        !vlt_tel_Residencial ||
        !email ||
        !disponibilidade
      ) {
        return res
          .status(404)
          .json({ error: "Todos os campos são obrigatórios" });
      }
      if (!aplicarMascaraCpf(cpf)) {
        return res.status(400).json({
          error:
            "CPF inválido ou incorreto, digite sem utilizar pontos e vírgulas",
        });
      }
      if (!aplicarMascaraTelefone(telefone)) {
        return res.status(400).json({
          error: "Telefone inválido ou incorreto",
        });
      }

      const voluntario = await VoluntarioModel.criar({
        nome,
        cpf,
        telefone,
        vlt_tel_Residencial,
        email,
        disponibilidade,
      });
      res.status(201).json(voluntario);
    } catch (error) {
      console.error(`Erro ao cadastrar voluntário ${error}`);
      return res.status(500).json({ error: "Erro ao cadastrar voluntário" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        cpf,
        telefone,
        vlt_tel_Residencial,
        email,
        disponibilidade,
      } = req.body;

      if (!aplicarMascaraCpf(cpf)) {
        return res.status(400).json({
          error:
            "CPF inválido ou incorreto, digite sem utilizar pontos e vírgulas",
        });
      }
      if (!aplicarMascaraTelefone(telefone)) {
        return res.status(400).json({
          error: "Telefone inválido ou incorreto",
        });
      }

      const voluntario = await VoluntarioModel.atualizar(id, {
        nome,
        cpf,
        telefone,
        vlt_tel_Residencial,
        email,
        disponibilidade,
      });

      res.status(201).json(voluntario);
    } catch (error) {
      console.error(`Erro ao atualizar cadastro do voluntário ${error}`);
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await VoluntarioModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({
          error: "Voluntário não encontrado",
        });
      }
      res.json({ message: "Voluntário excluído com sucesso!" });
    } catch (error) {
      console.error(`Erro ao excluír voluntário ${error}`);
      res.status(500).json({ error: "Erro ao excluír voluntário" });
    }
  }
}

export default VoluntarioController;
