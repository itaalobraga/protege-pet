import ProdutoModel from "../models/ProdutoModel.js";

class ProdutoController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let produtos;

      if (busca) {
        produtos = await ProdutoModel.filtrar(busca);
      } else {
        produtos = await ProdutoModel.listarTodos();
      }

      res.json(produtos);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      res.status(500).json({ error: "Erro ao listar produtos" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const produto = await ProdutoModel.buscarPorId(id);

      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json(produto);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, sku, quantidade, categoria, descricao } = req.body;

      if (!nome || !sku) {
        return res.status(400).json({
          error: "Nome e código são obrigatórios",
        });
      }

      const skuExistente = await ProdutoModel.buscarPorSku(sku);
      if (skuExistente) {
        return res.status(400).json({ error: "Já existe um produto com esse código" });
      }

      const produto = await ProdutoModel.criar({
        nome,
        sku,
        quantidade,
        categoria,
        descricao,
      });

      res.status(201).json(produto);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, sku, quantidade, categoria, descricao } = req.body;

      const produtoExistente = await ProdutoModel.buscarPorId(id);
      if (!produtoExistente) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      if (sku) {
        const skuExistente = await ProdutoModel.buscarPorSku(sku);
        if (skuExistente && skuExistente.id !== id) {
          return res.status(400).json({ error: "Já existe outro produto com esse código" });
        }
      }

      const produto = await ProdutoModel.atualizar(id, {
        nome,
        sku,
        quantidade,
        categoria,
        descricao,
      });

      res.json(produto);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await ProdutoModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json({ message: "Produto excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      res.status(500).json({ error: "Erro ao excluir produto" });
    }
  }
}

export default ProdutoController;

