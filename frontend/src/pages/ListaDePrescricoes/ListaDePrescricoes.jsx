import { useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function ListaDePrescricoes() {
  const [prescricoes, setPrescricoes] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = useCallback((mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  }, []);

  const carregarPrescricoes = useCallback(async (termo = "") => {
    setLoading(true);
    try {
      const endpoint = termo
        ? `/prescricoes?busca=${encodeURIComponent(termo)}`
        : "/prescricoes";
      const response = await ApiService.get(endpoint);
      setPrescricoes(response || []);
    } catch (error) {
      console.error("Erro ao carregar prescrições:", error);
      setPrescricoes([]);
      exibirToast("Erro ao carregar prescrições.", "danger");
    } finally {
      setLoading(false);
    }
  }, [exibirToast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarPrescricoes(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, carregarPrescricoes]);

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatarStatus = (status) => {
    if (status === "ATIVA") return "Ativa";
    if (status === "ENCERRADA") return "Encerrada";
    if (status === "CANCELADA") return "Cancelada";
    return status || "-";
  };

  const abrirModal = (id) => {
    setIdSelecionado(id);
    setShowModal(true);
  };

  const confirmarAcao = async () => {
    if (!idSelecionado) return;

    try {
      await ApiService.delete(`/prescricoes/${idSelecionado}`);
      exibirToast("Prescrição excluída com sucesso!");
      carregarPrescricoes(search);
    } catch (error) {
      exibirToast(error.message || "Erro ao excluir prescrição.", "danger");
    } finally {
      setShowModal(false);
      setIdSelecionado(null);
    }
  };

  const prescricoesFiltradas = prescricoes.filter(
    (p) => !statusFiltro || p.status === statusFiltro
  );

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Prescrições</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                style={{ width: "220px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar prescrição"
              />
              <Form.Select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                style={{ width: "170px" }}
              >
                <option value="">Todos os status</option>
                <option value="ATIVA">Ativa</option>
                <option value="ENCERRADA">Encerrada</option>
                <option value="CANCELADA">Cancelada</option>
              </Form.Select>
              <Link
                to="/prescricoes/cadastro"
                className="btn btn-success d-flex align-items-center gap-2"
                tabIndex={0}
              >
                <i className="bi bi-plus-lg"></i> Nova
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
                      <th className="fw-semibold">Consulta</th>
                      <th className="fw-semibold text-start">Animal</th>
                      <th className="fw-semibold text-start">Medicamento</th>
                      <th className="fw-semibold">Dosagem</th>
                      <th className="fw-semibold">Frequência</th>
                      <th className="fw-semibold">Duração</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescricoesFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          {search || statusFiltro
                            ? "Nenhuma prescrição encontrada"
                            : "Nenhuma prescrição cadastrada"}
                        </td>
                      </tr>
                    ) : (
                      prescricoesFiltradas.map((prescricao) => (
                        <tr key={prescricao.id}>
                          <td className="align-middle">#{prescricao.consulta_id}</td>
                          <td className="align-middle text-start">{prescricao.animal_nome}</td>
                          <td className="align-middle text-start">{prescricao.medicamento_nome}</td>
                          <td className="align-middle">{prescricao.dosagem}</td>
                          <td className="align-middle">{prescricao.frequencia}</td>
                          <td className="align-middle">{prescricao.duracao_dias} dias</td>
                          <td className="align-middle">{formatarStatus(prescricao.status)}</td>
                          <td className="align-middle">
                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                              <Link
                                to={`/prescricoes/cadastro/editar/${prescricao.id}`}
                                className="btn btn-outline-primary btn-sm"
                                aria-label="Editar"
                                title="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <Link
                                to={`/prescricoes/${prescricao.id}/ministracoes`}
                                className="btn btn-outline-secondary btn-sm"
                                aria-label="Ministrações"
                                title="Ministrações"
                              >
                                <i className="bi bi-journal-medical"></i>
                              </Link>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => abrirModal(prescricao.id)}
                                aria-label="Excluir"
                                title="Excluir"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
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
          <Toast.Body className={`d-flex align-items-center gap-2 text-${toastVariant}`}>
            <i
              className={`bi bi-${toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}
            ></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3 d-block"></i>
          <h5 className="fw-semibold mb-2">Confirmar exclusão</h5>
          <p className="text-secondary mb-4">Deseja realmente excluir esta prescrição?</p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Voltar
            </Button>
            <Button variant="danger" onClick={confirmarAcao}>
              <i className="bi bi-trash me-1"></i> Excluir
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListaDePrescricoes;
