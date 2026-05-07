import { useCallback, useEffect, useState } from "react";
import { Button, Card, Container, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

const API_URL = import.meta.env.VITE_API_URL;

function ListaDeMinistracoes() {
  const { prescricaoId } = useParams();
  const [prescricao, setPrescricao] = useState(null);
  const [ministracoes, setMinistracoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = useCallback((mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  }, []);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const [prescricaoResponse, ministracoesResponse] = await Promise.all([
        ApiService.get(`/prescricoes/${prescricaoId}`),
        ApiService.get(`/ministracoes?prescricao_id=${prescricaoId}`),
      ]);
      setPrescricao(prescricaoResponse || null);
      setMinistracoes(ministracoesResponse || []);
    } catch (error) {
      console.error("Erro ao carregar ministrações:", error);
      exibirToast(error.message || "Erro ao carregar dados.", "danger");
      setPrescricao(null);
      setMinistracoes([]);
    } finally {
      setLoading(false);
    }
  }, [prescricaoId, exibirToast]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const exportarCsv = async () => {
    if (ministracoes.length === 0) {
      exibirToast("Nenhuma ministração para exportar.", "warning");
      return;
    }

    setExportando(true);
    try {
      const url = `${API_URL}/ministracoes/relatorio.csv?prescricao_id=${encodeURIComponent(prescricaoId)}`;
      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        exibirToast(`Erro ao exportar (${response.status}).`, "danger");
        return;
      }

      const disposition = response.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/i);
      const fallback = `ministracoes_${new Date().toISOString().slice(0, 10)}.csv`;
      const filename = match ? match[1] : fallback;

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      exibirToast("Erro ao exportar CSV.", "danger");
    } finally {
      setExportando(false);
    }
  };

  return (
    <>
      <Header />

      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-0 fw-semibold">Ministrações</h5>
              <div className="text-secondary small">
                Prescrição #{prescricaoId}
                {prescricao?.animal_nome ? ` - ${prescricao.animal_nome}` : ""}
                {prescricao?.medicamento_nome ? ` - ${prescricao.medicamento_nome}` : ""}
              </div>
            </div>

            <div className="d-flex gap-2">
              <Link
                to="/prescricoes"
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
              >
                <i className="bi bi-arrow-left"></i> Voltar
              </Link>
              <Button
                variant="outline-primary"
                onClick={exportarCsv}
                disabled={exportando}
                className="d-flex align-items-center gap-2"
                aria-label="Exportar CSV"
              >
                <i className="bi bi-download"></i>
                {exportando ? "Exportando..." : "Exportar CSV"}
              </Button>
              <Link
                to={`/prescricoes/${prescricaoId}/ministracoes/nova`}
                className="btn btn-success d-flex align-items-center gap-2"
                aria-disabled={prescricao?.status !== "ATIVA"}
                tabIndex={prescricao?.status !== "ATIVA" ? -1 : 0}
                onClick={(event) => {
                  if (prescricao?.status !== "ATIVA") {
                    event.preventDefault();
                    exibirToast("A prescrição precisa estar ativa para nova ministração.", "danger");
                  }
                }}
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
                      <th className="fw-semibold">Data/Hora</th>
                      <th className="fw-semibold">Quantidade</th>
                      <th className="fw-semibold text-start">Responsável</th>
                      <th className="fw-semibold text-start">Observação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ministracoes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-5 text-secondary">
                          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                          Nenhuma ministração registrada
                        </td>
                      </tr>
                    ) : (
                      ministracoes.map((ministracao) => (
                        <tr key={ministracao.id}>
                          <td className="align-middle">{formatarData(ministracao.data_hora)}</td>
                          <td className="align-middle">{ministracao.quantidade_aplicada}</td>
                          <td className="align-middle text-start">{ministracao.responsavel_nome}</td>
                          <td className="align-middle text-start">{ministracao.observacao || "-"}</td>
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
    </>
  );
}

export default ListaDeMinistracoes;
