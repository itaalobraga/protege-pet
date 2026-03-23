import { useEffect } from "react";
import { Container, Stack } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDropdown } from "../../hooks/useDropdown";
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

  useEffect(() => {
    usuariosClose();
    produtosClose();
    animaisClose();
    veterinariosClose();
    adocaoClose();
  }, [
    path,
    usuariosClose,
    produtosClose,
    animaisClose,
    veterinariosClose,
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

  const isAdocaoActive = isActive("adocoes") || isActive("listar-adocoes");

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
            <Link to="/usuarios" className="d-flex align-items-center">
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

      <nav className="py-3 border-bottom header-nav">
        <Container className="d-flex justify-content-center gap-4">
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

          <Link to="/voluntarios" className={getLinkClass("voluntarios")}>
            VOLUNTÁRIOS
          </Link>

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
        </Container>
      </nav>
    </header>
  );
}

export default Header;
