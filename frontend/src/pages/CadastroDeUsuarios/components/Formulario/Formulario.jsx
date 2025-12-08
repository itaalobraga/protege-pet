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
    funcao_id: "",
    telefone: "",
    email: "",
    disponibilidade: "",
    senha: "",
  });
  const [funcoes, setFuncoes] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    ApiService.get("/funcoes").then((response) => {
      setFuncoes(response || []);
    });

    if (isEdit) {
      ApiService.get(`/usuarios/${id}`).then((response) => {
        if (response) {
          setFormData({
            nome: response.nome || "",
            funcao_id: response.funcao_id || "",
            telefone: response.telefone || "",
            email: response.email || "",
            disponibilidade: response.disponibilidade || "",
            senha: response.senha || "",
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

    if (!formData.funcao_id) {
      novosErros.funcao_id = "Selecione uma função";
    }

    if (!formData.telefone || formData.telefone.replace(/\D/g, "").length < 11) {
      novosErros.telefone = "Telefone inválido";
    }

    if (!formData.email.includes("@")) {
      novosErros.email = "Email inválido";
    }

    if (!formData.disponibilidade) {
      novosErros.disponibilidade = "Selecione uma disponibilidade";
    }

    if (!formData.senha || formData.senha.length < 6) {
      novosErros.senha = "Senha deve ter pelo menos 6 caracteres";
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
        funcao_id: parseInt(formData.funcao_id),
        telefone: formData.telefone,
        email: formData.email,
        disponibilidade: formData.disponibilidade,
        senha: formData.senha,
      };

      try {
        if (isEdit) {
          await ApiService.put(`/usuarios/${id}`, payload);
          exibirToast("Usuário atualizado com sucesso!");
        } else {
          await ApiService.post("/usuarios", payload);
          exibirToast("Usuário cadastrado com sucesso!");
        }
        setTimeout(() => navigate("/usuarios"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar usuário", "danger");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Usuário" : "Novo Usuário"}
        </h5>
        <Link
          to="/usuarios"
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
                  <Form.Label className="fw-semibold">Nome Completo *</Form.Label>
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
                  <Form.Label className="fw-semibold">Função *</Form.Label>
                  <Form.Select
                    name="funcao_id"
                    value={formData.funcao_id}
                    onChange={handleChange}
                    isInvalid={!!errors.funcao_id}
                    className={!formData.funcao_id ? "placeholder-active" : ""}
                  >
                    <option value="">Selecione uma função</option>
                    {funcoes.map((funcao) => (
                      <option key={funcao.id} value={funcao.id}>
                        {funcao.nome}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.funcao_id}
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
                  <Form.Label className="fw-semibold">Disponibilidade *</Form.Label>
                  <Form.Select
                    name="disponibilidade"
                    value={formData.disponibilidade}
                    onChange={handleChange}
                    isInvalid={!!errors.disponibilidade}
                    className={!formData.disponibilidade ? "placeholder-active" : ""}
                  >
                    <option value="">Selecione uma disponibilidade</option>
                    {DISPONIBILIDADES.map((disponibilidade) => (
                      <option key={disponibilidade} value={disponibilidade}>
                        {disponibilidade}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.disponibilidade}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Senha *</Form.Label>
                  <Form.Control
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    isInvalid={!!errors.senha}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.senha}
                  </Form.Control.Feedback>
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
