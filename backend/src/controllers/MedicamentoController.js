import MedicamentoModel from "../models/MedicamentoModel.js";

class MedicamentoController {
  static async listar(req, res) {
    try {
      const { busca } = req.query;
      let medicamentos;

      if (busca) {
        medicamentos = await MedicamentoModel.filtrar(busca);
      } else {
        medicamentos = await MedicamentoModel.listarTodos();
      }

      res.json(medicamentos);
    } catch (error) {
      console.error("Erro ao listar medicamentos:", error);
      res.status(500).json({ error: "Erro ao listar medicamentos" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const medicamento = await MedicamentoModel.buscarPorId(id);

      if (!medicamento) {
        return res.status(404).json({ error: "Medicamento não encontrado" });
      }

      res.json(medicamento);
    } catch (error) {
      console.error("Erro ao buscar medicamento:", error);
      res.status(500).json({ error: "Erro ao buscar medicamento" });
    }
  }

  static async criar(req, res) {
    try {
      const { nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao } =
        req.body;

      if (!nome) {
        return res.status(400).json({ error: "O nome do medicamento é obrigatório" });
      }

      const medicamento = await MedicamentoModel.criar({
        nome,
        principio_ativo,
        dosagem,
        forma_farmaceutica,
        fabricante,
        descricao,
      });

      res.status(201).json(medicamento);
    } catch (error) {
      console.error("Erro ao criar medicamento:", error);
      res.status(500).json({ error: "Erro ao criar medicamento" });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, principio_ativo, dosagem, forma_farmaceutica, fabricante, descricao } =
        req.body;

      const existente = await MedicamentoModel.buscarPorId(id);
      if (!existente) {
        return res.status(404).json({ error: "Medicamento não encontrado" });
      }

      if (!nome) {
        return res.status(400).json({ error: "O nome do medicamento é obrigatório" });
      }

      const medicamento = await MedicamentoModel.atualizar(id, {
        nome,
        principio_ativo,
        dosagem,
        forma_farmaceutica,
        fabricante,
        descricao,
      });

      res.json(medicamento);
    } catch (error) {
      console.error("Erro ao atualizar medicamento:", error);
      res.status(500).json({ error: "Erro ao atualizar medicamento" });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;

      const sucesso = await MedicamentoModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Medicamento não encontrado" });
      }

      res.json({ message: "Medicamento excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir medicamento:", error);
      res.status(500).json({ error: "Erro ao excluir medicamento" });
    }
  }
}

export default MedicamentoController;
