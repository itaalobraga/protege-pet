import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import UsuarioModel from "../models/UsuarioModel.js";
import PasswordResetTokenModel from "../models/PasswordResetTokenModel.js";
import EmailService from "../services/EmailService.js";
import {
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "../middlewares/authJwt.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
    res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
    res.json({ sucesso: true });
  }

  static async solicitarRecuperacaoSenha(req, res) {
    try {
      const { email } = req.body;

      if (!email?.trim()) {
        return res.status(400).json({
          error: "Email é obrigatório",
        });
      }

      const usuario = await UsuarioModel.buscarPorEmail(email.trim());
      if (usuario) {
        await PasswordResetTokenModel.invalidarTokensDoUsuario(usuario.id);
        const { token } = await PasswordResetTokenModel.criar(usuario.id);

        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) {
          throw new Error("FRONTEND_URL não configurada");
        }
        const linkResetar = `${frontendUrl.replace(/\/$/, "")}/resetar-senha?token=${token}`;

        const templatePath = path.join(__dirname, "..", "templates", "recuperacao_senha.hbs");
        const template = fs.readFileSync(templatePath, "utf8");

        await EmailService.sendTemplate({
          to: usuario.email,
          subject: "Recuperação de senha - Protege Pet",
          template,
          data: {
            usuario_nome: usuario.nome,
            link_resetar: linkResetar,
          },
        });
      }

      res.json({
        message: "Enviamos instruções para redefinir sua senha.",
      });
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      res.status(500).json({ error: "Erro ao processar solicitação" });
    }
  }

  static async resetarSenha(req, res) {
    try {
      const { token, novaSenha } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({
          error: "Token e nova senha são obrigatórios",
        });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({
          error: "A senha deve ter pelo menos 6 caracteres",
        });
      }

      const registro = await PasswordResetTokenModel.buscarPorToken(token);
      if (!registro) {
        return res.status(400).json({
          error: "Link inválido ou expirado. Solicite uma nova recuperação de senha.",
        });
      }

      const senhaHash = await bcrypt.hash(novaSenha, 10);
      await UsuarioModel.atualizarSenha(registro.usuario_id, senhaHash);
      await PasswordResetTokenModel.marcarComoUsado(token);

      res.json({
        message: "Senha alterada com sucesso. Faça login com a nova senha.",
      });
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      res.status(500).json({ error: "Erro ao alterar senha" });
    }
  }
}

export default AuthController;
