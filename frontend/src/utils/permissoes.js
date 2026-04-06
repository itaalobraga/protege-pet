export const PERMISSOES = {
  USUARIOS: "Gerenciar usuários",
  PRODUTOS: "Gerenciar produtos",
  VOLUNTARIOS: "Gerenciar voluntários",
  VETERINARIOS: "Gerenciar veterinários",
  ANIMAIS: "Gerenciar animais",
  ADOCOES: "Gerenciar adocoes",
  DOACOES: "Gerenciar doações",
};

export const ROTAS_INICIO = [
  { permissao: PERMISSOES.USUARIOS, path: "/usuarios" },
  { permissao: PERMISSOES.VOLUNTARIOS, path: "/voluntarios" },
  { permissao: PERMISSOES.VETERINARIOS, path: "/veterinarios" },
  { permissao: PERMISSOES.ANIMAIS, path: "/animais" },
  { permissao: PERMISSOES.PRODUTOS, path: "/produtos" },
  { permissao: PERMISSOES.ADOCOES, path: "/listar-adocoes" },
  { permissao: PERMISSOES.DOACOES, path: "/doacoes" },
];

export function possuiPermissao(usuario, permissao) {
  if (!usuario?.funcao_permissoes?.length) return false;
  return usuario.funcao_permissoes.includes(permissao);
}
