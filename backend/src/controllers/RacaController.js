import RacaModel from '../models/RacaModel.js';

const RacaController = {
  listar: async (req, res) => {
    try {
      const racas = await RacaModel.getAll();
      res.json(racas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  criar: async (req, res) => {
    const { nome, especie } = req.body;
    if (!nome || !especie) {
      return res.status(400).json({ error: "Nome e Espécie são obrigatórios" });
    }
    try {
      const result = await RacaModel.create(nome, especie);
      res.status(201).json({ message: 'Raça cadastrada!', id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  atualizar: async (req, res) => {
    const { id } = req.params;
    const { nome, especie } = req.body;
    try {
      await RacaModel.update(id, nome, especie);
      res.json({ message: 'Raça atualizada!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  excluir: async (req, res) => {
    const { id } = req.params;
    try {
      await RacaModel.delete(id);
      res.json({ message: 'Raça excluída!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default RacaController;
