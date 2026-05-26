import AdocaoModel from "../models/AdocaoModel.js";
import AnimalModel from "../models/AnimalModel.js";
import EmailService from "../services/EmailService.js";
import pool from "../config/database.js";
import {
  aplicarMascaraCpf,
  aplicarMascaraTelefone,
  validarTelefone,
} from "../validation/mascaras.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { gerarCsv } from "../utils/csv.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import ArquivoModel from "../models/ArquivoModel.js";



class AdocaoController {
  static async exportarCsv(req, res) {
    try {
      const { busca } = req.query;
      const adocoes = busca
        ? await AdocaoModel.filtrar(busca)
        : await AdocaoModel.listarTodos();

      const header = [
        "Nome",
        "CPF",
        "Telefone",
        "Email",
        "Animal",
        "Espécie",
        "Raça",
        "Data de Cadastro",
        "Possui termo",
      ];

      const linhas = (adocoes || []).map((a) => {
        const dataCadastro = a.created_at
          ? new Date(a.created_at).toLocaleDateString("pt-BR")
          : "";

        return [
          a.nome || "",
          a.cpf || "",
          a.telefone || "",
          a.email || "",
          a.animal_nome || "",
          a.animal_especie || "",
          a.raca_nome || "",
          dataCadastro,
          a.termo_arquivo_id ? "Sim" : "Não",
        ];
      });

      const corpo = "\uFEFF" + gerarCsv(header, linhas);
      const dataIso = new Date().toISOString().slice(0, 10);
      const filename = `relatorio_adocoes_${dataIso}.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.send(corpo);
    } catch (error) {
      console.error("Erro ao exportar CSV de adoções:", error);
      res.status(500).json({ error: "Erro ao exportar relatório de adoções" });
    }
  }

  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let adocoes;

      if (busca) {
        adocoes = await AdocaoModel.filtrar(busca);
      } else {
        adocoes = await AdocaoModel.listarTodos();
      }

      res.json(adocoes);
    } catch (error) {
      console.error("Erro ao listar adoções:", error);
      res.status(500).json({ error: "Erro ao listar adoções" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const adocao = await AdocaoModel.buscarPorId(id);

      if (!adocao) {
        return res.status(404).json({ error: "Adoção não encontrada" });
      }

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao buscar adoção:", error);
      res.status(500).json({ error: "Erro ao buscar adoção" });
    }
  }



  static async criar(req, res) {
    const connection = await pool.getConnection();
    let transacaoIniciada = false;

    try {
      const { nome, cpf, telefone, email, animal_id } = req.body;

      if (!nome || !cpf || !telefone || !email || !animal_id) {
        return res.status(400).json({
          error: "nome, cpf, telefone, email e animal_id são obrigatórios",
        });
      }

      const cpfLimpo = cpf.replace(/\D/g, "");
      if (cpfLimpo.length !== 11) {
        return res.status(400).json({
          error: "CPF deve conter 11 dígitos",
        });
      }

      if (!validarTelefone(telefone)) {
        return res.status(400).json({
          error: "Telefone deve conter 10 ou 11 dígitos",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Email deve ter um formato válido",
        });
      }

      const animal = await AnimalModel.buscarPorId(animal_id);
      if (!animal) {
        return res.status(404).json({ error: "Animal não encontrado" });
      }

      if (animal.status !== "Apto") {
        return res.status(400).json({
          error: "Este animal não está disponível para adoção",
        });
      }

      const adocaoExistente = await AdocaoModel.buscarPorCPF(cpfLimpo);
      if (adocaoExistente) {
        return res.status(400).json({
          error: "Já existe uma adoção registrada para este CPF",
        });
      }

      await connection.beginTransaction();
      transacaoIniciada = true;

      const termoArquivoId = req.body?.termo_arquivo_id || null;

      if (termoArquivoId) {
        const termo = await ArquivoModel.buscarPorId(termoArquivoId);
        if (!termo) {
          return res.status(400).json({ error: "termo_arquivo_id inválido" });
        }
      }

      const adocao = await AdocaoModel.criar({
        nome: nome.trim(),
        cpf: aplicarMascaraCpf(cpfLimpo),
        telefone: aplicarMascaraTelefone(telefone),
        email: email.toLowerCase().trim(),
        animal_id,
        termo_arquivo_id: termoArquivoId,
      }, connection);

      const [resultadoAtualizacaoAnimal] = await connection.query(
        `
          UPDATE animais
          SET status = 'Adotado'
          WHERE id = ? AND status = 'Apto'
        `,
        [animal_id],
      );

      if (resultadoAtualizacaoAnimal.affectedRows === 0) {
        throw new Error("Este animal não está disponível para adoção");
      }

      await connection.commit();
      transacaoIniciada = false;

      // Recarrega com joins (inclui info do termo)
      const adocaoCompleta = await AdocaoModel.buscarPorId(adocao.id);

      if (adocaoCompleta?.email) {
        try {
          const templatePath = path.join(
            __dirname,
            "..",
            "templates",
            "adocao_realizada.hbs",
          );
          const template = fs.readFileSync(templatePath, "utf8");

          const attachments = [];
          if (adocaoCompleta.termo_arquivo_id) {
            const termo = await ArquivoModel.buscarPorId(adocaoCompleta.termo_arquivo_id);
            if (termo) {
              // O attachment do e-mail continua suportado, mas agora o upload é feito via rota /arquivos.
              // Para anexar, baixamos o conteúdo do arquivo do S3.
              // (Isso mantém o requisito do e-mail anexado.)
              const { baixarDoS3 } = await import("../services/ArquivoService.js");

              const s3Obj = await baixarDoS3({ bucket: termo.s3_bucket, key: termo.s3_key });
              const body = s3Obj.Body;
              const chunks = [];
              for await (const chunk of body) chunks.push(chunk);
              const buf = Buffer.concat(chunks);

              attachments.push({
                filename: termo.nome_original,
                content: buf.toString("base64"),
              });
            }
          }

          await EmailService.sendTemplate({
            to: adocaoCompleta.email,
            subject: "Adoção realizada - Protege Pet",
            template,
            data: {
              adotante_nome: adocaoCompleta.nome,
              animal_nome: animal.nome || "seu novo pet",
              data_adocao: new Date().toLocaleDateString("pt-BR"),
            },
            attachments,
          });
        } catch (emailError) {
          console.error(
            "Aviso: Falha ao enviar e-mail de confirmação da adoção:",
            emailError,
          );
        }
      }

      res.status(201).json(adocaoCompleta);
    } catch (error) {
      if (transacaoIniciada) {
        await connection.rollback();
      }
      console.error("Erro ao criar adoção:", error);
      if (error.message === "Este animal não está disponível para adoção") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro ao criar adoção" });
    } finally {
      connection.release();
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, cpf, telefone, email, animal_id } = req.body;

      const adocaoExistente = await AdocaoModel.buscarPorId(id);
      if (!adocaoExistente) {
        return res.status(404).json({ error: "Adoção não encontrada" });
      }

      const cpfLimpo = cpf.replace(/\D/g, "");
      if (cpfLimpo.length !== 11) {
        return res.status(400).json({
          error: "CPF deve conter 11 dígitos",
        });
      }

      if (!validarTelefone(telefone)) {
        return res.status(400).json({
          error: "Telefone deve conter 10 ou 11 dígitos",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Email deve ter um formato válido",
        });
      }

      if (cpfLimpo !== adocaoExistente.cpf.replace(/\D/g, "")) {
        const adocaoComMesmoCPF = await AdocaoModel.buscarPorCPF(cpfLimpo);
        if (adocaoComMesmoCPF && adocaoComMesmoCPF.id !== parseInt(id)) {
          return res.status(400).json({
            error: "Este CPF já está sendo usado em outra adoção",
          });
        }
      }

      const termoArquivoId = req.body?.termo_arquivo_id;
      // Se não vier no payload, não altera. Se vier como "" ou null, remove.

      // se termo_arquivo_id veio no payload, tratamos atualização/remocao
      if (termoArquivoId !== undefined) {
        const novoId = termoArquivoId ? String(termoArquivoId) : null;

        if (novoId) {
          const termo = await ArquivoModel.buscarPorId(novoId);
          if (!termo) {
            return res.status(400).json({ error: "termo_arquivo_id inválido" });
          }
        }

        // se mudou, remove o antigo do storage e DB
        // Não deletamos o arquivo antigo automaticamente aqui.
        // A exclusão deve ser feita explicitamente via DELETE /api/arquivos/:id.
        // Mantemos apenas a troca do vínculo no update abaixo.
      }

      const adocao = await AdocaoModel.atualizar(id, {
        nome: nome.trim(),
        cpf: aplicarMascaraCpf(cpfLimpo),
        telefone: aplicarMascaraTelefone(telefone),
        email: email.toLowerCase().trim(),
        animal_id,
        termo_arquivo_id: termoArquivoId !== undefined
          ? (termoArquivoId ? String(termoArquivoId) : null)
          : undefined,
      });

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao atualizar adoção:", error);
      res.status(500).json({ error: "Erro ao atualizar adoção" });
    }
  }



  static async excluir(req, res) {
    const connection = await pool.getConnection();
    let transacaoIniciada = false;

    try {
      const { id } = req.params;

      const adocao = await AdocaoModel.buscarPorId(id);
      if (!adocao) {
        return res.status(404).json({ error: "Adoção não encontrada" });
      }

      await connection.beginTransaction();
      transacaoIniciada = true;

      // remove a adoção. O termo (arquivo) não é removido automaticamente.
      // Para remover um termo, use DELETE /api/arquivos/:id (FK ON DELETE SET NULL).

      const sucesso = await AdocaoModel.excluir(id, connection);

      if (!sucesso) {
        throw new Error("Erro ao excluir adoção");
      }

      await connection.commit();
      transacaoIniciada = false;

      res.json({ message: "Adoção excluída com sucesso" });
    } catch (error) {
      if (transacaoIniciada) await connection.rollback();
      console.error("Erro ao excluir adoção:", error);
      res.status(500).json({ error: "Erro ao excluir adoção" });
    } finally {
      connection.release();
    }
  }

  static async buscarPorCPF(req, res) {
    try {
      const { cpf } = req.params;
      const adocao = await AdocaoModel.buscarPorCPF(cpf);

      if (!adocao) {
        return res
          .status(404)
          .json({ error: "Adoção não encontrada para este CPF" });
      }

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao buscar adoção por CPF:", error);
      res.status(500).json({ error: "Erro ao buscar adoção por CPF" });
    }
  }

  static async buscarPorEmail(req, res) {
    try {
      const { email } = req.params;
      const adocao = await AdocaoModel.buscarPorEmail(email);

      if (!adocao) {
        return res
          .status(404)
          .json({ error: "Adoção não encontrada para este email" });
      }

      res.json(adocao);
    } catch (error) {
      console.error("Erro ao buscar adoção por email:", error);
      res.status(500).json({ error: "Erro ao buscar adoção por email" });
    }
  }
}

export default AdocaoController;
