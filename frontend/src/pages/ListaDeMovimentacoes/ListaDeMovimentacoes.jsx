import { useCallback, useEffect, useState } from "react";
import { Card, Container, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "src/components/Header/Header.jsx";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../services/ApiService";

function ListaDeMovimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = useCallback((mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  }, []);

  const carregarMovimentacoes = useCallback(async (termo = "") => {
    setLoading(true);

    try {
      const endpoint = termo
        ? `/movimentacoes-estoque?busca=${encodeURIComponent(termo)}`
        : "/movimentacoes-estoque";

      const response = await ApiService.get(endpoint);
      setMovimentacoes(response || []);
    } catch (error) {
      console.error("Erro ao carregar movimentações:", error);
      setMovimentacoes([]);
      exibirToast("Erro ao carregar movimentações.", "danger");
    } finally {
      setLoading(false);
    }
  }, [exibirToast]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarMovimentacoes(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, carregarMovimentacoes]);

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatarTipo = (tipo) => {
    if (!tipo) return "-";
    return tipo === "ENTRADA" ? "Entrada" : "Saída";
  };

  const formatarMotivo = (motivo) => {
    if (!motivo) return "-";
    const mapaMotivos = {
      DOACAO: "Doação",
      COMPRA: "Compra",
      USO_ANIMAL: "Uso em animal",
      USO_INTERNO: "Uso interno",
      DESCARTE: "Descarte",
      AJUSTE: "Ajuste",
    };
    return mapaMotivos[motivo] || motivo.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const movimentacoesFiltradas = movimentacoes.filter((m) => !tipoFiltro || m.tipo === tipoFiltro);

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-semibold">Histórico de Movimentações</h5>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control"
                style={{ width: "200px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar movimentação"
              />
              <Form.Select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                style={{ width: "180px" }}
              >
                <option value="">Todos os tipos</option>
                <option value="ENTRADA">Entradas</option>
                <option value="SAIDA">Saídas</option>
              </Form.Select>
              <Link
                to="/movimentacoes/nova"
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
                      <th className="fw-semibold">Data</th>
                      <th className="fw-semibold text-start">Produto</th>
                      <th className="fw-semibold">Tipo</th>
                      <th className="fw-semibold">Quantidade</th>
                      <th className="fw-semibold">Motivo</th>
                      <th className="fw-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentacoesFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          {search || tipoFiltro
                            ? "Nenhuma movimentação encontrada"
                            : "Nenhuma movimentação registrada"}
                        </td>
                      </tr>
                    ) : (
                      movimentacoesFiltradas.map((movimentacao) => (
                        <tr key={movimentacao.id}>
                          <td className="align-middle">{formatarData(movimentacao.created_at)}</td>
                          <td className="align-middle text-start">{movimentacao.produto_nome}</td>
                          <td className="align-middle">{formatarTipo(movimentacao.tipo)}</td>
                          <td className="align-middle">{movimentacao.quantidade}</td>
                          <td className="align-middle">{formatarMotivo(movimentacao.motivo)}</td>
                          <td className="align-middle">
                            <div className="d-flex gap-2 justify-content-center">
                              <Link
                                to={`/movimentacoes/${movimentacao.id}`}
                                className="btn btn-outline-primary btn-sm"
                                aria-label="Ver detalhes"
                              >
                                <i className="bi bi-eye"></i>
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

export default ListaDeMovimentacoes;