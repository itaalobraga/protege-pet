import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function CadastroDeDoacoes() {
  const navigate = useNavigate();
  const [tipoDoacao, setTipoDoacao] = useState("DINHEIRO");
  const [doadorNome, setDoadorNome] = useState("");
  const [doadorContato, setDoadorContato] = useState("");
  const [valor, setValor] = useState("");
  const [item, setItem] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = useCallback((mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  }, []);

  const handleMudancaTipo = (novoTipo) => {
    setTipoDoacao(novoTipo);
    if (novoTipo === "DINHEIRO") {
      setItem("");
      setQuantidade("");
    } else {
      setValor("");
    }
  };

  const limparFormulario = () => {
    setDoadorNome("");
    setDoadorContato("");
    setTipoDoacao("DINHEIRO");
    setValor("");
    setItem("");
    setQuantidade("");
    setObservacao("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (tipoDoacao === "DINHEIRO" && (!valor || Number(valor) <= 0)) {
      exibirToast("Informe um valor válido para a doação financeira.", "danger");
      return;
    }

    if (tipoDoacao === "PRODUTO" && (!item || !quantidade || Number(quantidade) <= 0)) {
      exibirToast("Informe o item e a quantidade para doações físicas.", "danger");
      return;
    }

    setLoading(true);

    try {
      await ApiService.post("/doacoes", {
        doador_nome: doadorNome,
        doador_contato: doadorContato,
        tipo_doacao: tipoDoacao,
        valor: tipoDoacao === "DINHEIRO" ? Number(valor) : 0,
        item: tipoDoacao === "PRODUTO" ? item : "",
        quantidade: tipoDoacao === "PRODUTO" ? Number(quantidade) : 0,
        observacao,
      });

      exibirToast("Doação registrada com sucesso!", "success");
      limparFormulario();
      setTimeout(() => {
        navigate("/doacoes");
      }, 1000);
    } catch (error) {
      console.error("Erro ao registrar doação:", error);
      exibirToast(error.message || "Erro ao registrar doação.", "danger");
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
              <h3 className="fw-bold mb-2">Recebimento de Doação</h3>
              <p className="text-muted mb-4">
                Registre as doações recebidas pelo Protegepet, seja em dinheiro ou em produtos físicos.
              </p>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Doação</Form.Label>
                      <Form.Select
                        value={tipoDoacao}
                        onChange={(e) => handleMudancaTipo(e.target.value)}
                      >
                        <option value="DINHEIRO">Dinheiro / Transferência</option>
                        <option value="PRODUTO">Produto Físico (Ração, remédio, etc)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome do Doador (Opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        value={doadorNome}
                        onChange={(e) => setDoadorNome(e.target.value)}
                        placeholder="Ex.: João Silva (Deixe em branco se anônimo)"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Contato do Doador (Opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        value={doadorContato}
                        onChange={(e) => setDoadorContato(e.target.value)}
                        placeholder="Ex.: (11) 99999-9999 ou email"
                      />
                    </Form.Group>
                  </Col>

                  {tipoDoacao === "DINHEIRO" ? (
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Valor da Doação (R$)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={valor}
                          onChange={(e) => setValor(e.target.value)}
                          placeholder="0,00"
                          required
                        />
                      </Form.Group>
                    </Col>
                  ) : (
                    <>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nome do Item / Produto</Form.Label>
                          <Form.Control
                            type="text"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            placeholder="Ex.: Saco de Ração Pedigree 15kg"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Quantidade</Form.Label>
                          <Form.Control
                            type="number"
                            min="1"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            placeholder="1"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label>Observação (Opcional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Ex.: Doação recebida durante a feira de adoção."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? "Registrando..." : "Registrar Doação"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={limparFormulario}
                  >
                    Limpar
                  </Button>
                </div>
              </Form>
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

export default CadastroDeDoacoes;