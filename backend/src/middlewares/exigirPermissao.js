import UsuarioModel from "../models/UsuarioModel.js";

export function exigirPermissao(...permissoesExigidas) {
  return async (req, res, next) => {
    if (!req.usuarioId) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    try {
      const usuario = await UsuarioModel.buscarPorId(req.usuarioId);
      if (!usuario) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }
      const permissoesDoUsuario = usuario.funcao_permissoes || [];
      const autorizado = permissoesExigidas.every((p) =>
        permissoesDoUsuario.includes(p)
      );
      if (!autorizado) {
        return res.status(403).json({ error: "Você não tem permissão para esta ação" });
      }
      next();
    } catch (error) {
      console.error("Erro ao verificar permissão:", error);
      res.status(500).json({ error: "Erro ao verificar permissões" });
    }
  };
}
