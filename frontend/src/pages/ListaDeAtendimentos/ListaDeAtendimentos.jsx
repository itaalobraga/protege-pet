import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table, Badge } from "react-bootstrap";
import Header from "../../components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function ListaDeAtendimentos() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarAtendimentos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiService.get("/atendimentos");
      setAtendimentos(response || []);
    } catch (error) {
      console.error("Erro ao carregar atendimentos", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAtendimentos();
  }, [carregarAtendimentos]);

  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">Histórico de Atendimentos</h3>
            <Link to="/atendimentos/cadastro" className="btn btn-success btn-sm d-flex align-items-center gap-2">
              <i className="bi bi-clipboard2-plus"></i> Novo Atendimento
            </Link>
          </div>

          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Data/Hora</th>
                      <th>Paciente</th>
                      <th>Veterinário</th>
                      <th>Diagnóstico</th>
                      <th>Peso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-4">Carregando histórico...</td></tr>
                    ) : atendimentos.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">Nenhum atendimento registrado.</td></tr>
                    ) : (
                      atendimentos.map((atendimento) => (
                        <tr key={atendimento.id}>
                          <td className="fw-semibold">{formatarData(atendimento.data_atendimento)}</td>
                          <td>{atendimento.animal_nome}</td>
                          <td>Dr(a). {atendimento.veterinario_nome}</td>
                          <td>
                            {atendimento.diagnostico_nome ? (
                              <Badge bg="danger">{atendimento.diagnostico_nome}</Badge>
                            ) : (
                              <span className="text-muted small">Sem diagnóstico</span>
                            )}
                          </td>
                          <td>{atendimento.peso ? `${atendimento.peso} kg` : '-'}</td>
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
    </>
  );
}

export default ListaDeAtendimentos;