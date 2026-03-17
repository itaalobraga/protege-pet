import { useState } from "react";
import { Container, Card, Form, Button, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";
import logo from "../../assets/img/logo.png";

function EsqueciMinhaSenha() {
  const [email, setEmail] = useState("");
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
    if (!email?.trim()) {
      novosErros.email = "Email é obrigatório";
    } else if (!email.includes("@")) {
      novosErros.email = "Email inválido";
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await ApiService.post("/auth/esqueci-senha", {
        email: email.trim(),
      });
      exibirToast(
        "Enviamos instruções para redefinir sua senha."
      );
    } catch (error) {
      exibirToast(
        error.message || "Erro ao processar solicitação. Tente novamente.",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

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
                  Recuperação de senha
                </h5>
                <small className="text-secondary">
                  Informe seu email para receber o link
                </small>
              </div>
            </Stack>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu email cadastrado"
                  isInvalid={!!errors.email}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
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
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope me-1"></i>
                    Enviar link
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

export default EsqueciMinhaSenha;
