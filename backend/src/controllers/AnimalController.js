import AnimalModel from "../models/AnimalModel.js";
import { gerarCsv } from "../utils/csv.js";

class AnimalController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let animais;

      if (busca) {
        animais = await AnimalModel.filtrar(busca);
      } else {
        animais = await AnimalModel.listarTodos();
      }

      res.json(animais);
    } catch (error) {
      console.error("Erro ao listar animais:", error);
      res.status(500).json({ error: "Erro ao listar animais" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const animal = await AnimalModel.buscarPorId(id);

      if (!animal) {
        return res.status(404).json({ error: "Animal não encontrado" });
      }

      res.json(animal);
    } catch (error) {
      console.error("Erro ao buscar animal:", error);
      res.status(500).json({ error: "Erro ao buscar animal" });
    }
  }

  static async criar(req, res) {
    try {
      const {
        nome,
        especie,
        raca_id, 
        pelagem,
        sexo,
        data_nascimento,
        data_ocorrencia,
        local_resgate,
        porte,
        peso,
        status,
      } = req.body;

      if (!nome || !especie || !sexo) {
        return res.status(400).json({
          error: "Nome, espécie e sexo são obrigatórios",
        });
      }

      const animal = await AnimalModel.criar({
        nome,
        especie,
        raca_id, 
        pelagem,
        sexo,
        data_nascimento,
        data_ocorrencia,
        local_resgate,
        porte,
        peso,
        status,
      });

      res.status(201).json(animal);
    } catch (error) {
      console.error("Erro ao criar animal:", error);
      res.status(500).json({ error: "Erro ao criar animal" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const {
        nome,
        especie,
        raca_id, 
        pelagem,
        sexo,
        data_nascimento,
        data_ocorrencia,
        local_resgate,
        porte,
        peso,
        status,
      } = req.body;

      const animalExistente = await AnimalModel.buscarPorId(id);
      if (!animalExistente) {
        return res.status(404).json({ error: "Animal não encontrado" });
      }

      const animal = await AnimalModel.atualizar(id, {
        nome,
        especie,
        raca_id, 
        pelagem,
        sexo,
        data_nascimento,
        data_ocorrencia,
        local_resgate,
        porte,
        peso,
        status,
      });

      res.json(animal);
    } catch (error) {
      console.error("Erro ao atualizar animal:", error);
      res.status(500).json({ error: "Erro ao atualizar animal" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await AnimalModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Animal não encontrado" });
      }

      res.json({ message: "Animal excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir animal:", error);
      res.status(500).json({ error: "Erro ao excluir animal" });
    }
  }

  static async exportarCsv(req, res) {
    try {
      const { busca } = req.query;
      const animais = busca
        ? await AnimalModel.filtrar(busca)
        : await AnimalModel.listarTodos();

      const header = ["Nome", "Espécie", "Raça", "Sexo", "Porte", "Status"];
      const linhas = animais.map((a) => [
        a.nome,
        a.especie,
        a.nome_raca,
        a.sexo,
        a.porte,
        a.status,
      ]);

      const corpo = "\uFEFF" + gerarCsv(header, linhas);
      const dataIso = new Date().toISOString().slice(0, 10);
      const filename = `animais_${dataIso}.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.send(corpo);
    } catch (error) {
      console.error("Erro ao exportar CSV de animais:", error);
      res.status(500).json({ error: "Erro ao exportar CSV de animais" });
    }
  }
}

export default AnimalController;