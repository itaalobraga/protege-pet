import { useEffect } from "react";
import { Container, Stack } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDropdown } from "../../hooks/useDropdown";
import { PERMISSOES, possuiPermissao } from "../../utils/permissoes";
import logo from "../../assets/img/logo.png";
import "./header.css";

function Header() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const [usuariosOpen, usuariosToggle, usuariosClose, usuariosRef] =
    useDropdown();
  const [produtosOpen, produtosToggle, produtosClose, produtosRef] =
    useDropdown();
  const [animaisOpen, animaisToggle, animaisClose, animaisRef] = useDropdown();
  const [
    veterinariosOpen,
    veterinariosToggle,
    veterinariosClose,
    veterinariosRef,
  ] = useDropdown();
  const [contaOpen, contaToggle, contaClose, contaRef] = useDropdown();
  const [adocaoOpen, adocaoToggle, adocaoClose, adocaoRef] = useDropdown();

  const [doacoesOpen, doacoesToggle, doacoesClose, doacoesRef] = useDropdown();
  const [
    atendimentosVeterinariosOpen,
    atendimentosVeterinariosToggle,
    atendimentosVeterinariosClose,
    atendimentosVeterinariosRef,
  ] = useDropdown();

  useEffect(() => {
    usuariosClose();
    produtosClose();
    animaisClose();
    veterinariosClose();
    atendimentosVeterinariosClose();
    doacoesClose();
    adocaoClose();
  }, [
    path,
    usuariosClose,
    produtosClose,
    animaisClose,
    veterinariosClose,
    atendimentosVeterinariosClose,
    doacoesClose,
    adocaoClose,
  ]);

  const handleLogout = async () => {
    contaClose();
    await logout();
    navigate("/login", { replace: true });
  };

  const isActive = (modulo) => path.startsWith(`/${modulo}`);
  const isUsuariosActive = isActive("usuarios") || isActive("funcoes");
  const isProdutosActive =
    path === "/produtos" ||
    path === "/categorias" ||
    path.startsWith("/movimentacoes");
  const isAnimaisActive = isActive("animais") || isActive("racas");
  const isVeterinariosActive =
    isActive("veterinarios") || isActive("consultas");

  const isAtendimentosVeterinariosActive =
    path.startsWith("/tipos-de-exames") || path.startsWith("/prescricoes");

  const isAdocaoActive = isActive("adocoes") || isActive("listar-adocoes");

  const isDoacoesActive = isActive("doacoes");

  const podeUsuarios = usuario && possuiPermissao(usuario, PERMISSOES.USUARIOS);
  const podeVoluntarios =
    usuario && possuiPermissao(usuario, PERMISSOES.VOLUNTARIOS);
  const podeVeterinarios =
    usuario && possuiPermissao(usuario, PERMISSOES.VETERINARIOS);
  const podeAnimais = usuario && possuiPermissao(usuario, PERMISSOES.ANIMAIS);
  const podeProdutos = usuario && possuiPermissao(usuario, PERMISSOES.PRODUTOS);
  const podeDoacoes = usuario && possuiPermissao(usuario, PERMISSOES.DOACOES);
  const podeMedicamentos =
    usuario && possuiPermissao(usuario, PERMISSOES.MEDICAMENTOS);
  const podeAtendimentosVeterinarios =
    usuario &&
    possuiPermissao(usuario, PERMISSOES.ATENDIMENTOS_VETERINARIOS);
  const podePrescricoesMinistracoes =
    usuario &&
    possuiPermissao(usuario, PERMISSOES.PRESCRICOES_MINISTRACOES);

  const mostrarNav =
    usuario &&
    Object.values(PERMISSOES).some((p) => possuiPermissao(usuario, p));

  const getLinkClass = (modulo) => {
    const base = "text-decoration-none fw-semibold small menu-link";
    return isActive(modulo)
      ? `${base} menu-link-ativo`
      : `${base} text-secondary`;
  };

  const getDropdownToggleClass = (isActiveParent) => {
    const base =
      "text-decoration-none fw-semibold small menu-link dropdown-toggle-custom";
    return isActiveParent
      ? `${base} menu-link-ativo`
      : `${base} text-secondary`;
  };

  return (
    <header>
      <div className="header-top py-3">
        <Container>
          <Stack direction="horizontal" gap={4} className="align-items-center">
            <Link to="/" className="d-flex align-items-center">
              <img
                alt="Protege Pet"
                src={logo}
                width="64"
                height="48"
                className="d-inline-block"
              />
            </Link>
            <div className="flex-grow-1">
              <div
                className="fw-bold"
                style={{ color: "#3F4D87", fontSize: "0.95rem" }}
              >
                SOCIEDADE PROTETORA DOS ANIMAIS ABANDONADOS
              </div>
              <div
                className="fw-bold"
                style={{ color: "#009951", fontSize: "0.85rem" }}
              >
                PRESIDENTE PRUDENTE
              </div>
            </div>
            {usuario && (
              <div className="dropdown-container ms-auto" ref={contaRef}>
                <button
                  type="button"
                  className={getDropdownToggleClass(false)}
                  onClick={contaToggle}
                  aria-expanded={contaOpen}
                  aria-haspopup="true"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  CONTA{" "}
                  <i
                    className={`bi bi-chevron-${contaOpen ? "up" : "down"} ms-1`}
                  ></i>
                </button>
                {contaOpen && (
                  <div className="dropdown-menu-custom dropdown-menu-right">
                    <div className="px-3 py-2 border-bottom">
                      <div className="fw-semibold small">{usuario.nome}</div>
                      {usuario.email && (
                        <div
                          className="text-secondary"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {usuario.email}
                        </div>
                      )}
                      {usuario.funcao_nome && (
                        <span
                          className="badge mt-1"
                          style={{
                            backgroundColor: "#009951",
                            fontSize: "0.65rem",
                          }}
                        >
                          {usuario.funcao_nome}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="dropdown-item-custom w-100 border-0 bg-transparent text-start"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            )}
          </Stack>
        </Container>
      </div>

      {mostrarNav && (
        <nav className="py-3 border-bottom header-nav">
          <Container className="d-flex justify-content-center gap-4 flex-wrap">
            {podeUsuarios && (
              <div className="dropdown-container" ref={usuariosRef}>
                <button
                  type="button"
                  className={getDropdownToggleClass(isUsuariosActive)}
                  onClick={usuariosToggle}
                >
                  USUÁRIOS{" "}
                  <i
                    className={`bi bi-chevron-${usuariosOpen ? "up" : "down"} ms-1`}
                  ></i>
                </button>
                {usuariosOpen && (
                  <div className="dropdown-menu-custom">
                    <Link
                      to="/usuarios"
                      className={`dropdown-item-custom ${path === "/usuarios" ? "active" : ""}`}
                      onClick={usuariosClose}
                    >
                      <i className="bi bi-people me-2"></i>
                      Gerenciar Usuários
                    </Link>
                    <Link
                      to="/funcoes"
                      className={`dropdown-item-custom ${path === "/funcoes" ? "active" : ""}`}
                      onClick={usuariosClose}
                    >
                      <i className="bi bi-shield-lock me-2"></i>
                      Gerenciar Funções
                    </Link>
                  </div>
                )}
              </div>
            )}

            {podeVoluntarios && (
              <Link to="/voluntarios" className={getLinkClass("voluntarios")}>
                VOLUNTÁRIOS
              </Link>
            )}

            {podeVeterinarios && (
              <div className="dropdown-container" ref={veterinariosRef}>
                <button
                  type="button"
                  className={getDropdownToggleClass(isVeterinariosActive)}
                  onClick={veterinariosToggle}
                  aria-expanded={veterinariosOpen}
                  aria-haspopup="true"
                >
                  VETERINÁRIOS{" "}
                  <i
                    className={`bi bi-chevron-${veterinariosOpen ? "up" : "down"} ms-1`}
                  ></i>
                </button>
                {veterinariosOpen && (
                  <div className="dropdown-menu-custom">
                    <Link
                      to="/veterinarios"
                      className={`dropdown-item-custom ${path === "/veterinarios" ? "active" : ""}`}
                      onClick={veterinariosClose}
                    >
                      <i className="bi bi-heart-pulse me-2"></i>
                      Gerenciar Veterinários
                    </Link>
                    <Link
                      to="/consultas"
                      className={`dropdown-item-custom ${path === "/consultas" ? "active" : ""}`}
                      onClick={veterinariosClose}
                    >
                      <i className="bi bi-clipboard2-pulse me-2"></i>
                      Consultas
                    </Link>
                  </div>
                )}
              </div>
            )}

            {(podeAtendimentosVeterinarios || podePrescricoesMinistracoes) && (
              <div
                className="dropdown-container"
                ref={atendimentosVeterinariosRef}
              >
                <button
                  type="button"
                  className={getDropdownToggleClass(
                    isAtendimentosVeterinariosActive,
                  )}
                  onClick={atendimentosVeterinariosToggle}
                  aria-expanded={atendimentosVeterinariosOpen}
                  aria-haspopup="true"
                >
                  ATENDIMENTOS VETERINÁRIOS{" "}
                  <i
                    className={`bi bi-chevron-${atendimentosVeterinariosOpen ? "up" : "down"} ms-1`}
                  ></i>
                </button>
                {atendimentosVeterinariosOpen && (
                  <div className="dropdown-menu-custom">
                    {podeAtendimentosVeterinarios && (
                      <Link
                        to="/tipos-de-exames"
                        className={`dropdown-item-custom ${path.startsWith("/tipos-de-exames") ? "active" : ""}`}
                        onClick={atendimentosVeterinariosClose}
                      >
                        <i className="bi bi-clipboard2-pulse me-2"></i>
                        Tipos de exames
                      </Link>
                    )}
                    {podePrescricoesMinistracoes && (
                      <Link
                        to="/prescricoes"
                        className={`dropdown-item-custom ${path.startsWith("/prescricoes") ? "active" : ""}`}
                        onClick={atendimentosVeterinariosClose}
                      >
                        <i className="bi bi-capsule-pill me-2"></i>
                        Prescrições
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {podeAnimais && (
              <div className="dropdown-container" ref={animaisRef}>
                <button
                  type="button"
                  className={getDropdownToggleClass(isAnimaisActive)}
                  onClick={animaisToggle}
                  aria-expanded={animaisOpen}
                  aria-haspopup="true"
                >
                  ANIMAIS{" "}
                  <i
                    className={`bi bi-chevron-${animaisOpen ? "up" : "down"} ms-1`}
                  ></i>
                </button>
                {animaisOpen && (
                  <div className="dropdown-menu-custom">
                    <Link
                      to="/animais"
                      className={`dropdown-item-custom ${path === "/animais" ? "active" : ""}`}
                      onClick={animaisClose}
                    >
                      <i className="bi bi-heart me-2"></i>
                      Gerenciar Animais
                    </Link>
                    <Link
                      to="/racas"
                      className={`dropdown-item-custom ${path === "/racas" ? "active" : ""}`}
                      onClick={animaisClose}
                    >
                      <i className="bi bi-tags me-2"></i>
                      Gerenciar Raças
                    </Link>
                  </div>
                )}
              </div>
            )}

            {podeProdutos && (
              <div className="dropdown-container" ref={produtosRef}>
                <button
                  type="button"
                  className={getDropdownToggleClass(isProdutosActive)}
                  onClick={produtosToggle}
                >
                  PRODUTOS{" "}
                  <i
                    className={`bi bi-chevron-${produtosOpen ? "up" : "down"} ms-1`}
                  ></i>
                </button>
                {produtosOpen && (
                  <div className="dropdown-menu-custom">
                    <Link
                      to="/movimentacoes/nova"
                      className={`dropdown-item-custom ${path === "/movimentacoes/nova" ? "active" : ""}`}
                      onClick={produtosClose}
                    >
                      Nova movimentação
                    </Link>
                    <Link
                      to="/movimentacoes"
                      className={`dropdown-item-custom ${path === "/movimentacoes" ? "active" : ""}`}
                      onClick={produtosClose}
                    >
                      Histórico de movimentações
                    </Link>
                    <Link
                      to="/produtos"
                      className={`dropdown-item-custom ${path === "/produtos" ? "active" : ""}`}
                      onClick={produtosClose}
                    >
                      Gerenciar produtos
                    </Link>
                    <Link
                      to="/categorias"
                      className={`dropdown-item-custom ${path === "/categorias" ? "active" : ""}`}
                      onClick={produtosClose}
                    >
                      Gerenciar categorias
                    </Link>
                  </div>
                )}
              </div>
            )}
            <div className="dropdown-container" ref={adocaoRef}>
              <button
                type="button"
                className={getDropdownToggleClass(isAdocaoActive)}
                onClick={adocaoToggle}
                aria-expanded={adocaoOpen}
                aria-haspopup="true"
              >
                ADOÇÕES{" "}
                <i
                  className={`bi bi-chevron-${adocaoOpen ? "up" : "down"} ms-1`}
                ></i>
              </button>
              {adocaoOpen && (
                <div className="dropdown-menu-custom">
                  <Link
                    to="/listar-adocoes"
                    className={`dropdown-item-custom ${path === "/listar-adocoes" ? "active" : ""}`}
                    onClick={adocaoClose}
                  >
                    <i className="bi bi-clipboard2-check me-2"></i>
                    Listar Adoções
                  </Link>
                </div>
              )}
            </div>

            {podeMedicamentos && (
              <Link
                to="/medicamentos"
                className={getLinkClass("medicamentos")}
              >
                MEDICAMENTOS
              </Link>
            )}

            {podeDoacoes && (
              <div className="dropdown-container" ref={doacoesRef}>
                <button
                  type="button"
                  className={getDropdownToggleClass(isDoacoesActive)}
                  onClick={doacoesToggle}
                  aria-expanded={doacoesOpen}
                  aria-haspopup="true"
                >
                  DOAÇÕES{" "}
                  <i
                    className={`bi bi-chevron-${doacoesOpen ? "up" : "down"} ms-1`}
                  ></i>
                </button>
                {doacoesOpen && (
                  <div className="dropdown-menu-custom">
                    <Link
                      to="/doacoes/cadastro"
                      className={`dropdown-item-custom ${path === "/doacoes/cadastro" ? "active" : ""}`}
                      onClick={doacoesClose}
                    >
                      <i className="bi bi-box2-heart me-2"></i>
                      Receber Doação
                    </Link>
                    <Link
                      to="/doacoes"
                      className={`dropdown-item-custom ${path === "/doacoes" ? "active" : ""}`}
                      onClick={doacoesClose}
                    >
                      <i className="bi bi-list-check me-2"></i>
                      Histórico de Doações
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Container>
        </nav>
      )}
    </header>
  );
}

export default Header;
