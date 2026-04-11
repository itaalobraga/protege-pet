import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table, Form, InputGroup } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function ListaDeDiagnosticos() {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const exibirToast = useCallback((mensagem) => {
    setToastMessage(mensagem);
    setShowToast(true);
  }, []);

  const carregarDiagnosticos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiService.get(`/diagnosticos?busca=${busca}`);
      setDiagnosticos(response || []);
    } catch (error) {
      exibirToast("Erro ao carregar a lista de diagnósticos.");
    } finally {
      setLoading(false);
    }
  }, [busca, exibirToast]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => carregarDiagnosticos(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [busca, carregarDiagnosticos]);

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">Diagnósticos</h3>
            <Link to="/diagnosticos/cadastro" className="btn btn-success btn-sm d-flex align-items-center gap-2">
              <i className="bi bi-plus-lg"></i> Novo Diagnóstico
            </Link>
          </div>

          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <InputGroup className="mb-4">
                <InputGroup.Text className="bg-white"><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                  placeholder="Buscar por nome ou descrição..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </InputGroup>

              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nome do Diagnóstico</th>
                      <th>Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="2" className="text-center py-4">Carregando...</td></tr>
                    ) : diagnosticos.length === 0 ? (
                      <tr><td colSpan="2" className="text-center py-4 text-muted">Nenhum diagnóstico encontrado.</td></tr>
                    ) : (
                      diagnosticos.map((diag) => (
                        <tr key={diag.id}>
                          <td className="fw-semibold">{diag.nome}</td>
                          <td>{diag.descricao || '-'}</td>
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
          <Toast.Body className="d-flex align-items-center gap-2 text-danger">
            <i className="bi bi-exclamation-circle-fill"></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ListaDeDiagnosticos;