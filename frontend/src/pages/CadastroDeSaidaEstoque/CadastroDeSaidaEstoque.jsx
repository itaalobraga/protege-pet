import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "../../components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function CadastroDeSaidaEstoque() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [motivoOutro, setMotivoOutro] = useState("");
  const [responsavel, setResponsavel] = useState("");
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

  const carregarProdutos = useCallback(async () => {
    try {
      const response = await ApiService.get("/produtos");
      setProdutos(response || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      exibirToast("Erro ao carregar produtos.", "danger");
    }
  }, [exibirToast]);

  const carregarUsuarios = useCallback(async () => {
    try {
      const response = await ApiService.get("/usuarios");
      setUsuarios(response || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      exibirToast("Erro ao carregar usuários.", "danger");
    }
  }, [exibirToast]);

  useEffect(() => {
    carregarProdutos();
    carregarUsuarios();
  }, [carregarProdutos, carregarUsuarios]);

  const limparFormulario = () => {
    setProdutoId("");
    setQuantidade("");
    setMotivo("");
    setMotivoOutro("");
    setResponsavel("");
    setObservacao("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const motivoFinal =
      motivo === "OUTROS" ? motivoOutro.trim().toUpperCase() : motivo;

    if (!produtoId || !quantidade || !motivo || !responsavel) {
      exibirToast("Preencha os campos obrigatórios.", "danger");
      return;
    }

    if (motivo === "OUTROS" && !motivoOutro.trim()) {
      exibirToast("Digite o motivo em Outros.", "danger");
      return;
    }

    setLoading(true);

    try {
      await ApiService.post("/saidas-estoque", {
        produto_id: produtoId,
        quantidade: Number(quantidade),
        motivo: motivoFinal,
        responsavel,
        observacao,
      });

      exibirToast("Saída registrada com sucesso!", "success");
      limparFormulario();
      carregarProdutos();

      setTimeout(() => {
        navigate("/movimentacoes");
      }, 1000);
    } catch (error) {
      console.error("Erro ao registrar saída:", error);
      exibirToast(error.message || "Erro ao registrar saída.", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <Container className="py-4">
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4">
            <h3 className="fw-bold mb-2">Saída de Produtos</h3>
            <p className="text-muted mb-4">
              Registre aqui Saidas do Estoque.
            </p>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Produto</Form.Label>
                    <Form.Select
                      value={produtoId}
                      onChange={(e) => setProdutoId(e.target.value)}
                      required
                    >
                      <option value="">Selecione um produto</option>
                      {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome} - Estoque atual: {produto.quantidade}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantidade</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      placeholder="Digite a quantidade"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Motivo</Form.Label>
                    <Form.Select
                      value={motivo}
                      onChange={(e) => {
                        setMotivo(e.target.value);
                        if (e.target.value !== "OUTROS") {
                          setMotivoOutro("");
                        }
                      }}
                      required
                    >
                      <option value="">Selecione o motivo</option>
                      <option value="USO_INTERNO">Uso interno</option>
                      <option value="USO_ANIMAL">Uso em animal</option>
                      <option value="DESCARTE">Descarte</option>
                      <option value="AJUSTE">Ajuste</option>
                      <option value="OUTROS">Outros</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {motivo === "OUTROS" && (
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Digite o motivo</Form.Label>
                      <Form.Control
                        type="text"
                        value={motivoOutro}
                        onChange={(e) => setMotivoOutro(e.target.value)}
                        placeholder="Digite o motivo"
                        required
                      />
                    </Form.Group>
                  </Col>
                )}

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Responsável</Form.Label>
                    <Form.Select
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      required
                    >
                      <option value="">Selecione um responsável</option>
                      {usuarios.map((usuario) => {
                        const funcaoUsuario =
                          usuario.funcao ||
                          usuario.funcao_nome ||
                          usuario.nome_funcao ||
                          usuario.descricao_funcao ||
                          "Sem função";

                        return (
                          <option
                            key={usuario.id}
                            value={`${usuario.nome} - ${funcaoUsuario}`}
                          >
                            {usuario.nome} - {funcaoUsuario}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-4">
                    <Form.Label>Observação</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                      placeholder="Ex.: Uso interno da ONG"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                <Button type="submit" variant="danger" disabled={loading}>
                  {loading ? "Salvando..." : "Registrar saída"}
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

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastVariant}
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default CadastroDeSaidaEstoque;