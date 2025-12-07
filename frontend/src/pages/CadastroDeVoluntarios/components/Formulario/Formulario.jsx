import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { withMask } from "use-mask-input";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    id: null,
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    vlt_tel_Residencial: "",
    disponibilidade: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      ApiService.get(`/voluntarios/${id}`).then((response) => {
        if (response) {
          setFormData({
            id: response.id,
            nome: response.vlt_nome,
            cpf: response.vlt_cpf,
            telefone: response.vlt_telefone,
            vlt_tel_Residencial: response.vlt_tel_Residencial,
            email: response.vlt_email,
            disponibilidade: response.vlt_disponibilidade,
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

    if (!formData.nome || formData.nome.length < 3) {
      novosErros.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.cpf || formData.cpf.replace(/\D/g, "").length < 11) {
      novosErros.cpf = "CPF inválido";
    }

    if (!formData.email.includes("@")) {
      novosErros.email = "Email inválido";
    }

    if (!formData.telefone || formData.telefone.replace(/\D/g, "").length < 11) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!formData.vlt_tel_Residencial || formData.vlt_tel_Residencial.replace(/\D/g, "").length < 10) {
      novosErros.vlt_tel_Residencial = "Telefone residencial inválido";
    }

    if (!formData.disponibilidade) {
      novosErros.disponibilidade = "Informe sua disponibilidade";
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
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        vlt_tel_Residencial: formData.vlt_tel_Residencial,
        email: formData.email,
        disponibilidade: formData.disponibilidade,
      };

      try {
        if (isEdit) {
          await ApiService.put(`/voluntarios/${id}`, payload);
          exibirToast("Voluntário atualizado com sucesso!");
        } else {
          await ApiService.post("/voluntarios", payload);
          exibirToast("Voluntário cadastrado com sucesso!");
        }
        setTimeout(() => navigate("/voluntarios"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar voluntário", "danger");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Voluntário" : "Novo Voluntário"}
        </h5>
        <Link
          to="/voluntarios"
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
                    placeholder="Nome completo"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">CPF *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    isInvalid={!!errors.cpf}
                    ref={withMask("999.999.999-99")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cpf}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Telefone Celular *</Form.Label>
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
                  <Form.Label className="fw-semibold">Telefone Residencial *</Form.Label>
                  <Form.Control
                    type="text"
                    name="vlt_tel_Residencial"
                    value={formData.vlt_tel_Residencial}
                    onChange={handleChange}
                    placeholder="(00) 0000-0000"
                    isInvalid={!!errors.vlt_tel_Residencial}
                    ref={withMask("(99) 9999-9999")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.vlt_tel_Residencial}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Disponibilidade *</Form.Label>
              <Form.Control
                as="textarea"
                name="disponibilidade"
                rows={3}
                value={formData.disponibilidade}
                onChange={handleChange}
                placeholder="Informe os dias e horários disponíveis..."
                isInvalid={!!errors.disponibilidade}
              />
              <Form.Control.Feedback type="invalid">
                {errors.disponibilidade}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
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
