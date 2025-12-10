import { useEffect, useState } from "react";
import { Button, Card, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const editar = Boolean(id);

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  useEffect(() => {
    async function carregarCategoria() {
      if (!editar) return;

      try {
        const resposta = await ApiService.get(`/categorias/${id}`);
        const dados = resposta || {};
        setNome(dados.nome || "");
        setDescricao(dados.descricao || "");
      } catch {
        exibirToast("Erro ao carregar dados da categoria.", "danger");
      }
    }

    carregarCategoria();
  }, [id, editar]);

  async function salvarCategoria(event) {
    event.preventDefault();
    setLoading(true);

    const dados = { nome, descricao };

    try {
      if (editar) {
        await ApiService.put(`/categorias/${id}`, dados);
        exibirToast("Categoria atualizada com sucesso!", "success");
      } else {
        await ApiService.post("/categorias", dados);
        exibirToast("Categoria cadastrada com sucesso!", "success");
        setNome("");
        setDescricao("");
      }

      setTimeout(() => navigate("/categorias"), 1000);
    } catch (error) {
      const mensagem =
        error?.response?.data?.error || "Essa categoria já existe";
      exibirToast(mensagem, "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1 fw-semibold">
            {editar ? "Editar categoria" : "Nova categoria"}
          </h5>
          <p className="text-secondary mb-0">
            {editar ? "" : ""}
          </p>
        </div>

        <Button
          variant="outline-secondary"
          onClick={() => navigate("/categorias")}
          className="d-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-left"></i>
          Voltar
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Form onSubmit={salvarCategoria}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-semibold">Nome *</Form.Label>
                <Form.Control
                  type="text"
                  value={nome}
                  placeholder="Ex: Farmácia, Banho & Tosa..."
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label className="fw-semibold">Descrição</Form.Label>
                <Form.Control
                  type="text"
                  value={descricao}
                  placeholder="Descrição opcional da categoria"
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => navigate("/categorias")}
              >
                Cancelar
              </Button>

              <Button variant="success" type="submit" disabled={loading}>
                {loading
                  ? "Salvando..."
                  : editar
                  ? "Atualizar"
                  : "Cadastrar"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
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
    </>
  );
}

export default Formulario;
