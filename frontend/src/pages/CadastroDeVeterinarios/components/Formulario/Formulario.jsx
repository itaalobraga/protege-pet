import { useEffect, useMemo, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { withMask } from "use-mask-input";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

const DIAS_SEMANA = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

const criarSlotVazio = () => ({
  dow: 1,
  start_time: "08:00:00",
  end_time: "12:00:00",
});

const normalizarHora = (value) => {
  const v = String(value ?? "").trim();
  if (!v) return "";
  const m = v.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return v;
  return `${m[1]}:${m[2]}:${m[3] ?? "00"}`;
};

const hhmmssToMinutes = (hhmmss) => {
  const m = String(hhmmss ?? "").match(/^(\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(mi)) return null;
  return h * 60 + mi;
};

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
    crmv: "",
  });

  const [disponibilidade, setDisponibilidade] = useState([criarSlotVazio()]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  const disponibilidadeOrdenada = useMemo(() => {
    return [...disponibilidade].sort((a, b) => {
      if (Number(a.dow) !== Number(b.dow)) return Number(a.dow) - Number(b.dow);
      return String(a.start_time).localeCompare(String(b.start_time));
    });
  }, [disponibilidade]);

  useEffect(() => {
    if (isEdit) {
      ApiService.get(`/veterinarios/${id}`).then((response) => {
        if (response) {
          setFormData({
            nome: response.nome || "",
            sobrenome: response.sobrenome || "",
            telefone: response.telefone || "",
            email: response.email || "",
            crmv: response.crmv || "",
          });

          const disp = Array.isArray(response.disponibilidade)
            ? response.disponibilidade
            : [];

          if (disp.length) {
            setDisponibilidade(
              disp.map((s) => ({
                dow: Number(s.dow) || 1,
                start_time: normalizarHora(s.start_time),
                end_time: normalizarHora(s.end_time),
              }))
            );
          } else {
            setDisponibilidade([criarSlotVazio()]);
          }
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSlotChange = (index, field, value) => {
    setDisponibilidade((prev) => {
      const next = [...prev];
      const current = { ...next[index] };
      if (field === "dow") current.dow = Number(value);
      if (field === "start_time") current.start_time = normalizarHora(value);
      if (field === "end_time") current.end_time = normalizarHora(value);
      next[index] = current;
      return next;
    });
  };

  const adicionarSlot = () => {
    setDisponibilidade((prev) => [...prev, criarSlotVazio()]);
  };

  const removerSlot = (index) => {
    setDisponibilidade((prev) => prev.filter((_, i) => i !== index));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome || formData.nome.length < 2) {
      novosErros.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.sobrenome || formData.sobrenome.length < 2) {
      novosErros.sobrenome = "Sobrenome deve ter pelo menos 2 caracteres";
    }

    if (!formData.telefone || formData.telefone.replace(/\D/g, "").length < 11) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!formData.email.includes("@")) {
      novosErros.email = "Email inválido";
    }

    if (!formData.crmv) {
      novosErros.crmv = "CRMV é obrigatório";
    }

    if (!Array.isArray(disponibilidade) || disponibilidade.length === 0) {
      novosErros.disponibilidade = "Informe pelo menos um horário de disponibilidade";
    } else {
      const problemas = [];

      disponibilidade.forEach((s, idx) => {
        const start = normalizarHora(s.start_time);
        const end = normalizarHora(s.end_time);

        const startMin = hhmmssToMinutes(start);
        const endMin = hhmmssToMinutes(end);

        if (!s.dow || s.dow < 1 || s.dow > 7) {
          problemas.push(`Slot ${idx + 1}: dia da semana inválido`);
          return;
        }

        if (startMin === null || endMin === null) {
          problemas.push(`Slot ${idx + 1}: horário inválido`);
          return;
        }

        if (startMin >= endMin) {
          problemas.push(`Slot ${idx + 1}: início deve ser menor que fim`);
        }
      });

      const porDia = {};
      disponibilidade.forEach((s) => {
        const key = Number(s.dow);
        if (!porDia[key]) porDia[key] = [];
        porDia[key].push({
          start: normalizarHora(s.start_time),
          end: normalizarHora(s.end_time),
        });
      });

      Object.keys(porDia).forEach((k) => {
        const slotsDia = porDia[k]
          .map((s) => ({
            startMin: hhmmssToMinutes(s.start),
            endMin: hhmmssToMinutes(s.end),
          }))
          .filter((s) => s.startMin !== null && s.endMin !== null)
          .sort((a, b) => a.startMin - b.startMin);

        for (let i = 1; i < slotsDia.length; i += 1) {
          if (slotsDia[i].startMin < slotsDia[i - 1].endMin) {
            problemas.push("Existem horários sobrepostos no mesmo dia");
            break;
          }
        }
      });

      if (problemas.length) novosErros.disponibilidade = problemas[0];
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const payload = {
        ...formData,
        disponibilidade: disponibilidadeOrdenada.map((s) => ({
          dow: Number(s.dow),
          start_time: normalizarHora(s.start_time),
          end_time: normalizarHora(s.end_time),
        })),
      };

      try {
        if (isEdit) {
          await ApiService.put(`/veterinarios/${id}`, payload);
          exibirToast("Veterinário atualizado com sucesso!");
        } else {
          await ApiService.post("/veterinarios", payload);
          exibirToast("Veterinário cadastrado com sucesso!");
        }
        setTimeout(() => navigate("/veterinarios"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar veterinário", "danger");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Veterinário" : "Novo Veterinário"}
        </h5>
        <Link
          to="/veterinarios"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          aria-label="Voltar para lista"
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
                  <Form.Label className="fw-semibold">Nome *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Sobrenome *</Form.Label>
                  <Form.Control
                    type="text"
                    name="sobrenome"
                    value={formData.sobrenome}
                    onChange={handleChange}
                    placeholder="Sobrenome"
                    isInvalid={!!errors.sobrenome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sobrenome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Telefone *</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    isInvalid={!!errors.telefone}
                    ref={withMask("(99) 99999-9999")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemplo@email.com"
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">CRMV *</Form.Label>
                  <Form.Control
                    type="text"
                    name="crmv"
                    value={formData.crmv}
                    onChange={handleChange}
                    placeholder="CRMV-SP 12345"
                    isInvalid={!!errors.crmv}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.crmv}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
              <div>
                <Form.Label className="fw-semibold mb-0">Disponibilidade *</Form.Label>
                {errors.disponibilidade ? (
                  <div className="text-danger small mt-1">{errors.disponibilidade}</div>
                ) : null}
              </div>
              <Button type="button" variant="outline-success" onClick={adicionarSlot}>
                <i className="bi bi-plus-lg me-1"></i> Adicionar horário
              </Button>
            </div>

            {disponibilidadeOrdenada.map((slot, idx) => (
              <Card key={`${idx}-${slot.dow}-${slot.start_time}-${slot.end_time}`} className="mb-3">
                <Card.Body className="p-3">
                  <Row className="g-2 align-items-end">
                    <Col md={5}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Dia</Form.Label>
                        <Form.Select
                          value={slot.dow}
                          onChange={(e) => handleSlotChange(idx, "dow", e.target.value)}
                        >
                          {DIAS_SEMANA.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Início</Form.Label>
                        <Form.Control
                          type="time"
                          step="60"
                          value={String(slot.start_time || "").slice(0, 5)}
                          onChange={(e) =>
                            handleSlotChange(idx, "start_time", `${e.target.value}:00`)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Fim</Form.Label>
                        <Form.Control
                          type="time"
                          step="60"
                          value={String(slot.end_time || "").slice(0, 5)}
                          onChange={(e) =>
                            handleSlotChange(idx, "end_time", `${e.target.value}:00`)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={1} className="d-flex justify-content-end">
                      <Button
                        type="button"
                        variant="outline-danger"
                        onClick={() => removerSlot(idx)}
                        disabled={disponibilidadeOrdenada.length === 1}
                        className="w-100"
                        aria-label="Remover horário"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="success">
                <i className="bi bi-check-lg me-1"></i>
                {isEdit ? "Salvar" : "Cadastrar"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className="border-0 shadow"
        >
          <Toast.Body className={`d-flex align-items-center gap-2 text-${toastVariant}`}>
            <i className={`bi bi-${toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Formulario;
