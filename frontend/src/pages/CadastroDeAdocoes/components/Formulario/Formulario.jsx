import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { withMask } from "use-mask-input";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

function FormAdocao() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    animal_id: "",
  });

  const [animais, setAnimais] = useState([]);
  const [errors, setErrors] = useState({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant] = useState("success");

  useEffect(() => {
    async function fetchAnimais() {
      try {
        const response = await ApiService.get("/animais");

        const aptos = isEditing
          ? response
          : response.filter((a) => a.status === "Apto");

        setAnimais(aptos);
      } catch (error) {
        console.error("Erro ao buscar animais", error);
      }
    }

    fetchAnimais();
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      async function fetchAdocao() {
        try {
          const adocao = await ApiService.get(`/adocoes/${id}`);
          setFormData({
            nome: adocao.nome,
            cpf: adocao.cpf,
            telefone: adocao.telefone,
            email: adocao.email,
            animal_id: adocao.animal_id,
          });
        } catch (error) {
          console.error("Erro ao carregar adoção", error);
          exibirToast("Erro ao carregar dados da adoção", "danger");
        }
      }

      fetchAdocao();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome || formData.nome.length < 3) {
      novosErros.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.cpf || formData.cpf.replace(/\D/g, "").length !== 11) {
      novosErros.cpf = "CPF inválido";
    }

    if (
      !formData.telefone ||
      formData.telefone.replace(/\D/g, "").length < 11
    ) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!formData.email.includes("@")) {
      novosErros.email = "Email inválido";
    }

    if (!formData.animal_id) {
      novosErros.animal_id = "Selecione um animal";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const exibirToast = (mensagem) => {
    setToastMessage(mensagem);

    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const payload = {
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        email: formData.email,
        animal_id: parseInt(formData.animal_id),
      };

      if (isEditing) {
        await ApiService.put(`/adocoes/${id}`, payload);
        exibirToast("Adoção atualizada com sucesso!");
      } else {
        await ApiService.post("/adocoes", payload);
        exibirToast("Adoção registrada com sucesso!");
      }

      setTimeout(() => navigate("/listar-adocoes"), 1500);
    } catch (error) {
      exibirToast(
        error.message ||
          `Erro ao ${isEditing ? "atualizar" : "registrar"} adoção`,
        "danger",
      );
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEditing ? "Editar Adoção" : "Registrar Adoção"}
        </h5>

        <Link
          to="/listar-adocoes"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
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
                  <Form.Label>Nome *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
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
                  <Form.Label>Telefone *</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
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
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Animal *</Form.Label>
                  <Form.Select
                    name="animal_id"
                    value={formData.animal_id}
                    onChange={handleChange}
                    isInvalid={!!errors.animal_id}
                  >
                    <option value="">Selecione um animal</option>
                    {animais.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.nome} - {animal.especie}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.animal_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="success">
                <i className="bi bi-check-lg me-1"></i>
                {isEditing ? "Atualizar Adoção" : "Registrar Adoção"}
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
        >
          <Toast.Body className={`text-${toastVariant}`}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default FormAdocao;
