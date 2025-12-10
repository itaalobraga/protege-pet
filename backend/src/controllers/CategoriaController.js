import Categoria from "../models/CategoriaModel.js";

class CategoriaController {
  static async listar(req, res) {
    try {
      const categorias = await Categoria.listarTodas();
      return res.json(categorias);
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      return res.status(500).json({ error: "Erro ao listar categorias" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.buscarPorId(id);

      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      return res.json(categoria);
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
      return res.status(500).json({ error: "Erro ao buscar categoria" });
    }
  }

  static async criar(req, res) {
    try {
      const categoria = await Categoria.criar(req.body);
      return res.status(201).json(categoria);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      return res.status(500).json({ error: "Erro ao criar categoria" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const categoriaAtualizada = await Categoria.atualizar(id, req.body);
      return res.json(categoriaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      return res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      const apagou = await Categoria.deletar(id);

      if (!apagou) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      return res.json({ message: "Categoria excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      return res.status(500).json({ error: "Erro ao excluir categoria" });
    }
  }
}

export default CategoriaController;
