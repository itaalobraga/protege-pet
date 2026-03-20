import Header from "../../components/Header/Header.jsx";

function AcessoNegado() {
  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="mx-auto text-center" style={{ maxWidth: "480px" }}>
          <i className="bi bi-shield-exclamation text-warning" style={{ fontSize: "3rem" }} />
          <h1 className="h4 mt-3 fw-semibold">Acesso não configurado</h1>
          <p className="text-secondary mb-0">
            Sua conta não possui permissões para usar os módulos do sistema. Peça a um administrador
            para ajustar sua função.
          </p>
        </div>
      </div>
    </>
  );
}

export default AcessoNegado;
