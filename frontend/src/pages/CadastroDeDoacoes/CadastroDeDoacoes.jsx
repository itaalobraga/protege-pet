import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  

  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
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

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const response = await ApiService.get("/produtos");
        setProdutos(response || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    }
    carregarProdutos();
  }, []);

  const handleMudancaTipo = (novoTipo) => {
    setTipoDoacao(novoTipo);
    if (novoTipo === "DINHEIRO") {
      setProdutoId("");
      setQuantidade("");
    } else {
      setValor("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (tipoDoacao === "DINHEIRO" && (!valor || Number(valor) <= 0)) {
      exibirToast("Informe um valor válido para a doação financeira.", "danger");
      return;
    }

    if (tipoDoacao === "PRODUTO" && (!produtoId || !quantidade || Number(quantidade) <= 0)) {
      exibirToast("Selecione o produto e informe a quantidade.", "danger");
      return;
    }

    setLoading(true);

    try {
      await ApiService.post("/doacoes", {
        doador_nome: doadorNome,
        doador_contato: doadorContato,
        tipo_doacao: tipoDoacao,
        valor: tipoDoacao === "DINHEIRO" ? Number(valor) : 0,
        produto_id: tipoDoacao === "PRODUTO" ? produtoId : null,
        quantidade: tipoDoacao === "PRODUTO" ? Number(quantidade) : 0,
        observacao,
      });

      exibirToast("Doação registrada com sucesso!", "success");
      
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
                Registre as doações recebidas. Doações de produtos atualizarão o estoque automaticamente.
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
                        <option value="PRODUTO">Produto (Atualiza o Estoque)</option>
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
                        placeholder="Ex.: João Silva"
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-mail do Doador (Para enviar recibo)</Form.Label>
                      <Form.Control
                        type="email"
                        value={doadorContato}
                        onChange={(e) => setDoadorContato(e.target.value)}
                        placeholder="email@exemplo.com"
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
                          placeholder="0.00"
                          required
                        />
                      </Form.Group>
                    </Col>
                  ) : (
                    <>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Produto para Estoque</Form.Label>
                          <Form.Select
                            value={produtoId}
                            onChange={(e) => setProdutoId(e.target.value)}
                            required
                          >
                            <option value="">Selecione o produto doado</option>
                            {produtos.map((produto) => (
                              <option key={produto.id} value={produto.id}>
                                {produto.nome} (Estoque atual: {produto.quantidade})
                              </option>
                            ))}
                          </Form.Select>
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
                      <Form.Label>Observação</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-2">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Salvando..." : "Registrar Doação"}
                  </Button>
                  <Link to="/doacoes" className="btn btn-secondary">
                    Cancelar
                  </Link>
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
          <Toast.Body className={`d-flex align-items-center gap-2 text-${toastVariant}`}>
            <i className={`bi bi-${toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default CadastroDeDoacoes;
