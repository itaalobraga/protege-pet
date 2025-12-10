import ProdutoModel from "../models/ProdutoModel.js";
import Categoria from "../models/CategoriaModel.js";

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

      if (!nome || !sku || !categoria) {
        return res.status(400).json({
          error: "Nome, código e categoria são obrigatórios",
        });
      }

      const nomeTrim = nome.trim();
      const categoriaTrim = categoria.trim();

  
      const produtoMesmoNome = await ProdutoModel.buscarPorNome(nomeTrim);
      if (produtoMesmoNome) {
        return res
          .status(400)
          .json({ error: "Já existe um produto com esse nome" });
      }

   
      const skuExistente = await ProdutoModel.buscarPorSku(sku);
      if (skuExistente) {
        return res
          .status(400)
          .json({ error: "Já existe um produto com esse código" });
      }

      const categoriaExistente = await Categoria.buscarPorNome(categoriaTrim);
      if (!categoriaExistente) {
        return res
          .status(400)
          .json({ error: "Categoria informada não existe" });
      }

      const produto = await ProdutoModel.criar({
        nome: nomeTrim,
        sku,
        quantidade,
        categoria_id: categoriaExistente.id,
        descricao,
      });

      const produtoComCategoria = {
        ...produto,
        categoria: categoriaTrim,
      };

      res.status(201).json(produtoComCategoria);
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

      let nomeFinal = produtoExistente.nome;
      let skuFinal = produtoExistente.sku;
      let quantidadeFinal = produtoExistente.quantidade;
      let categoriaIdFinal = produtoExistente.categoria_id;
      let descricaoFinal = produtoExistente.descricao;
      let categoriaNomeFinal = produtoExistente.categoria;

     
      if (nome && nome.trim()) {
        const nomeTrim = nome.trim();
        const produtoMesmoNome = await ProdutoModel.buscarPorNome(nomeTrim);

        if (produtoMesmoNome && produtoMesmoNome.id !== id) {
          return res
            .status(400)
            .json({ error: "Já existe outro produto com esse nome" });
        }

        nomeFinal = nomeTrim;
      }

      if (sku) {
        const skuExistente = await ProdutoModel.buscarPorSku(sku);
        if (skuExistente && skuExistente.id !== id) {
          return res
            .status(400)
            .json({ error: "Já existe outro produto com esse código" });
        }
        skuFinal = sku;
      }

      if (quantidade !== undefined) {
        quantidadeFinal = quantidade;
      }

      if (categoria && categoria.trim()) {
        const categoriaTrim = categoria.trim();
        const categoriaExistente = await Categoria.buscarPorNome(categoriaTrim);

        if (!categoriaExistente) {
          return res
            .status(400)
            .json({ error: "Categoria informada não existe" });
        }

        categoriaIdFinal = categoriaExistente.id;
        categoriaNomeFinal = categoriaTrim;
      }

      if (descricao !== undefined) {
        descricaoFinal = descricao;
      }

      const produtoAtualizado = await ProdutoModel.atualizar(id, {
        nome: nomeFinal,
        sku: skuFinal,
        quantidade: quantidadeFinal,
        categoria_id: categoriaIdFinal,
        descricao: descricaoFinal,
      });

      res.json({
        ...produtoAtualizado,
        categoria: categoriaNomeFinal,
      });
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
