import DoacaoModel from "../models/DoacaoModel.js";
import MovimentacaoEstoqueModel from "../models/MovimentacaoEstoqueModel.js";
import pool from "../config/database.js";
import EmailService from "../services/EmailService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
          const templatePath = path.join(__dirname, "..", "templates", "recibo_doacao.hbs");
          const template = fs.readFileSync(templatePath, "utf8");

          const formatarMoeda = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
          
          const detalhe = tipo_doacao === 'DINHEIRO' 
            ? formatarMoeda(valor) 
            : `${quantidade} unidade(s) de produto para o estoque.`;

          await EmailService.sendTemplate({
            to: doador_contato,
            subject: "Recibo de Doação - Protege Pet",
            template,
            data: {
              doador_nome: doador_nome || 'Amigo(a) da Protege Pet',
              tipo_doacao: tipo_doacao === 'DINHEIRO' ? 'Financeira' : 'Produto',
              detalhe_doacao: detalhe
            },
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
