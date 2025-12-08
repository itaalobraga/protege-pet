import Categoria from "../models/CategoriaModel.js";

class CategoriasController {

  
  static async listar(req, res) {
    try {
      const categorias = await Categoria.listarTodos();
      res.json(categorias);
    } catch (error) {
      console.error("Erro ao listar categorias:", error);
      res.status(500).json({ error: "Erro ao listar categorias" });
    }
  }


  static async criar(req, res) {
    try {
      const { nome, descricao } = req.body;

      if (!nome) {
        return res.status(400).json({ error: "Nome é obrigatório" });
      }

      const categoria = await Categoria.criar({ nome, descricao });
      res.status(201).json(categoria);

    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  }

 
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const categoria = await Categoria.atualizar(id, { nome, descricao });

      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.json({ message: "Categoria atualizada com sucesso", categoria });

    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  }

  
  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const ok = await Categoria.excluir(id);

      if (!ok) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.json({ message: "Categoria excluída com sucesso" });

    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      res.status(500).json({ error: "Erro ao excluir categoria" });
    }
  }
}

export default CategoriasController;
