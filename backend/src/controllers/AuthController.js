import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UsuarioModel from "../models/UsuarioModel.js";
import {
  COOKIE_NAME,
  COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from "../middlewares/authJwt.js";

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          error: "Email e senha são obrigatórios",
        });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({
          error: "Email ou senha inválidos",
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({
          error: "Email ou senha inválidos",
        });
      }

      const { senha: _, ...usuarioSemSenha } = usuario;
      const token = jwt.sign({ id: usuario.id }, JWT_SECRET, {
        expiresIn: "24h",
      });

      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
      res.json(usuarioSemSenha);
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro ao realizar login" });
    }
  }

  static async me(req, res) {
    try {
      const usuario = await UsuarioModel.buscarPorId(req.usuarioId);

      if (!usuario) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      const { senha: _, ...usuarioSemSenha } = usuario;
      res.json(usuarioSemSenha);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      res.status(500).json({ error: "Erro ao verificar autenticação" });
    }
  }

  static async logout(req, res) {
    res.clearCookie(COOKIE_NAME, CLEAR_COOKIE_OPTIONS);
    res.json({ success: true });
  }
}

export default AuthController;
