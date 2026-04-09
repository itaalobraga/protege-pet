import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "src/components/Header/Header.jsx";
import ApiService from "src/services/ApiService.js";

function CadastroDePrescricoes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [consultas, setConsultas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    consulta_id: "",
    medicamento_id: "",
    dosagem: "",
    frequencia: "",
    duracao_dias: "",
    observacao: "",
    status: "ATIVA",
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
    const carregarCombos = async () => {
      setLoadingCombos(true);
      try {
        const [consultasResponse, medicamentosResponse] = await Promise.all([
          ApiService.get("/consultas-veterinarias"),
          ApiService.get("/medicamentos"),
        ]);
        setConsultas(consultasResponse || []);
        setMedicamentos(medicamentosResponse || []);
      } catch (error) {
        exibirToast(error.message || "Erro ao carregar dados", "danger");
      } finally {
        setLoadingCombos(false);
      }
    };

    carregarCombos();
  }, []);

  useEffect(() => {
    const carregarPrescricao = async () => {
      if (!isEdit) return;

      setLoading(true);
      try {
        const prescricao = await ApiService.get(`/prescricoes/${id}`);
        setFormData({
          consulta_id: String(prescricao.consulta_id || ""),
          medicamento_id: String(prescricao.medicamento_id || ""),
          dosagem: prescricao.dosagem || "",
          frequencia: prescricao.frequencia || "",
          duracao_dias: String(prescricao.duracao_dias || ""),
          observacao: prescricao.observacao || "",
          status: prescricao.status || "ATIVA",
        });
      } catch (error) {
        exibirToast(error.message || "Erro ao carregar prescrição", "danger");
      } finally {
        setLoading(false);
      }
    };

    carregarPrescricao();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.consulta_id) {
      novosErros.consulta_id = "Selecione uma consulta";
    }

    if (!formData.medicamento_id) {
      novosErros.medicamento_id = "Selecione um medicamento";
    }

    if (!formData.dosagem || formData.dosagem.trim().length < 2) {
      novosErros.dosagem = "Dosagem deve ter pelo menos 2 caracteres";
    }

    if (!formData.frequencia || formData.frequencia.trim().length < 2) {
      novosErros.frequencia = "Frequência deve ter pelo menos 2 caracteres";
    }

    if (!formData.duracao_dias || Number(formData.duracao_dias) <= 0) {
      novosErros.duracao_dias = "Informe uma duração válida";
    }

    if (!["ATIVA", "ENCERRADA", "CANCELADA"].includes(formData.status)) {
      novosErros.status = "Selecione um status válido";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        consulta_id: Number(formData.consulta_id),
        medicamento_id: Number(formData.medicamento_id),
        dosagem: formData.dosagem,
        frequencia: formData.frequencia,
        duracao_dias: Number(formData.duracao_dias),
        observacao: formData.observacao,
        status: formData.status,
      };

      if (isEdit) {
        await ApiService.put(`/prescricoes/${id}`, payload);
        exibirToast("Prescrição atualizada com sucesso!");
      } else {
        await ApiService.post("/prescricoes", payload);
        exibirToast("Prescrição criada com sucesso!");
      }

      setTimeout(() => navigate("/prescricoes"), 1200);
    } catch (error) {
      exibirToast(error.message || "Erro ao salvar prescrição.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0 fw-semibold">
                {isEdit ? "Editar prescrição" : "Nova prescrição"}
              </h5>
              <div className="text-secondary small">Atendimentos veterinários</div>
            </div>
            <Link
              to="/prescricoes"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              aria-label="Voltar para prescrições"
            >
              <i className="bi bi-arrow-left"></i> Voltar
            </Link>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Consulta *</Form.Label>
                      <Form.Select
                        name="consulta_id"
                        value={formData.consulta_id}
                        onChange={handleChange}
                        disabled={loading || loadingCombos}
                        isInvalid={!!errors.consulta_id}
                      >
                        <option value="">Selecione uma consulta</option>
                        {consultas.map((consulta) => (
                          <option key={consulta.id} value={consulta.id}>
                            #{consulta.id} - {consulta.animal_nome} ({formatarData(consulta.data_consulta)})
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.consulta_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Medicamento *</Form.Label>
                      <Form.Select
                        name="medicamento_id"
                        value={formData.medicamento_id}
                        onChange={handleChange}
                        disabled={loading || loadingCombos}
                        isInvalid={!!errors.medicamento_id}
                      >
                        <option value="">Selecione um medicamento</option>
                        {medicamentos.map((medicamento) => (
                          <option key={medicamento.id} value={medicamento.id}>
                            {medicamento.nome}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.medicamento_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Dosagem *</Form.Label>
                      <Form.Control
                        type="text"
                        name="dosagem"
                        value={formData.dosagem}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ex.: 1 comprimido"
                        isInvalid={!!errors.dosagem}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dosagem}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Frequência *</Form.Label>
                      <Form.Control
                        type="text"
                        name="frequencia"
                        value={formData.frequencia}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ex.: 12/12h"
                        isInvalid={!!errors.frequencia}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.frequencia}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Duração (dias) *</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        name="duracao_dias"
                        value={formData.duracao_dias}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ex.: 7"
                        isInvalid={!!errors.duracao_dias}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.duracao_dias}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Observação</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Opcional"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={loading}
                        isInvalid={!!errors.status}
                      >
                        <option value="ATIVA">Ativa</option>
                        <option value="ENCERRADA">Encerrada</option>
                        <option value="CANCELADA">Cancelada</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.status}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button type="submit" variant="success" disabled={loading || loadingCombos}>
                    <i className="bi bi-check-lg me-1"></i>
                    {isEdit ? "Salvar" : "Cadastrar"}
                  </Button>
                </div>
              </Form>
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

export default CadastroDePrescricoes;
