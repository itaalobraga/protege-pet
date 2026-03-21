import DoacaoModel from "../models/DoacaoModel.js";

class DoacaoController {
  
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      const doacoes = await DoacaoModel.listarTodas(busca || "");
      res.json(doacoes);
    } catch (error) {
      console.error("Erro ao listar doações:", error);
      res.status(500).json({ error: "Erro ao listar doações" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const doacao = await DoacaoModel.buscarPorId(id);
      
      if (!doacao) {
        return res.status(404).json({ error: "Doação não encontrada" });
      }
      
      res.json(doacao);
    } catch (error) {
      console.error("Erro ao buscar doação:", error);
      res.status(500).json({ error: "Erro ao buscar doação" });
    }
  }

  static async criar(req, res) {
    try {
      const {
        doador_nome,
        doador_contato,
        tipo_doacao,
        valor,
        item,
        quantidade,
        observacao,
      } = req.body;

      if (!tipo_doacao) {
        return res.status(400).json({
          error: "O tipo de doação é obrigatório",
        });
      }

      if (tipo_doacao === 'DINHEIRO' && (!valor || valor <= 0)) {
        return res.status(400).json({ error: "Valor da doação financeira inválido." });
      }

      if (tipo_doacao === 'PRODUTO' && (!item || !quantidade || quantidade <= 0)) {
        return res.status(400).json({ error: "Item e quantidade são obrigatórios para doações físicas." });
      }

      const novaDoacao = await DoacaoModel.criarDoacao({
        doador_nome: doador_nome?.trim() || "Anônimo",
        doador_contato: doador_contato?.trim() || "",
        tipo_doacao: String(tipo_doacao).trim().toUpperCase(),
        valor: Number(valor) || 0,
        item: item?.trim() || "",
        quantidade: Number(quantidade) || 0,
        observacao: observacao?.trim() || "",
      });

      return res.status(201).json(novaDoacao);
      
    } catch (error) {
      console.error("Erro ao registrar doação:", error);
      return res.status(500).json({ error: "Erro ao registrar doação no sistema" });
    }
  }
}

export default DoacaoController;