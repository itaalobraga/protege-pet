import { useEffect, useState, useCallback } from "react";
import { Button, Container, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Header from "src/components/Header/Header.jsx";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

function ListaDeFuncoes() {
  const [funcoes, setFuncoes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const carregarFuncoes = useCallback(async (termo = "") => {
    setLoading(true);
    try {
      const endpoint = termo
        ? `/funcoes?busca=${encodeURIComponent(termo)}`
        : "/funcoes";
      const response = await ApiService.get(endpoint);
      setFuncoes(response || []);
    } catch (error) {
      console.error("Erro ao carregar funções:", error);
      exibirToast("Erro ao carregar funções.", "danger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarFuncoes(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, carregarFuncoes]);

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  const handleExcluirChange = async (id) => {
    try {
      await ApiService.delete(`/funcoes/${id}`);
      exibirToast("Função excluída com sucesso!", "success");
      carregarFuncoes(search);
    } catch (error) {
      exibirToast(error.message || "Erro ao excluir função", "danger");
    }
  };

  const abrirModal = (id) => {
    setIdParaExcluir(id);
    setShowModal(true);
  };

  const confirmarExclusao = () => {
    handleExcluirChange(idParaExcluir);
    setShowModal(false);
  };

  const getBadgeVariant = (permissao) => {
    const cores = {
      "Gerenciar usuários": "primary",
      "Gerenciar produtos": "success",
      "Gerenciar voluntários": "info",
      "Gerenciar veterinários": "warning",
      "Gerenciar animais": "secondary",
    };
    return cores[permissao] || "dark";
  };

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Funções</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                style={{ width: "200px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar função"
              />
              <Link
                to="/funcoes/cadastro"
                className="btn btn-success d-flex align-items-center gap-2"
                tabIndex={0}
                aria-label="Cadastrar nova função"
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
                      <th className="fw-semibold">Nome</th>
                      <th className="fw-semibold">Permissões</th>
                      <th className="fw-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funcoes.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          {search
                            ? "Nenhum resultado encontrado"
                            : "Nenhuma função cadastrada"}
                        </td>
                      </tr>
                    ) : (
                      funcoes.map((funcao) => (
                        <tr key={funcao.id}>
                          <td className="align-middle">{funcao.nome}</td>
                          <td className="align-middle">
                            <div className="d-flex flex-wrap gap-1 justify-content-center">
                              {funcao.permissoes.map((permissao, index) => (
                                <Badge
                                  key={index}
                                  bg={getBadgeVariant(permissao)}
                                  className="fw-normal"
                                >
                                  {permissao}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="align-middle">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/funcoes/cadastro/editar/${funcao.id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                Editar
                              </Link>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => abrirModal(funcao.id)}
                              >
                                Excluir
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
            <i className={`bi bi-${toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3 d-block"></i>
          <h5 className="fw-semibold mb-2">Confirmar Exclusão</h5>
          <p className="text-secondary mb-4">
            Deseja realmente excluir esta função?
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

export default ListaDeFuncoes;
