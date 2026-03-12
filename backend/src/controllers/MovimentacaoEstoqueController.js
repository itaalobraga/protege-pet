import MovimentacaoEstoqueModel from "../models/MovimentacaoEstoqueModel.js";
import ProdutoModel from "../models/ProdutoModel.js";

class MovimentacaoEstoqueController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      const movimentacoes = await MovimentacaoEstoqueModel.listarTodos(busca || "");
      res.json(movimentacoes);
    } catch (error) {
      console.error("Erro ao listar movimentações:", error);
      res.status(500).json({ error: "Erro ao listar movimentações de estoque" });
    }
  }

  static async criar(req, res) {
    try {
      const {
        produto_id,
        tipo,
        quantidade,
        motivo,
        observacao,
        responsavel,
      } = req.body;

      if (!produto_id || !tipo || quantidade === undefined || !motivo || !responsavel) {
        return res.status(400).json({
          error: "Produto, tipo, quantidade, motivo e responsável são obrigatórios",
        });
      }

      const produto = await ProdutoModel.buscarPorId(produto_id);

      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const movimentacao = await MovimentacaoEstoqueModel.criarMovimentacao({
        produto_id,
        tipo: String(tipo).toUpperCase(),
        quantidade,
        motivo: String(motivo).trim().toUpperCase(),
        observacao: observacao?.trim() || "",
        responsavel: responsavel?.trim() || "",
      });

      return res.status(201).json(movimentacao);
    } catch (error) {
      console.error("Erro ao criar movimentação:", error);

      if (
        error.message === "Produto não encontrado" ||
        error.message === "Quantidade inválida" ||
        error.message === "Tipo de movimentação inválido" ||
        error.message === "Saída maior que o estoque disponível"
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Erro ao registrar movimentação" });
    }
  }

}

export default MovimentacaoEstoqueController;