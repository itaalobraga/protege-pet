import ConsultaVeterinariaModel from "../models/ConsultaVeterinariaModel.js";
import VeterinarioModel from "../models/VeterinarioModel.js";
import AnimalModel from "../models/AnimalModel.js";
import EmailService from "../services/EmailService.js";
import VeterinarioDisponibilidadeModel from "../models/VeterinarioDisponibilidadeModel.js";
import { format, isValid, parse } from "date-fns";
import fs from "fs";
import path from "path";

class ConsultaVeterinariaController {
  static async listar(req, res) {
    try {
      const { veterinario_id, animal_id, inicio, fim } = req.query;

      const consultas = await ConsultaVeterinariaModel.listar({
        veterinario_id,
        animal_id,
        inicio,
        fim,
      });

      res.json(consultas);
    } catch (error) {
      console.error("Erro ao listar consultas:", error);
      res.status(500).json({ error: "Erro ao listar consultas" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const consulta = await ConsultaVeterinariaModel.buscarDetalhesPorId(id);

      if (!consulta) {
        return res.status(404).json({ error: "Consulta não encontrada" });
      }

      res.json(consulta);
    } catch (error) {
      console.error("Erro ao buscar consulta:", error);
      res.status(500).json({ error: "Erro ao buscar consulta" });
    }
  }

  static async criar(req, res) {
    try {
      const { veterinario_id, animal_id, data_consulta, observacao } = req.body;

      if (!veterinario_id || !animal_id || !data_consulta) {
        return res.status(400).json({
          error: "veterinario_id, animal_id e data_consulta são obrigatórios",
        });
      }

      const veterinario = await VeterinarioModel.buscarPorId(veterinario_id);
      if (!veterinario) {
        return res.status(404).json({ error: "Veterinário não encontrado" });
      }

      const animal = await AnimalModel.buscarPorId(animal_id);
      if (!animal) {
        return res.status(404).json({ error: "Animal não encontrado" });
      }

      const dentroDaDisponibilidade = await ConsultaVeterinariaController.#validarDisponibilidade(
        veterinario_id,
        data_consulta
      );

      if (!dentroDaDisponibilidade) {
        return res.status(400).json({
          error: "Data da consulta fora da disponibilidade do veterinário",
        });
      }

      const conflito = await ConsultaVeterinariaModel.existeConflito({
        veterinario_id,
        data_consulta,
      });

      if (conflito) {
        return res.status(409).json({
          error: "Já existe consulta agendada para este veterinário neste horário",
        });
      }

      const consulta = await ConsultaVeterinariaModel.criar({
        veterinario_id,
        animal_id,
        data_consulta,
        observacao: observacao || null,
      });

      const templatePath = path.resolve(
        process.cwd(),
        "src",
        "templates",
        "consulta_agendada.hbs"
      );
      const template = fs.readFileSync(templatePath, "utf8");

      await EmailService.sendTemplate({
        to: veterinario.email,
        subject: "Consulta veterinária agendada",
        template,
        data: {
          veterinario_nome: `${veterinario.nome} ${veterinario.sobrenome}`,
          animal_nome: animal.nome,
          data_consulta: ConsultaVeterinariaController.#formatarDataBrasileira(data_consulta),
          observacao: observacao || "",
        },
      });

      res.status(201).json(consulta);
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      res.status(500).json({ error: "Erro ao criar consulta" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { veterinario_id, animal_id, data_consulta, observacao } = req.body;

      if (!veterinario_id || !animal_id || !data_consulta) {
        return res.status(400).json({
          error: "veterinario_id, animal_id e data_consulta são obrigatórios",
        });
      }

      const existente = await ConsultaVeterinariaModel.buscarDetalhesPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Consulta não encontrada" });
      }

      const veterinario = await VeterinarioModel.buscarPorId(veterinario_id);
      if (!veterinario) {
        return res.status(404).json({ error: "Veterinário não encontrado" });
      }

      const animal = await AnimalModel.buscarPorId(animal_id);
      if (!animal) {
        return res.status(404).json({ error: "Animal não encontrado" });
      }

      const dentroDaDisponibilidade = await ConsultaVeterinariaController.#validarDisponibilidade(
        veterinario_id,
        data_consulta
      );

      if (!dentroDaDisponibilidade) {
        return res.status(400).json({
          error: "Data da consulta fora da disponibilidade do veterinário",
        });
      }

      const conflito = await ConsultaVeterinariaModel.existeConflitoDiferente({
        id,
        veterinario_id,
        data_consulta,
      });

      if (conflito) {
        return res.status(409).json({
          error: "Já existe consulta agendada para este veterinário neste horário",
        });
      }

      const consulta = await ConsultaVeterinariaModel.atualizar(id, {
        veterinario_id,
        animal_id,
        data_consulta,
        observacao: observacao || null,
      });

      const templatePath = path.resolve(
        process.cwd(),
        "src",
        "templates",
        "consulta_atualizada.hbs"
      );
      const template = fs.readFileSync(templatePath, "utf8");

      await EmailService.sendTemplate({
        to: veterinario.email,
        subject: "Consulta veterinária atualizada",
        template,
        data: {
          veterinario_nome: `${veterinario.nome} ${veterinario.sobrenome}`,
          animal_nome: animal.nome,
          data_consulta: ConsultaVeterinariaController.#formatarDataBrasileira(data_consulta),
          observacao: observacao || "",
        },
      });

      res.json(consulta);
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      res.status(500).json({ error: "Erro ao atualizar consulta" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      const existente = await ConsultaVeterinariaModel.buscarDetalhesPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Consulta não encontrada" });
      }

      const sucesso = await ConsultaVeterinariaModel.excluir(id);
      if (!sucesso) {
        return res.status(500).json({ error: "Erro ao excluir consulta" });
      }

      const templatePath = path.resolve(
        process.cwd(),
        "src",
        "templates",
        "consulta_cancelada.hbs"
      );
      const template = fs.readFileSync(templatePath, "utf8");

      await EmailService.sendTemplate({
        to: existente.veterinario_email,
        subject: "Consulta veterinária cancelada",
        template,
        data: {
          veterinario_nome: `${existente.veterinario_nome} ${existente.veterinario_sobrenome}`,
          animal_nome: existente.animal_nome,
          data_consulta: ConsultaVeterinariaController.#formatarDataBrasileira(existente.data_consulta),
          observacao: existente.observacao || "",
        },
      });

      res.json({ message: "Consulta excluída com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir consulta:", error);
      res.status(500).json({ error: "Erro ao excluir consulta" });
    }
  }

  static async #validarDisponibilidade(veterinario_id, dataConsultaMysql) {
    const slots = await VeterinarioDisponibilidadeModel.listarSlots(veterinario_id);
    if (!Array.isArray(slots) || slots.length === 0) return false;

    const dow = ConsultaVeterinariaController.#dowMysqlLikeFromMysqlDateTime(dataConsultaMysql);
    const hhmm = ConsultaVeterinariaController.#hhmmFromMysqlDateTime(dataConsultaMysql);

    for (const slot of slots) {
      if (Number(slot.dow) !== dow) continue;
      if (hhmm >= slot.start && hhmm < slot.end) return true;
    }

    return false;
  }

  static #dowMysqlLikeFromMysqlDateTime(mysqlDateTime) {
    const dt = parse(String(mysqlDateTime), "yyyy-MM-dd HH:mm:ss", new Date(0));
    if (!isValid(dt)) return null;
    const js = dt.getDay();
    return js === 0 ? 7 : js;
  }

  static #hhmmFromMysqlDateTime(mysqlDateTime) {
    const dt = parse(String(mysqlDateTime), "yyyy-MM-dd HH:mm:ss", new Date(0));
    if (!isValid(dt)) return null;
    return format(dt, "HH:mm");
  }

  static #formatarDataBrasileira(mysqlDateTime) {
    const dt = parse(String(mysqlDateTime), "yyyy-MM-dd HH:mm:ss", new Date(0));
    if (!isValid(dt)) return mysqlDateTime;
    return format(dt, "dd/MM/yyyy HH:mm");
  }
}

export default ConsultaVeterinariaController;
