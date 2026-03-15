import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, getDay, isValid, parse } from "date-fns";
import Header from "src/components/Header/Header.jsx";
import ApiService from "src/services/ApiService.js";

const DIAS_SEMANA = {
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
  7: "Dom",
};

function formatarDisponibilidade(disponibilidade) {
  if (!Array.isArray(disponibilidade) || disponibilidade.length === 0) return "-";
  const porDia = new Map();
  for (const item of disponibilidade) {
    const dow = Number(item.dow);
    if (!dow || !item.start_time || !item.end_time) continue;
    const dia = DIAS_SEMANA[dow] || String(dow);
    const range = `${String(item.start_time).slice(0, 5)}-${String(item.end_time).slice(0, 5)}`;
    if (!porDia.has(dia)) porDia.set(dia, []);
    porDia.get(dia).push(range);
  }
  return Array.from(porDia.entries())
    .map(([dia, ranges]) => `${dia}: ${ranges.join(", ")}`)
    .join(" | ");
}

function parseMysqlDateTime(mysqlDateTime) {
  const dt = parse(String(mysqlDateTime ?? ""), "yyyy-MM-dd HH:mm:ss", new Date(0));
  return isValid(dt) ? dt : null;
}

function toMysqlDateTimeFromDatetimeLocal(datetimeLocal) {
  const dt = parse(String(datetimeLocal ?? ""), "yyyy-MM-dd'T'HH:mm", new Date(0));
  if (!isValid(dt)) return null;
  return format(dt, "yyyy-MM-dd HH:mm:ss");
}

function toDatetimeLocalFromMysql(mysqlDateTime) {
  const dt = parseMysqlDateTime(mysqlDateTime);
  if (!dt) return "";
  return format(dt, "yyyy-MM-dd'T'HH:mm");
}

function dowFromMysqlDateTime(mysqlDateTime) {
  const dt = parseMysqlDateTime(mysqlDateTime);
  if (!dt) return null;
  const js = getDay(dt);
  return js === 0 ? 7 : js;
}

function hhmmFromMysqlDateTime(mysqlDateTime) {
  const dt = parseMysqlDateTime(mysqlDateTime);
  if (!dt) return null;
  return format(dt, "HH:mm");
}

function withinDisponibilidade(veterinario, dataConsultaMysql) {
  if (!veterinario || !Array.isArray(veterinario.disponibilidade) || !dataConsultaMysql) return false;
  const dow = dowFromMysqlDateTime(dataConsultaMysql);
  const hhmm = hhmmFromMysqlDateTime(dataConsultaMysql);
  if (!dow || !hhmm) return false;

  for (const slot of veterinario.disponibilidade) {
    const sdow = Number(slot.dow);
    const start = String(slot.start_time ?? "").slice(0, 5);
    const end = String(slot.end_time ?? "").slice(0, 5);
    if (!sdow || !start || !end) continue;
    if (sdow !== dow) continue;
    if (hhmm >= start && hhmm < end) return true;
  }

  return false;
}

function ConsultaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [veterinarios, setVeterinarios] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    veterinario_id: "",
    animal_id: "",
    data_consulta: "",
    observacao: "",
  });
  const [errors, setErrors] = useState({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  useEffect(() => {
    const carregarCombos = async () => {
      setLoadingCombos(true);
      try {
        const [vets, pets] = await Promise.all([
          ApiService.get("/veterinarios"),
          ApiService.get("/animais"),
        ]);
        setVeterinarios(vets || []);
        setAnimais(pets || []);
      } catch (e) {
        exibirToast(e.message || "Erro ao carregar dados", "danger");
      } finally {
        setLoadingCombos(false);
      }
    };

    carregarCombos();
  }, []);

  useEffect(() => {
    const carregarConsulta = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const consulta = await ApiService.get(`/consultas-veterinarias/${id}`);
        setFormData({
          veterinario_id: consulta?.veterinario_id ? String(consulta.veterinario_id) : "",
          animal_id: consulta?.animal_id ? String(consulta.animal_id) : "",
          data_consulta: toDatetimeLocalFromMysql(consulta?.data_consulta),
          observacao: consulta?.observacao || "",
        });
      } catch (e) {
        exibirToast(e.message || "Erro ao carregar consulta", "danger");
      } finally {
        setLoading(false);
      }
    };

    carregarConsulta();
  }, [id, isEdit]);

  const veterinarioSelecionado = useMemo(() => {
    if (!formData.veterinario_id) return null;
    return veterinarios.find((v) => String(v.id) === String(formData.veterinario_id)) || null;
  }, [formData.veterinario_id, veterinarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const novos = {};
    if (!formData.veterinario_id) novos.veterinario_id = "Selecione um veterinário";
    if (!formData.animal_id) novos.animal_id = "Selecione um animal";
    if (!formData.data_consulta) novos.data_consulta = "Informe a data e hora";

    const dataMysql = toMysqlDateTimeFromDatetimeLocal(formData.data_consulta);
    if (formData.data_consulta && !dataMysql) novos.data_consulta = "Data inválida";

    if (dataMysql && !withinDisponibilidade(veterinarioSelecionado, dataMysql)) {
      novos.data_consulta = "Horário fora da disponibilidade do veterinário";
    }

    setErrors(novos);
    return Object.keys(novos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const dataMysql = toMysqlDateTimeFromDatetimeLocal(formData.data_consulta);

    const payload = {
      veterinario_id: formData.veterinario_id,
      animal_id: formData.animal_id,
      data_consulta: dataMysql,
      observacao: formData.observacao || "",
    };

    setLoading(true);
    try {
      if (isEdit) {
        await ApiService.put(`/consultas-veterinarias/${id}`, payload);
        exibirToast("Consulta atualizada com sucesso!");
      } else {
        await ApiService.post("/consultas-veterinarias", payload);
        exibirToast("Consulta agendada com sucesso!");
      }
      setTimeout(() => navigate("/consultas"), 1200);
    } catch (err) {
      exibirToast(err.message || "Erro ao salvar consulta", "danger");
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
                {isEdit ? "Editar consulta" : "Novo agendamento"}
              </h5>
              <div className="text-secondary small">Consultas veterinárias</div>
            </div>
            <Link
              to="/consultas"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              aria-label="Voltar para agenda"
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
                      <Form.Label className="fw-semibold">Veterinário *</Form.Label>
                      <Form.Select
                        name="veterinario_id"
                        value={formData.veterinario_id}
                        onChange={handleChange}
                        isInvalid={!!errors.veterinario_id}
                        disabled={loading || loadingCombos}
                      >
                        <option value="">Selecione</option>
                        {veterinarios.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.nome} {v.sobrenome}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.veterinario_id}
                      </Form.Control.Feedback>
                      {veterinarioSelecionado ? (
                        <div className="text-secondary small mt-1">
                          {formatarDisponibilidade(veterinarioSelecionado.disponibilidade)}
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Animal *</Form.Label>
                      <Form.Select
                        name="animal_id"
                        value={formData.animal_id}
                        onChange={handleChange}
                        isInvalid={!!errors.animal_id}
                        disabled={loading || loadingCombos}
                      >
                        <option value="">Selecione</option>
                        {animais.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nome}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.animal_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Data e hora *</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="data_consulta"
                        value={formData.data_consulta}
                        onChange={handleChange}
                        isInvalid={!!errors.data_consulta}
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.data_consulta}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Observação</Form.Label>
                      <Form.Control
                        type="text"
                        name="observacao"
                        value={formData.observacao}
                        onChange={handleChange}
                        placeholder="Opcional"
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-3">
                  <Button type="submit" variant="success" disabled={loading}>
                    <i className="bi bi-check-lg me-1"></i>
                    {isEdit ? "Salvar" : "Agendar"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

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
                    toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"
                  }`}
                ></i>
                {toastMessage}
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Container>
      </main>
    </>
  );
}

export default ConsultaForm;
