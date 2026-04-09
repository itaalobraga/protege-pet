import { useEffect, useState, useCallback } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Header from "src/components/Header/Header.jsx";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

function ListaDeMedicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  const carregarMedicamentos = useCallback(async (termo = "") => {
    setLoading(true);
    try {
      const endpoint = termo
        ? `/medicamentos?busca=${encodeURIComponent(termo)}`
        : "/medicamentos";
      const response = await ApiService.get(endpoint);
      setMedicamentos(response || []);
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
      exibirToast("Erro ao carregar medicamentos.", "danger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarMedicamentos(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, carregarMedicamentos]);

  const handleExcluir = async (id) => {
    try {
      await ApiService.delete(`/medicamentos/${id}`);
      exibirToast("Medicamento excluído com sucesso!", "success");
      carregarMedicamentos(search);
    } catch (error) {
      exibirToast(error.message || "Erro ao excluir medicamento", "danger");
    }
  };

  const abrirModal = (id) => {
    setIdParaExcluir(id);
    setShowModal(true);
  };

  const confirmarExclusao = () => {
    handleExcluir(idParaExcluir);
    setShowModal(false);
  };

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Medicamentos</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                style={{ width: "200px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar medicamento"
              />
              <Link
                to="/medicamentos/cadastro"
                className="btn btn-success d-flex align-items-center gap-2"
                tabIndex={0}
                aria-label="Cadastrar novo medicamento"
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
                      <th className="fw-semibold">Nome</th>
                      <th className="fw-semibold">Princípio Ativo</th>
                      <th className="fw-semibold">Dosagem</th>
                      <th className="fw-semibold">Forma Farmacêutica</th>
                      <th className="fw-semibold">Fabricante</th>
                      <th className="fw-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicamentos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          {search
                            ? "Nenhum resultado encontrado"
                            : "Nenhum medicamento cadastrado"}
                        </td>
                      </tr>
                    ) : (
                      medicamentos.map((medicamento) => (
                        <tr key={medicamento.id}>
                          <td className="align-middle fw-semibold">
                            {medicamento.nome}
                          </td>
                          <td className="align-middle">
                            {medicamento.principio_ativo || "-"}
                          </td>
                          <td className="align-middle">
                            {medicamento.dosagem || "-"}
                          </td>
                          <td className="align-middle">
                            {medicamento.forma_farmaceutica || "-"}
                          </td>
                          <td className="align-middle">
                            {medicamento.fabricante || "-"}
                          </td>
                          <td className="align-middle">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/medicamentos/cadastro/editar/${medicamento.id}`}
                                className="btn btn-outline-primary btn-sm"
                                aria-label="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => abrirModal(medicamento.id)}
                                aria-label="Excluir"
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
          <Toast.Body
            className={`d-flex align-items-center gap-2 text-${toastVariant}`}
          >
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
          <h5 className="fw-semibold mb-2">Confirmar Exclusão</h5>
          <p className="text-secondary mb-4">
            Deseja realmente excluir este medicamento?
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarExclusao}>
              <i className="bi bi-trash me-1"></i> Excluir
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListaDeMedicamentos;
