import DoacaoModel from "../models/DoacaoModel.js";
import MovimentacaoEstoqueModel from "../models/MovimentacaoEstoqueModel.js";
import pool from "../config/database.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const {
        doador_nome,
        doador_contato,
        tipo_doacao,
        valor,
        produto_id, 
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

      if (tipo_doacao === 'PRODUTO' && (!produto_id || !quantidade || quantidade <= 0)) {
        return res.status(400).json({ error: "Produto e quantidade são obrigatórios para doações físicas." });
      }

      const novaDoacao = await DoacaoModel.criarDoacao({
        doador_nome: doador_nome?.trim() || "Anônimo",
        doador_contato: doador_contato?.trim() || "",
        tipo_doacao: String(tipo_doacao).trim().toUpperCase(),
        valor: Number(valor) || 0,
        produto_id: produto_id || null,
        quantidade: Number(quantidade) || 0,
        observacao: observacao?.trim() || "",
      }, connection); 

      if (tipo_doacao === 'PRODUTO' && produto_id) {
        await MovimentacaoEstoqueModel.criarMovimentacao({
          produto_id,
          tipo: 'ENTRADA',
          quantidade: Number(quantidade),
          motivo: 'DOACAO',
          observacao: `Entrada automática via recebimento de doação #${novaDoacao.id}`,
          responsavel: req.usuario?.nome || "Sistema" 
        });
      }

      await connection.commit();
      if (doador_contato && doador_contato.includes('@')) {
        try {
          await resend.emails.send({
            from: 'Protegepet <nao-responda@protegepet.com>', 
            to: doador_contato,
            subject: 'Recibo de Doação - Protegepet',
            html: `
              <h3>Olá, ${doador_nome || 'Amigo(a)'}!</h3>
              <p>O Protegepet agradece imensamente a sua colaboração.</p>
              <p><strong>Detalhes do Recebimento:</strong></p>
              <ul>
                <li><strong>Tipo:</strong> ${tipo_doacao}</li>
                ${tipo_doacao === 'DINHEIRO' 
                  ? `<li><strong>Valor:</strong> R$ ${valor}</li>` 
                  : `<li><strong>Quantidade:</strong> ${quantidade} item(ns)</li>`
                }
              </ul>
              <p>Com sua ajuda, podemos continuar protegendo nossos animais!</p>
            `
          });
        } catch (emailError) {
          console.error("Aviso: Falha ao enviar recibo por e-mail", emailError);
        }
      }

      return res.status(201).json(novaDoacao);
      
    } catch (error) {
      await connection.rollback();
      console.error("Erro ao registrar doação:", error);
      return res.status(500).json({ error: "Erro ao registrar doação no sistema" });
    } finally {
      connection.release();
    }
  }
}

export default DoacaoController;
