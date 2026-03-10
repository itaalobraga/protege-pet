import { useCallback, useEffect, useState } from "react";
import { Card, Container, Form, Table, Row, Col } from "react-bootstrap";
import Header from "../../components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function ListaDeMovimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  }, []);

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

    if (mapaMotivos[motivo]) {
      return mapaMotivos[motivo];
    }

    return motivo
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  };

  const movimentacoesFiltradas = movimentacoes.filter((movimentacao) => {
    if (!tipoFiltro) return true;
    return movimentacao.tipo === tipoFiltro;
  });

  return (
    <>
      <Header />

      <Container className="py-4">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h4 className="fw-bold mb-4">Histórico de Movimentações de Estoque</h4>

            <Row className="mb-4">
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Buscar por produto, SKU, tipo ou motivo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>

              <Col md={4}>
                <Form.Select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                >
                  <option value="">Todos os tipos</option>
                  <option value="ENTRADA">Somente entradas</option>
                  <option value="SAIDA">Somente saídas</option>
                </Form.Select>
              </Col>
            </Row>

            {loading ? (
              <p className="mb-0">Carregando...</p>
            ) : movimentacoesFiltradas.length === 0 ? (
              <p className="mb-0">
                {search || tipoFiltro
                  ? "Nenhuma movimentação encontrada."
                  : "Nenhuma movimentação registrada."}
              </p>
            ) : (
              <Table responsive hover bordered>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Produto</th>
                    <th>SKU</th>
                    <th>Tipo</th>
                    <th>Quantidade</th>
                    <th>Motivo</th>
                    <th>Responsável</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {movimentacoesFiltradas.map((movimentacao) => (
                    <tr key={movimentacao.id}>
                      <td>{formatarData(movimentacao.created_at)}</td>
                      <td>{movimentacao.produto_nome}</td>
                      <td>{movimentacao.produto_sku}</td>
                      <td>{formatarTipo(movimentacao.tipo)}</td>
                      <td>{movimentacao.quantidade}</td>
                      <td>{formatarMotivo(movimentacao.motivo)}</td>
                      <td>{movimentacao.responsavel || "-"}</td>
                      <td>{movimentacao.observacao || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default ListaDeMovimentacoes;