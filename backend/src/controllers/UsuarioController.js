import UsuarioModel from "../models/UsuarioModel.js";
import { randomUUID } from "crypto";

class UsuarioController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let usuarios;

      if (busca) {
        usuarios = await UsuarioModel.filtrar(busca);
      } else {
        usuarios = await UsuarioModel.listarTodos();
      }

      res.json(usuarios);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.buscarPorId(id);

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, funcao_id, telefone, email, disponibilidade, senha } = req.body;

      if (!nome || !funcao_id || !telefone || !email || !disponibilidade || !senha) {
        return res.status(400).json({
          error: "Todos os campos são obrigatórios",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      const emailExistente = await UsuarioModel.buscarPorEmail(email);
      if (emailExistente) {
        return res.status(400).json({ error: "Este email já está cadastrado" });
      }

      const id = randomUUID();

      const usuario = await UsuarioModel.criar({
        id,
        nome,
        funcao_id,
        telefone,
        email,
        disponibilidade,
        senha,
      });

      res.status(201).json(usuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, funcao_id, telefone, email, disponibilidade, senha } = req.body;

      if (!nome || !funcao_id || !telefone || !email || !disponibilidade || !senha) {
        return res.status(400).json({
          error: "Todos os campos são obrigatórios",
        });
      }

      const usuarioExistente = await UsuarioModel.buscarPorId(id);
      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      const emailExistente = await UsuarioModel.buscarPorEmail(email);
      if (emailExistente && emailExistente.id !== id) {
        return res.status(400).json({ error: "Este email já está cadastrado" });
      }

      const usuario = await UsuarioModel.atualizar(id, {
        nome,
        funcao_id,
        telefone,
        email,
        disponibilidade,
        senha,
      });

      res.json(usuario);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await UsuarioModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      res.status(500).json({ error: "Erro ao excluir usuário" });
    }
  }
}

export default UsuarioController;
