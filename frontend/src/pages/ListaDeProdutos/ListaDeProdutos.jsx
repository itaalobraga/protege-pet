import { useEffect, useState, useCallback } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Header from "src/components/Header/Header.jsx";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

function ListaDeProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const carregarProdutos = useCallback(async (termo = "") => {
    setLoading(true);
    try {
      const endpoint = termo
        ? `/produtos?busca=${encodeURIComponent(termo)}`
        : "/produtos";
      const response = await ApiService.get(endpoint);
      setProdutos(response || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarProdutos(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, carregarProdutos]);

  const handleExcluirChange = async (id) => {
    try {
      await ApiService.delete(`/produtos/${id}`);
      setShowToast(true);
      carregarProdutos(search);
    } catch (error) {
      console.error("Erro ao excluir:", error);
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

  const getEstoqueBadge = (quantidade) => {
    const qtd = Number(quantidade);
    if (qtd <= 0) {
      return <span className="badge bg-danger">Indisponível</span>;
    }
    if (qtd <= 3) {
      return <span className="badge bg-warning text-dark">Baixo estoque</span>;
    }
    return <span className="badge bg-success">Disponível</span>;
  };

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Produtos</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                style={{ width: "200px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar produto"
              />
              <Link
                to="/produtos/cadastro"
                className="btn btn-success d-flex align-items-center gap-2"
                tabIndex={0}
                aria-label="Cadastrar novo produto"
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
                      <th className="fw-semibold text-start">Nome</th>
                      <th className="fw-semibold">Código</th>
                      <th className="fw-semibold">Categoria</th>
                      <th className="fw-semibold">Quantidade</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          {search
                            ? "Nenhum resultado encontrado"
                            : "Nenhum produto cadastrado"}
                        </td>
                      </tr>
                    ) : (
                      produtos.map((produto) => (
                        <tr key={produto.id}>
                          <td className="align-middle text-start">
                            <div className="fw-semibold">{produto.nome}</div>
                            {produto.descricao && (
                              <small className="text-secondary">
                                {produto.descricao}
                              </small>
                            )}
                          </td>
                          <td className="align-middle">{produto.sku}</td>
                          <td className="align-middle">{produto.categoria || "-"}</td>
                          <td className="align-middle">{produto.quantidade}</td>
                          <td className="align-middle">
                            {getEstoqueBadge(produto.quantidade)}
                          </td>
                          <td className="align-middle">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/produtos/cadastro/editar/${produto.id}`}
                                className="btn btn-outline-primary btn-sm"
                              >
                                Editar
                              </Link>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => abrirModal(produto.id)}
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
          delay={3000}
          autohide
          className="border-0 shadow"
        >
          <Toast.Body className="d-flex align-items-center gap-2 text-danger">
            <i className="bi bi-check-circle-fill"></i>
            Produto excluído com sucesso!
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3 d-block"></i>
          <h5 className="fw-semibold mb-2">Confirmar Exclusão</h5>
          <p className="text-secondary mb-4">
            Deseja realmente excluir este produto?
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

export default ListaDeProdutos;

