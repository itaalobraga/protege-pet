import { useEffect, useState } from "react";
import { format, isValid, parse } from "date-fns";
import { Button, Card, Col, Container, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "src/components/Header/Header.jsx";
import ApiService from "src/services/ApiService.js";

function toMysqlDateTimeFromDatetimeLocal(datetimeLocal) {
  const dt = parse(String(datetimeLocal || ""), "yyyy-MM-dd'T'HH:mm", new Date(0));
  if (!isValid(dt)) return null;
  return format(dt, "yyyy-MM-dd HH:mm:ss");
}

function nowDatetimeLocal() {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm");
}

function CadastroDeMinistracoes() {
  const { prescricaoId } = useParams();
  const navigate = useNavigate();

  const [prescricao, setPrescricao] = useState(null);
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrescricao, setLoadingPrescricao] = useState(false);

  const [formData, setFormData] = useState({
    responsavel_id: "",
    quantidade_aplicada: "",
    data_hora: nowDatetimeLocal(),
    observacao: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  useEffect(() => {
    const carregarPrescricao = async () => {
      setLoadingPrescricao(true);
      try {
        const [prescricaoResponse, responsaveisResponse] = await Promise.all([
          ApiService.get(`/prescricoes/${prescricaoId}`),
          ApiService.get("/ministracoes/responsaveis"),
        ]);

        setPrescricao(prescricaoResponse || null);
        setResponsaveis(responsaveisResponse || []);
      } catch (error) {
        exibirToast(error.message || "Erro ao carregar prescrição", "danger");
        setPrescricao(null);
        setResponsaveis([]);
      } finally {
        setLoadingPrescricao(false);
      }
    };

    carregarPrescricao();
  }, [prescricaoId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.responsavel_id) {
      novosErros.responsavel_id = "Selecione o responsável";
    }

    if (!formData.quantidade_aplicada || Number(formData.quantidade_aplicada) <= 0) {
      novosErros.quantidade_aplicada = "Informe uma quantidade válida";
    }

    const dataMysql = toMysqlDateTimeFromDatetimeLocal(formData.data_hora);
    if (!formData.data_hora || !dataMysql) {
      novosErros.data_hora = "Informe uma data/hora válida";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const dataMysql = toMysqlDateTimeFromDatetimeLocal(formData.data_hora);
    if (!dataMysql) {
      exibirToast("Data/hora inválida.", "danger");
      return;
    }

    setLoading(true);

    try {
      await ApiService.post("/ministracoes", {
        prescricao_id: Number(prescricaoId),
        responsavel_id: Number(formData.responsavel_id),
        quantidade_aplicada: Number(formData.quantidade_aplicada),
        data_hora: dataMysql,
        observacao: formData.observacao,
      });

      exibirToast("Ministração registrada com sucesso!");
      setTimeout(() => navigate(`/prescricoes/${prescricaoId}/ministracoes`), 1200);
    } catch (error) {
      exibirToast(error.message || "Erro ao registrar ministração.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const bloqueado = prescricao && prescricao.status !== "ATIVA";

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0 fw-semibold">Nova ministração</h5>
              <div className="text-secondary small">
                Prescrição #{prescricaoId}
                {prescricao?.animal_nome ? ` - ${prescricao.animal_nome}` : ""}
                {prescricao?.medicamento_nome ? ` - ${prescricao.medicamento_nome}` : ""}
              </div>
            </div>
            <Link
              to={`/prescricoes/${prescricaoId}/ministracoes`}
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
            >
              <i className="bi bi-arrow-left"></i> Voltar
            </Link>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {loadingPrescricao ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Responsável *</Form.Label>
                        <Form.Select
                          name="responsavel_id"
                          value={formData.responsavel_id}
                          onChange={handleChange}
                          disabled={loading || bloqueado}
                          isInvalid={!!errors.responsavel_id}
                        >
                          <option value="">Selecione um responsável</option>
                          {responsaveis.map((veterinario) => (
                            <option key={veterinario.id} value={veterinario.id}>
                              {veterinario.nome} {veterinario.sobrenome}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.responsavel_id}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Quantidade aplicada *</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          name="quantidade_aplicada"
                          value={formData.quantidade_aplicada}
                          onChange={handleChange}
                          disabled={loading || bloqueado}
                          placeholder="Ex.: 1"
                          isInvalid={!!errors.quantidade_aplicada}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.quantidade_aplicada}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Data e hora *</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="data_hora"
                          value={formData.data_hora}
                          onChange={handleChange}
                          disabled={loading || bloqueado}
                          placeholder="Ex.: 09/04/2026 14:30"
                          isInvalid={!!errors.data_hora}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.data_hora}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Observação</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="observacao"
                          value={formData.observacao}
                          onChange={handleChange}
                          disabled={loading || bloqueado}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {bloqueado && (
                    <div className="alert alert-warning py-2" role="alert">
                      Só é possível registrar ministração em prescrição ativa.
                    </div>
                  )}

                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="success" disabled={loading || bloqueado}>
                      <i className="bi bi-check-lg me-1"></i>
                      Registrar
                    </Button>
                  </div>
                </Form>
              )}
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
              className={`bi bi-${toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}
            ></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default CadastroDeMinistracoes;
