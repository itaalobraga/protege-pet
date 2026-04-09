import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: "",
    principio_ativo: "",
    dosagem: "",
    forma_farmaceutica: "",
    fabricante: "",
    descricao: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      ApiService.get(`/medicamentos/${id}`).then((response) => {
        if (response) {
          setFormData({
            nome: response.nome || "",
            principio_ativo: response.principio_ativo || "",
            dosagem: response.dosagem || "",
            forma_farmaceutica: response.forma_farmaceutica || "",
            fabricante: response.fabricante || "",
            descricao: response.descricao || "",
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

    if (!formData.nome || formData.nome.trim().length < 2) {
      novosErros.nome = "Nome deve ter pelo menos 2 caracteres";
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
      try {
        if (isEdit) {
          await ApiService.put(`/medicamentos/${id}`, formData);
          exibirToast("Medicamento atualizado com sucesso!");
        } else {
          await ApiService.post("/medicamentos", formData);
          exibirToast("Medicamento cadastrado com sucesso!");
        }
        setTimeout(() => navigate("/medicamentos"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar medicamento", "danger");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Medicamento" : "Novo Medicamento"}
        </h5>
        <Link
          to="/medicamentos"
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
                    placeholder="Nome do medicamento"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Princípio Ativo</Form.Label>
                  <Form.Control
                    type="text"
                    name="principio_ativo"
                    value={formData.principio_ativo}
                    onChange={handleChange}
                    placeholder="Ex: Amoxicilina"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Dosagem</Form.Label>
                  <Form.Control
                    type="text"
                    name="dosagem"
                    value={formData.dosagem}
                    onChange={handleChange}
                    placeholder="Ex: 500mg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Forma Farmacêutica</Form.Label>
                  <Form.Control
                    type="text"
                    name="forma_farmaceutica"
                    value={formData.forma_farmaceutica}
                    onChange={handleChange}
                    placeholder="Ex: Comprimido, Solução, Injetável"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Fabricante</Form.Label>
                  <Form.Control
                    type="text"
                    name="fabricante"
                    value={formData.fabricante}
                    onChange={handleChange}
                    placeholder="Nome do fabricante"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Informações adicionais sobre o medicamento"
                  />
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
          <Toast.Body
            className={`d-flex align-items-center gap-2 text-${toastVariant}`}
          >
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

export default Formulario;
