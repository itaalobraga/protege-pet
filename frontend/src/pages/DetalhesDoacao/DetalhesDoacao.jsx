import { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Header from "src/components/Header/Header.jsx";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

function DetalhesDoacao() {
  const { id } = useParams();
  const [doacao, setDoacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    ApiService.get(`/doacoes/${id}`)
      .then((data) => setDoacao(data))
      .catch(() => {
        setDoacao(null);
        setToastMessage("Doação não encontrada.");
        setToastVariant("danger");
        setShowToast(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatarDataHora = (dataString) => {
    if (!dataString) return "-";
    return new Date(dataString).toLocaleString("pt-BR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const formatarTipo = (tipo) => {
    const normalizado = String(tipo || "").trim().toLowerCase();
    if (!normalizado) return "-";
    return normalizado.charAt(0).toUpperCase() + normalizado.slice(1);
  };

  const formatarValor = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(valor || 0));

  const formatarDetalhes = (item) => {
    if (item.tipo_doacao === "DINHEIRO") {
      return formatarValor(item.valor);
    }

    const quantidade = Number(item.quantidade || 0);
    return `${quantidade}x ${item.produto_nome || "Produto"}`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main>
          <Container className="py-4">
            <div className="text-center py-5">
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          </Container>
        </main>
      </>
    );
  }

  if (!doacao) {
    return (
      <>
        <Header />
        <main>
          <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-semibold">Detalhes da doação</h5>
              <Link
                to="/doacoes"
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                aria-label="Voltar para lista"
              >
                <i className="bi bi-arrow-left"></i> Voltar
              </Link>
            </div>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5 text-secondary">
                <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
                Doação não encontrada.
              </Card.Body>
            </Card>
          </Container>
        </main>
        <ToastContainer position="bottom-center" className="mb-4">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={4000}
            autohide
            className="border-0 shadow"
          >
            <Toast.Body
              className={`d-flex align-items-center gap-2 text-${toastVariant}`}
            >
              <i
                className={`bi bi-${
                  toastVariant === "success"
                    ? "check-circle-fill"
                    : "exclamation-circle-fill"
                }`}
              ></i>
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </>
    );
  }

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Detalhes da doação</h5>
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/doacoes"
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                aria-label="Voltar para lista"
              >
                <i className="bi bi-arrow-left"></i> Voltar
              </Link>
            </div>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">ID</div>
                    <div className="fw-semibold">#{doacao.id}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Data de registro</div>
                    <div className="fw-semibold">{formatarDataHora(doacao.created_at)}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Doador</div>
                    <div className="fw-semibold">{doacao.doador_nome || "-"}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Contato</div>
                    <div className="fw-semibold">{doacao.doador_contato || "-"}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Tipo</div>
                    <div className="fw-semibold">
                      <span
                        className={`badge bg-${
                          doacao.tipo_doacao === "DINHEIRO" ? "success" : "info"
                        }`}
                      >
                        {formatarTipo(doacao.tipo_doacao)}
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Detalhes</div>
                    <div className="fw-semibold">{formatarDetalhes(doacao)}</div>
                  </div>
                </Col>
                <Col md={12}>
                  <div>
                    <div className="text-secondary small mb-1">Observação</div>
                    <div className="fw-semibold">{doacao.observacao || "-"}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </main>

      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          className="border-0 shadow"
        >
          <Toast.Body className={`d-flex align-items-center gap-2 text-${toastVariant}`}>
            <i
              className={`bi bi-${
                toastVariant === "success"
                  ? "check-circle-fill"
                  : "exclamation-circle-fill"
              }`}
            ></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default DetalhesDoacao;
