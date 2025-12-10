import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

const CATEGORIAS = [
  "Ração",
  "Brinquedo",
  "Higiene",
  "Acessório",
  "Remédios",
  "Petisco",
  "Outros",
];

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: "",
    sku: "",
    quantidade: "",
    categoria: "",
    descricao: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      ApiService.get(`/produtos/${id}`).then((response) => {
        if (response) {
          setFormData({
            nome: response.nome || "",
            sku: response.sku || "",
            quantidade: response.quantidade ?? "",
            categoria: response.categoria || "",
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

    if (!formData.nome || formData.nome.length < 2) {
      novosErros.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.sku || formData.sku.length < 3) {
      novosErros.sku = "Código deve ter pelo menos 3 caracteres";
    }

    if (formData.quantidade === "" || Number(formData.quantidade) < 0) {
      novosErros.quantidade = "Quantidade deve ser um número válido";
    }

    if (!formData.categoria) {
      novosErros.categoria = "Selecione uma categoria";
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
        sku: formData.sku,
        quantidade: Number(formData.quantidade),
        categoria: formData.categoria,
        descricao: formData.descricao,
      };

      try {
        if (isEdit) {
          await ApiService.put(`/produtos/${id}`, payload);
          exibirToast("Produto atualizado com sucesso!");
        } else {
          await ApiService.post("/produtos", payload);
          exibirToast("Produto cadastrado com sucesso!");
        }
        setTimeout(() => navigate("/produtos"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar produto", "danger");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Produto" : "Novo Produto"}
        </h5>
        <Link
          to="/produtos"
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
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nome *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do produto"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Código (SKU) *</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Ex: 1234567"
                    isInvalid={!!errors.sku}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sku}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Quantidade *</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantidade"
                    min="0"
                    value={formData.quantidade}
                    onChange={handleChange}
                    placeholder="0"
                    isInvalid={!!errors.quantidade}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantidade}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Categoria *</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    isInvalid={!!errors.categoria}
                    className={!formData.categoria ? "placeholder-active" : ""}
                  >
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categoria}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                rows={3}
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição do produto (opcional)"
              />
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
