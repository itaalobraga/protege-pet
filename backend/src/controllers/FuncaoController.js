import FuncaoModel from "../models/FuncaoModel.js";

const PERMISSOES_VALIDAS = [
  "Gerenciar usuários",
  "Gerenciar produtos",
  "Gerenciar voluntários",
  "Gerenciar veterinários",
  "Gerenciar animais"
];

class FuncaoController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let funcoes;

      if (busca) {
        funcoes = await FuncaoModel.filtrar(busca);
      } else {
        funcoes = await FuncaoModel.listarTodos();
      }

      res.json(funcoes);
    } catch (error) {
      console.error("Erro ao listar funções:", error);
      res.status(500).json({ error: "Erro ao listar funções" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const funcao = await FuncaoModel.buscarPorId(id);

      if (!funcao) {
        return res.status(404).json({ error: "Função não encontrada" });
      }

      res.json(funcao);
    } catch (error) {
      console.error("Erro ao buscar função:", error);
      res.status(500).json({ error: "Erro ao buscar função" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, permissoes } = req.body;

      if (!nome || !permissoes) {
        return res.status(400).json({
          error: "Nome e permissões são obrigatórios",
        });
      }

      if (!Array.isArray(permissoes) || permissoes.length === 0) {
        return res.status(400).json({
          error: "Permissões deve ser um array com pelo menos uma permissão",
        });
      }

      const permissoesInvalidas = permissoes.filter(p => !PERMISSOES_VALIDAS.includes(p));
      if (permissoesInvalidas.length > 0) {
        return res.status(400).json({
          error: `Permissões inválidas: ${permissoesInvalidas.join(", ")}`,
          permissoes_validas: PERMISSOES_VALIDAS
        });
      }

      const nomeExistente = await FuncaoModel.buscarPorNome(nome);
      if (nomeExistente) {
        return res.status(400).json({ error: "Já existe uma função com este nome" });
      }

      const funcao = await FuncaoModel.criar({ nome, permissoes });

      res.status(201).json(funcao);
    } catch (error) {
      console.error("Erro ao criar função:", error);
      res.status(500).json({ error: "Erro ao criar função" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, permissoes } = req.body;

      if (!nome || !permissoes) {
        return res.status(400).json({
          error: "Nome e permissões são obrigatórios",
        });
      }

      if (!Array.isArray(permissoes) || permissoes.length === 0) {
        return res.status(400).json({
          error: "Permissões deve ser um array com pelo menos uma permissão",
        });
      }

      const permissoesInvalidas = permissoes.filter(p => !PERMISSOES_VALIDAS.includes(p));
      if (permissoesInvalidas.length > 0) {
        return res.status(400).json({
          error: `Permissões inválidas: ${permissoesInvalidas.join(", ")}`,
          permissoes_validas: PERMISSOES_VALIDAS
        });
      }

      const funcaoExistente = await FuncaoModel.buscarPorId(id);
      if (!funcaoExistente) {
        return res.status(404).json({ error: "Função não encontrada" });
      }

      const nomeExistente = await FuncaoModel.buscarPorNome(nome);
      if (nomeExistente && nomeExistente.id !== parseInt(id)) {
        return res.status(400).json({ error: "Já existe uma função com este nome" });
      }

      const funcao = await FuncaoModel.atualizar(id, { nome, permissoes });

      res.json(funcao);
    } catch (error) {
      console.error("Erro ao atualizar função:", error);
      res.status(500).json({ error: "Erro ao atualizar função" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      const usuariosAssociados = await FuncaoModel.contarUsuarios(id);
      if (usuariosAssociados > 0) {
        return res.status(400).json({
          error: `Não é possível excluir esta função. Existem ${usuariosAssociados} usuário(s) associado(s) a ela.`
        });
      }

      const sucesso = await FuncaoModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Função não encontrada" });
      }

      res.json({ message: "Função excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir função:", error);
      res.status(500).json({ error: "Erro ao excluir função" });
    }
  }

  static async listarPermissoes(req, res) {
    res.json(PERMISSOES_VALIDAS);
  }
}

export default FuncaoController;
  