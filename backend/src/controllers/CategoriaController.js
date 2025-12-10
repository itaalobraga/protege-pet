import Categoria from "../models/CategoriaModel.js";

class CategoriaController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let categorias;

      if (busca && busca.trim()) {
        categorias = await Categoria.filtrar(busca.trim());
      } else {
        categorias = await Categoria.listarTodas();
      }

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
      const { nome, descricao } = req.body;

      if (!nome || !nome.trim()) {
        return res
          .status(400)
          .json({ error: "Nome da categoria é obrigatório" });
      }

      const nomeTrim = nome.trim();

      const existente = await Categoria.buscarPorNome(nomeTrim);
      if (existente) {
        return res
          .status(400)
          .json({ error: "Já existe uma categoria com esse nome" });
      }

      const categoria = await Categoria.criar({
        nome: nomeTrim,
        descricao: descricao || null,
      });

      return res.status(201).json(categoria);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      return res.status(500).json({ error: "Erro ao criar categoria" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const categoriaAtual = await Categoria.buscarPorId(id);
      if (!categoriaAtual) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      let nomeFinal = categoriaAtual.nome;

      if (nome && nome.trim()) {
        const nomeTrim = nome.trim();
        const existente = await Categoria.buscarPorNome(nomeTrim);

        if (existente && existente.id !== Number(id)) {
          return res
            .status(400)
            .json({ error: "Já existe outra categoria com esse nome" });
        }

        nomeFinal = nomeTrim;
      }

      const categoriaAtualizada = await Categoria.atualizar(id, {
        nome: nomeFinal,
        descricao: descricao ?? categoriaAtual.descricao,
      });

      return res.json(categoriaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      return res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;

      const totalProdutos = await Categoria.contarProdutos(id);
      if (totalProdutos > 0) {
        return res.status(400).json({
          error:
            "Não é possível excluir uma categoria que está vinculada a produtos.",
        });
      }

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
