import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Table } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function ListaDeAtendimentos() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  const carregarAtendimentos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiService.get("/atendimentos");
      setAtendimentos(response || []);
    } catch (error) {
      console.error("Erro ao carregar atendimentos", error);
      exibirToast("Erro ao carregar o histórico de atendimentos.", "danger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAtendimentos();
  }, [carregarAtendimentos]);

  const atendimentosFiltrados = useMemo(() => {
    const termo = search.trim().toLowerCase();
    if (!termo) return atendimentos;
    return atendimentos.filter((a) => {
      const paciente = (a.animal_nome || "").toLowerCase();
      const vet = (a.veterinario_nome || "").toLowerCase();
      const diag = (a.diagnostico_nome || "").toLowerCase();
      return (
        paciente.includes(termo) || vet.includes(termo) || diag.includes(termo)
      );
    });
  }, [atendimentos, search]);

  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Histórico de atendimentos</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                style={{ width: "200px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar atendimento"
              />
              <Link
                to="/atendimentos/cadastro"
                className="btn btn-success d-flex align-items-center gap-2"
                tabIndex={0}
                aria-label="Novo atendimento"
              >
                <i className="bi bi-plus-lg"></i> Novo
              </Link>
            </div>
          </div>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : (
                <Table hover responsive className="text-center mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Data/hora</th>
                      <th className="fw-semibold">Paciente</th>
                      <th className="fw-semibold">Veterinário</th>
                      <th className="fw-semibold">Diagnóstico</th>
                      <th className="fw-semibold">Peso</th>
                      <th className="fw-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atendimentosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          {search.trim()
                            ? "Nenhum resultado encontrado"
                            : "Nenhum atendimento registrado"}
                        </td>
                      </tr>
                    ) : (
                      atendimentosFiltrados.map((atendimento) => (
                        <tr key={atendimento.id}>
                          <td className="align-middle fw-semibold">
                            {formatarData(atendimento.data_atendimento)}
                          </td>
                          <td className="align-middle">
                            {atendimento.animal_nome}
                          </td>
                          <td className="align-middle">
                            Dr(a). {atendimento.veterinario_nome}
                          </td>
                          <td className="align-middle">
                            {atendimento.diagnostico_nome ? (
                              <span className="badge bg-danger">
                                {atendimento.diagnostico_nome}
                              </span>
                            ) : (
                              <span className="text-muted small">
                                Sem diagnóstico
                              </span>
                            )}
                          </td>
                          <td className="align-middle">
                            {atendimento.peso ? `${atendimento.peso} kg` : "-"}
                          </td>
                          <td className="align-middle">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/atendimentos/${atendimento.id}`}
                                className="btn btn-outline-secondary btn-sm"
                                aria-label="Ver detalhes"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              <Link
                                to={`/atendimentos/cadastro/editar/${atendimento.id}`}
                                className="btn btn-outline-primary btn-sm"
                                aria-label="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
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

export default ListaDeAtendimentos;
