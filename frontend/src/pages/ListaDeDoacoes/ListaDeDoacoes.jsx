import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table, Form, Row, Col } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";
import { format } from "date-fns";

function ListaDeDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("danger");

  const exibirToast = useCallback((mensagem, variante = "danger") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  }, []);

  const carregarDoacoes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiService.get(`/doacoes?busca=${busca}`);
      setDoacoes(response || []);
    } catch (error) {
      console.error("Erro ao carregar doações:", error);
      exibirToast("Erro ao carregar a lista de doações.");
    } finally {
      setLoading(false);
    }
  }, [busca, exibirToast]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      carregarDoacoes();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [busca, carregarDoacoes]);

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">Doações</h3>
              <p className="text-muted mb-0">Gerencie todas as doações do sistema</p>
            </div>
            <Link to="/doacoes/cadastro" className="btn btn-success btn-sm d-flex align-items-center gap-2">
              <i className="bi bi-plus-lg"></i> Nova Doação
            </Link>
          </div>

          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              
              <Row className="mb-4">
                <Col md={6} lg={4}>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Pesquisar doações..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Data</th>
                      <th>Doador</th>
                      <th>Tipo</th>
                      <th>Detalhes</th>
                      <th>Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">Carregando informações...</td>
                      </tr>
                    ) : doacoes.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          Nenhuma doação encontrada.
                        </td>
                      </tr>
                    ) : (
                      doacoes.map((doacao) => (
                        <tr key={doacao.id}>
                          <td>
                            {doacao.created_at ? format(new Date(doacao.created_at), 'dd/MM/yyyy') : '-'}
                          </td>
                          <td>
                            <div className="fw-semibold">{doacao.doador_nome}</div>
                            <div className="text-muted small">{doacao.doador_contato || 'Sem contato'}</div>
                          </td>
                          <td>
                            <span className={`badge bg-${doacao.tipo_doacao === 'DINHEIRO' ? 'success' : 'info'}`}>
                              {doacao.tipo_doacao}
                            </span>
                          </td>
                          <td>
                            {doacao.tipo_doacao === 'DINHEIRO' 
                              ? <span className="text-success fw-bold">{formatarValor(doacao.valor)}</span>
                              : <span>{doacao.quantidade} item(ns)</span>
                            }
                          </td>
                          <td>
                            <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                              {doacao.observacao || '-'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </main>

      <ToastContainer position="bottom-center" className="mb-4">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide className="border-0 shadow">
          <Toast.Body className={`d-flex align-items-center gap-2 text-${toastVariant}`}>
            <i className="bi bi-exclamation-circle-fill"></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ListaDeDoacoes;
