import { useEffect, useState, useCallback } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Header from "src/components/Header/Header.jsx";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

function ListaDeAdocoes() {
  const [adocoes, setAdocoes] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adocaoToDelete, setAdocaoToDelete] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const carregarAdocoes = useCallback(async (termo = "") => {
    setLoading(true);
    try {
      const endpoint = termo
        ? `/adocoes?busca=${encodeURIComponent(termo)}`
        : "/adocoes";
      const response = await ApiService.get(endpoint);
      setAdocoes(response || []);
    } catch (error) {
      console.error("Erro ao carregar lista de adoções:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteClick = (adocao) => {
    setAdocaoToDelete(adocao);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adocaoToDelete) return;

    try {
      await ApiService.delete(`/adocoes/${adocaoToDelete.id}`);
      setShowToast(true);
      setToastMessage("Adoção excluída com sucesso!");
      setToastVariant("success");
      carregarAdocoes(search);
    } catch (error) {
      setShowToast(true);
      setToastMessage(error.message || "Erro ao excluir adoção");
      setToastVariant("danger");
    } finally {
      setShowDeleteModal(false);
      setAdocaoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAdocaoToDelete(null);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarAdocoes(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, carregarAdocoes]);

  useEffect(() => {
    console.log(adocoes);
  }, [adocoes]);

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Lista de Adoção</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar adotante..."
                className="form-control"
                style={{ width: "200px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar Adotante"
              />
              <Link
                to="/adocoes/cadastro"
                className="btn btn-success d-flex align-items-center gap-2"
                tabIndex={0}
                aria-label="Cadastrar nova adoção"
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
                      <th className="fw-semibold">CPF</th>
                      <th className="fw-semibold">Telefone</th>
                      <th className="fw-semibold">Email</th>
                      <th className="fw-semibold">Animal</th>
                      <th className="fw-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adocoes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          {search
                            ? "Nenhum resultado encontrado"
                            : "Nenhuma adoção cadastrada"}
                        </td>
                      </tr>
                    ) : (
                      adocoes.map((adocao) => (
                        <tr key={adocao.id}>
                          <td className="align-middle fw-semibold">
                            {adocao.nome}
                          </td>
                          <td className="align-middle">{adocao.cpf}</td>
                          <td className="align-middle">{adocao.telefone}</td>
                          <td className="align-middle">{adocao.email}</td>
                          <td className="align-middle">
                            {adocao.animal_nome || "—"}
                          </td>

                          <td className="align-middle">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/adocoes/cadastro/editar/${adocao.id}`}
                                className="btn btn-outline-primary btn-sm"
                                aria-label="Editar"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteClick(adocao)}
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

      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja excluir a adoção de{" "}
            <strong>{adocaoToDelete?.nome}</strong>?
          </p>
          <p className="text-muted mb-0">Esta ação não pode ser desfeita.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Body className={`text-${toastVariant}`}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default ListaDeAdocoes;
