import { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Header from "src/components/Header/Header.jsx";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

const MAPA_MOTIVOS = {
  DOACAO: "Doação",
  COMPRA: "Compra",
  USO_ANIMAL: "Uso em animal",
  USO_INTERNO: "Uso interno",
  DESCARTE: "Descarte",
  AJUSTE: "Ajuste",
};

function DetalhesMovimentacao() {
  const { id } = useParams();
  const [movimentacao, setMovimentacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    ApiService.get(`/movimentacoes-estoque/${id}`)
      .then((data) => setMovimentacao(data))
      .catch(() => {
        setMovimentacao(null);
        setToastMessage("Movimentação não encontrada.");
        setToastVariant("danger");
        setShowToast(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const formatarTipo = (tipo) => (tipo === "ENTRADA" ? "Entrada" : "Saída");

  const formatarMotivo = (motivo) =>
    MAPA_MOTIVOS[motivo] ||
    (motivo || "-")
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

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

  if (!movimentacao) {
    return (
      <>
        <Header />
        <main>
          <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-semibold">Detalhes da Movimentação</h5>
              <Link
                to="/movimentacoes"
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                aria-label="Voltar para lista"
              >
                <i className="bi bi-arrow-left"></i> Voltar
              </Link>
            </div>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5 text-secondary">
                <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
                Movimentação não encontrada.
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
            <h5 className="mb-0 fw-semibold">Detalhes da Movimentação</h5>
            <Link
              to="/movimentacoes"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              aria-label="Voltar para lista"
            >
              <i className="bi bi-arrow-left"></i> Voltar
            </Link>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Data e hora</div>
                    <div className="fw-semibold">
                      {formatarData(movimentacao.created_at)}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Tipo</div>
                    <div className="fw-semibold">
                      {formatarTipo(movimentacao.tipo)}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Produto</div>
                    <div className="fw-semibold">
                      {movimentacao.produto_nome || "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Código (SKU)</div>
                    <div className="fw-semibold">
                      {movimentacao.produto_sku || "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Quantidade</div>
                    <div className="fw-semibold">
                      {movimentacao.quantidade ?? "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Motivo</div>
                    <div className="fw-semibold">
                      {formatarMotivo(movimentacao.motivo)}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Responsável</div>
                    <div className="fw-semibold">
                      {movimentacao.responsavel || "-"}
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div>
                    <div className="text-secondary small mb-1">Observação</div>
                    <div className="fw-semibold">
                      {movimentacao.observacao || "-"}
                    </div>
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

export default DetalhesMovimentacao;
