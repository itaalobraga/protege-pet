import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function CadastroDeDiagnosticos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(isEdit);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = useCallback((mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setCarregandoDados(false);
      return;
    }
    let cancelado = false;
    setCarregandoDados(true);
    ApiService.get(`/diagnosticos/${id}`)
      .then((dados) => {
        if (cancelado || !dados) return;
        setNome(dados.nome || "");
        setDescricao(dados.descricao || "");
      })
      .catch((error) => {
        console.error("Erro ao carregar diagnóstico:", error);
        exibirToast(error.message || "Erro ao carregar diagnóstico.", "danger");
        setTimeout(() => navigate("/diagnosticos"), 2000);
      })
      .finally(() => {
        if (!cancelado) setCarregandoDados(false);
      });
    return () => {
      cancelado = true;
    };
  }, [id, isEdit, navigate, exibirToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome.trim()) {
      exibirToast("O nome do diagnóstico é obrigatório.", "danger");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await ApiService.put(`/diagnosticos/${id}`, { nome, descricao });
        exibirToast("Diagnóstico atualizado com sucesso!", "success");
      } else {
        await ApiService.post("/diagnosticos", { nome, descricao });
        exibirToast("Diagnóstico cadastrado com sucesso!", "success");
      }
      setTimeout(() => navigate("/diagnosticos"), 1000);
    } catch (error) {
      exibirToast(error.message || "Erro ao salvar diagnóstico.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="fw-bold mb-2">
                {isEdit ? "Editar diagnóstico" : "Novo diagnóstico"}
              </h3>
              <p className="text-muted mb-4">
                {isEdit
                  ? "Altere os dados do diagnóstico selecionado."
                  : "Cadastre as patologias e diagnósticos padrões do sistema."}
              </p>

              {carregandoDados ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nome do diagnóstico</Form.Label>
                        <Form.Control
                          type="text"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Ex.: Cinomose, Parvovirose, Dermatite"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label>Descrição / observações padrão</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={descricao}
                          onChange={(e) => setDescricao(e.target.value)}
                          placeholder="Detalhes ou orientações gerais sobre este diagnóstico..."
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading
                        ? "Salvando..."
                        : isEdit
                          ? "Salvar alterações"
                          : "Salvar diagnóstico"}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/diagnosticos")}>
                      Cancelar
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Container>
      </main>

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

export default CadastroDeDiagnosticos;
