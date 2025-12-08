import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

const PERMISSOES_DISPONIVEIS = [
  "Gerenciar usuários",
  "Gerenciar produtos",
  "Gerenciar voluntários",
  "Gerenciar veterinários",
  "Gerenciar animais",
];

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: "",
    permissoes: [],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      ApiService.get(`/funcoes/${id}`).then((response) => {
        if (response) {
          setFormData({
            nome: response.nome || "",
            permissoes: response.permissoes || [],
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePermissaoChange = (permissao) => {
    setFormData((prev) => {
      const permissoes = prev.permissoes.includes(permissao)
        ? prev.permissoes.filter((p) => p !== permissao)
        : [...prev.permissoes, permissao];
      return { ...prev, permissoes };
    });
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome || formData.nome.length < 3) {
      novosErros.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.permissoes || formData.permissoes.length === 0) {
      novosErros.permissoes = "Selecione pelo menos uma permissão";
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
        permissoes: formData.permissoes,
      };

      try {
        if (isEdit) {
          await ApiService.put(`/funcoes/${id}`, payload);
          exibirToast("Função atualizada com sucesso!");
        } else {
          await ApiService.post("/funcoes", payload);
          exibirToast("Função cadastrada com sucesso!");
        }
        setTimeout(() => navigate("/funcoes"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar função", "danger");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Função" : "Nova Função"}
        </h5>
        <Link
          to="/funcoes"
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
                  <Form.Label className="fw-semibold">
                    Nome da Função *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex: Administrador"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Permissões *</Form.Label>
                  <div className={`p-3 border rounded ${errors.permissoes ? "border-danger" : ""}`}>
                    {PERMISSOES_DISPONIVEIS.map((permissao) => (
                      <Form.Check
                        key={permissao}
                        type="checkbox"
                        id={`permissao-${permissao}`}
                        label={permissao}
                        checked={formData.permissoes.includes(permissao)}
                        onChange={() => handlePermissaoChange(permissao)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                  {errors.permissoes && (
                    <div className="text-danger small mt-1">
                      {errors.permissoes}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

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
