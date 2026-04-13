import { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Header from "src/components/Header/Header.jsx";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

function DetalhesAtendimento() {
  const { id } = useParams();
  const [atendimento, setAtendimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    ApiService.get(`/atendimentos/${id}`)
      .then((data) => setAtendimento(data))
      .catch(() => {
        setAtendimento(null);
        setToastMessage("Atendimento não encontrado.");
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

  if (!atendimento) {
    return (
      <>
        <Header />
        <main>
          <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-semibold">Detalhes do atendimento</h5>
              <Link
                to="/atendimentos"
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                aria-label="Voltar para lista"
              >
                <i className="bi bi-arrow-left"></i> Voltar
              </Link>
            </div>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5 text-secondary">
                <i className="bi bi-exclamation-circle fs-1 d-block mb-2"></i>
                Atendimento não encontrado.
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

  const exames = Array.isArray(atendimento.exames) ? atendimento.exames : [];

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Detalhes do atendimento</h5>
            <div className="d-flex align-items-center gap-2">
              <Link
                to={`/atendimentos/cadastro/editar/${atendimento.id}`}
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                aria-label="Editar atendimento"
              >
                <i className="bi bi-pencil"></i> Editar
              </Link>
              <Link
                to="/atendimentos"
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
                    <div className="text-secondary small mb-1">Consulta (agenda)</div>
                    <div className="fw-semibold">
                      {atendimento.consulta_id != null
                        ? `#${atendimento.consulta_id}`
                        : "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Data e hora</div>
                    <div className="fw-semibold">
                      {formatarDataHora(atendimento.data_atendimento)}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Paciente</div>
                    <div className="fw-semibold">{atendimento.animal_nome || "-"}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Veterinário</div>
                    <div className="fw-semibold">
                      {atendimento.veterinario_nome
                        ? `Dr(a). ${atendimento.veterinario_nome}`
                        : "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Diagnóstico</div>
                    <div className="fw-semibold">
                      {atendimento.diagnostico_nome ? (
                        <span className="badge bg-danger">
                          {atendimento.diagnostico_nome}
                        </span>
                      ) : (
                        <span className="text-muted">Sem diagnóstico</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Peso</div>
                    <div className="fw-semibold">
                      {atendimento.peso != null && atendimento.peso !== ""
                        ? `${atendimento.peso} kg`
                        : "-"}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Registrado em</div>
                    <div className="fw-semibold">
                      {formatarDataHora(atendimento.created_at)}
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Observação da agenda</div>
                    <div className="fw-semibold">
                      {atendimento.observacao_agenda || (
                        <span className="text-muted">Nenhuma</span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="mb-4">
                    <div className="text-secondary small mb-1">Observações (prontuário)</div>
                    <div className="fw-semibold">
                      {atendimento.observacoes || "-"}
                    </div>
                  </div>
                </Col>
                <Col md={12}>
                  <div>
                    <div className="text-secondary small mb-1">
                      Exames solicitados
                    </div>
                    {exames.length === 0 ? (
                      <div className="fw-semibold text-muted">Nenhum exame solicitado</div>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {exames.map((ex) => (
                          <li key={ex.id} className="fw-semibold mb-1">
                            {ex.nome}
                            {ex.descricao ? (
                              <span className="text-secondary fw-normal small ms-1">
                                — {ex.descricao}
                              </span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    )}
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

export default DetalhesAtendimento;
