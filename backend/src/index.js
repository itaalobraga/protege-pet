import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import VoluntarioRoutes from "./routes/VoluntarioRoutes.js";
import UsuarioRoutes from "./routes/UsuarioRoutes.js";
import AnimalRoutes from "./routes/AnimalRoutes.js";
import ProdutoRoutes from "./routes/ProdutoRoutes.js";
import VeterinarioRoutes from "./routes/VeterinarioRoutes.js";
import FuncaoRoutes from "./routes/FuncaoRoutes.js";
import CategoriaRoutes from "./routes/CategoriaRoutes.js";
import pool from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
});

app.use("/api", VoluntarioRoutes);
app.use("/api", UsuarioRoutes);
app.use("/api", AnimalRoutes);
app.use("/api", ProdutoRoutes);
app.use("/api", VeterinarioRoutes);
app.use("/api", FuncaoRoutes);
app.use("/api", CategoriaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API ProtegePet está rodando" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});

export default app;
