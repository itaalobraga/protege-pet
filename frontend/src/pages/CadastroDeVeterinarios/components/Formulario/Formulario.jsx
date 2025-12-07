import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { withMask } from "use-mask-input";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

const DISPONIBILIDADES = [
  "Segunda a Sexta - Manhã",
  "Segunda a Sexta - Tarde",
  "Plantão",
  "Sábados e Domingos",
  "Noturno",
];

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
    disponibilidade: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

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
            disponibilidade: response.disponibilidade || "",
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    if (!formData.disponibilidade) {
      novosErros.disponibilidade = "Selecione uma disponibilidade";
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
      const payload = { ...formData };

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
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Disponibilidade *</Form.Label>
                  <Form.Select
                    name="disponibilidade"
                    value={formData.disponibilidade}
                    onChange={handleChange}
                    isInvalid={!!errors.disponibilidade}
                    className={!formData.disponibilidade ? "placeholder-active" : ""}
                  >
                    <option value="">Selecione</option>
                    {DISPONIBILIDADES.map((disp) => (
                      <option key={disp} value={disp}>
                        {disp}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.disponibilidade}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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
