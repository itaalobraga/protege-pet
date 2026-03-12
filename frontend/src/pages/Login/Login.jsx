import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Stack } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/img/logo.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const novosErros = {};
    if (!formData.email?.trim()) {
      novosErros.email = "Email é obrigatório";
    }
    if (!formData.senha) {
      novosErros.senha = "Senha é obrigatória";
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  useEffect(() => {
    if (location.state?.sessionExpired) {
      exibirToast("Sua sessão expirou. Faça login novamente.", "danger");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.sessionExpired]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      await ApiService.post("/auth/login", {
        email: formData.email.trim(),
        senha: formData.senha,
      });
      await checkAuth();
      exibirToast("Login realizado com sucesso!");
      const from = location.state?.from?.pathname || "/usuarios";
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (error) {
      const mensagemInvalida =
        !error?.message ||
        error.message === "Não autenticado" ||
        error.message === "Token inválido";
      exibirToast(
        mensagemInvalida ? "Email ou senha inválidos. Tente novamente." : error.message,
        "danger"
      );
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
      <Container className="d-flex justify-content-center">
        <Card className="border-0 shadow-sm" style={{ width: "100%", maxWidth: 400 }}>
          <Card.Body className="p-4">
            <Stack gap={3} className="align-items-center mb-4">
              <img src={logo} alt="Protege Pet" width={80} height={60} />
              <div className="text-center">
                <h5 className="mb-0 fw-semibold" style={{ color: "#3F4D87" }}>
                  Protege Pet
                </h5>
                <small className="text-secondary">Entre com suas credenciais</small>
              </div>
            </Stack>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite seu email"
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Senha</Form.Label>
                <Form.Control
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  isInvalid={!!errors.senha}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.senha}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="success" className="w-100">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Entrar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>

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
              className={`bi bi-${
                toastVariant === "success"
                  ? "check-circle-fill"
                  : "exclamation-circle-fill"
              }`}
            ></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Login;
