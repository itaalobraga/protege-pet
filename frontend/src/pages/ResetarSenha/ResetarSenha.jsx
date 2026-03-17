import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Stack } from "react-bootstrap";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";
import logo from "../../assets/img/logo.png";

function ResetarSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ novaSenha: "", confirmarSenha: "" });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [loading, setLoading] = useState(false);

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  const validarFormulario = () => {
    const novosErros = {};
    if (!formData.novaSenha) {
      novosErros.novaSenha = "Nova senha é obrigatória";
    } else if (formData.novaSenha.length < 6) {
      novosErros.novaSenha = "A senha deve ter pelo menos 6 caracteres";
    }
    if (formData.novaSenha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem";
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    if (!token) {
      exibirToast("Link inválido. Solicite uma nova recuperação de senha.", "danger");
      return;
    }

    setLoading(true);
    try {
      await ApiService.post("/auth/redefinir-senha", {
        token,
        novaSenha: formData.novaSenha,
      });
      exibirToast("Senha alterada com sucesso! Faça login com a nova senha.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (error) {
      exibirToast(
        error.message || "Erro ao alterar senha. Tente novamente.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
        <Container className="d-flex justify-content-center">
          <Card
            className="border-0 shadow-sm"
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Card.Body className="p-4 text-center">
              <Stack gap={3} className="align-items-center mb-4">
                <img src={logo} alt="Protege Pet" width={80} height={60} />
                <h5 className="fw-semibold" style={{ color: "#3F4D87" }}>
                  Link inválido
                </h5>
                <p className="text-secondary mb-0">
                  O link de recuperação de senha é inválido ou expirou. Solicite
                  uma nova recuperação de senha.
                </p>
                <Link to="/esqueci-senha" className="btn btn-success">
                  Solicitar nova recuperação
                </Link>
                <Link to="/login" className="text-success text-decoration-none">
                  Voltar ao login
                </Link>
              </Stack>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-4">
      <Container className="d-flex justify-content-center">
        <Card
          className="border-0 shadow-sm"
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Card.Body className="p-4">
            <Stack gap={3} className="align-items-center mb-4">
              <img src={logo} alt="Protege Pet" width={80} height={60} />
              <div className="text-center">
                <h5 className="mb-0 fw-semibold" style={{ color: "#3F4D87" }}>
                  Redefinir senha
                </h5>
                <small className="text-secondary">
                  Informe sua nova senha abaixo
                </small>
              </div>
            </Stack>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Nova senha</Form.Label>
                <Form.Control
                  type="password"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  isInvalid={!!errors.novaSenha}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.novaSenha}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Confirmar senha</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  placeholder="Repita a nova senha"
                  isInvalid={!!errors.confirmarSenha}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmarSenha}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="w-100 mb-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    />
                    Alterando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-key me-1"></i>
                    Alterar senha
                  </>
                )}
              </Button>

              <div className="text-center mt-3">
                <Link to="/login" className="text-success text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i>
                  Voltar ao login
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
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

export default ResetarSenha;
