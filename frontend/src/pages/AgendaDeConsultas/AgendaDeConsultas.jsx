import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { format, isValid, parse } from "date-fns";
import Header from "src/components/Header/Header.jsx";
import ApiService from "src/services/ApiService.js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function parseMysqlDateTime(mysqlDateTime) {
  const dt = parse(String(mysqlDateTime ?? ""), "yyyy-MM-dd HH:mm:ss", new Date(0));
  return isValid(dt) ? dt : null;
}


function toDatetimeLocalFromMysql(mysqlDateTime) {
  const dt = parseMysqlDateTime(mysqlDateTime);
  if (!dt) return "";
  return format(dt, "yyyy-MM-dd'T'HH:mm");
}

function formatarDataBR(mysqlDateTime) {
  const dt = parseMysqlDateTime(mysqlDateTime);
  if (!dt) return String(mysqlDateTime ?? "");
  return format(dt, "dd/MM/yyyy HH:mm");
}

function AgendaDeConsultas() {
  const [modo, setModo] = useState("tabela");

  const [consultas, setConsultas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [animais, setAnimais] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingVeterinarios, setLoadingVeterinarios] = useState(false);
  const [loadingAnimais, setLoadingAnimais] = useState(false);

  const [filtros, setFiltros] = useState({
    inicio: "",
    fim: "",
    veterinario_id: "",
    animal_id: "",
  });

  const navigate = useNavigate();

  const [showModalExcluir, setShowModalExcluir] = useState(false);
  const [detalhesExcluir, setDetalhesExcluir] = useState(null);
  const [loadingDetalhesExcluir, setLoadingDetalhesExcluir] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const carregarVeterinarios = useCallback(async () => {
    setLoadingVeterinarios(true);
    try {
      const resp = await ApiService.get("/veterinarios");
      setVeterinarios(resp || []);
    } finally {
      setLoadingVeterinarios(false);
    }
  }, []);

  const carregarAnimais = useCallback(async () => {
    setLoadingAnimais(true);
    try {
      const resp = await ApiService.get("/animais");
      setAnimais(resp || []);
    } finally {
      setLoadingAnimais(false);
    }
  }, []);

  const carregarConsultas = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.veterinario_id) params.set("veterinario_id", filtros.veterinario_id);
      if (filtros.animal_id) params.set("animal_id", filtros.animal_id);
      if (filtros.inicio) params.set("inicio", `${filtros.inicio} 00:00:00`);
      if (filtros.fim) params.set("fim", `${filtros.fim} 23:59:59`);
      const endpoint = `/consultas-veterinarias${params.toString() ? `?${params.toString()}` : ""}`;
      const resp = await ApiService.get(endpoint);
      setConsultas(resp || []);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregarVeterinarios();
    carregarAnimais();
  }, [carregarVeterinarios, carregarAnimais]);

  useEffect(() => {
    carregarConsultas();
  }, [carregarConsultas]);

  const eventosCalendario = useMemo(() => {
    return (consultas || [])
      .filter((c) => c && c.data_consulta)
      .map((c) => {
        const start = toDatetimeLocalFromMysql(c.data_consulta);
        const title = `${c.veterinario_nome ?? ""} • ${c.animal_nome ?? ""}`.trim();
        return {
          id: String(c.id),
          title: title || "Consulta",
          start,
          extendedProps: c,
        };
      });
  }, [consultas]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const abrirModalExcluir = async (consultaId) => {
    setIdParaExcluir(consultaId);
    setShowModalExcluir(true);
    setDetalhesExcluir(null);
    setLoadingDetalhesExcluir(true);
    try {
      const detalhes = await ApiService.get(`/consultas-veterinarias/${consultaId}`);
      setDetalhesExcluir(detalhes || null);
    } catch {
      setDetalhesExcluir(null);
    } finally {
      setLoadingDetalhesExcluir(false);
    }
  };

  const fecharModalExcluir = () => {
    setShowModalExcluir(false);
    setIdParaExcluir(null);
    setDetalhesExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!idParaExcluir) return;
    await ApiService.delete(`/consultas-veterinarias/${idParaExcluir}`);
    fecharModalExcluir();
    await carregarConsultas();
  };

  const onDateClick = () => {
    navigate("/consultas/novo");
  };

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-1 fw-semibold">Agenda de Consultas</h5>
              <div className="text-secondary small">
                {modo === "tabela" ? "Visualização em tabela" : "Visualização em calendário"}
              </div>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <Form.Select
                value={modo}
                onChange={(e) => setModo(e.target.value)}
                style={{ width: 170 }}
                aria-label="Modo de visualização"
              >
                <option value="tabela">Tabela</option>
                <option value="calendario">Calendário</option>
              </Form.Select>

              <Link to="/consultas/novo" className="btn btn-success">
                <i className="bi bi-plus-lg me-1"></i> Agendar
              </Link>
            </div>
          </div>

          {modo === "tabela" ? (
            <>
              <Card className="border-0 shadow-sm mb-3">
                <Card.Body className="p-3">
                  <Row className="g-2 align-items-end">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Início</Form.Label>
                        <Form.Control
                          type="date"
                          name="inicio"
                          value={filtros.inicio}
                          onChange={handleFiltroChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Fim</Form.Label>
                        <Form.Control
                          type="date"
                          name="fim"
                          value={filtros.fim}
                          onChange={handleFiltroChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Veterinário</Form.Label>
                        <Form.Select
                          name="veterinario_id"
                          value={filtros.veterinario_id}
                          onChange={handleFiltroChange}
                          disabled={loadingVeterinarios}
                        >
                          <option value="">Todos</option>
                          {veterinarios.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.nome} {v.sobrenome}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Animal</Form.Label>
                        <Form.Select
                          name="animal_id"
                          value={filtros.animal_id}
                          onChange={handleFiltroChange}
                          disabled={loadingAnimais}
                        >
                          <option value="">Todos</option>
                          {animais.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.nome}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

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
                          <th className="fw-semibold">Veterinário</th>
                          <th className="fw-semibold">Animal</th>
                          <th className="fw-semibold">Observação</th>
                          <th className="fw-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consultas.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-5 text-secondary">
                              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                              Nenhuma consulta encontrada
                            </td>
                          </tr>
                        ) : (
                          consultas.map((c) => (
                            <tr key={c.id}>
                              <td className="align-middle">{formatarDataBR(c.data_consulta)}</td>
                              <td className="align-middle">{c.veterinario_nome ?? "-"}</td>
                              <td className="align-middle">{c.animal_nome ?? "-"}</td>
                              <td className="align-middle">{c.observacao || "-"}</td>
                              <td className="align-middle">
                                <div className="d-flex gap-2 justify-content-center">
                                  <Link
                                    to={`/consultas/editar/${c.id}`}
                                    className="btn btn-outline-primary btn-sm"
                                  >
                                    Editar
                                  </Link>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => abrirModalExcluir(c.id)}
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
            </>
          ) : (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  height="75vh"
                  events={eventosCalendario}
                  dateClick={onDateClick}
                  selectable
                />
              </Card.Body>
            </Card>
          )}

          <Modal show={showModalExcluir} onHide={fecharModalExcluir} centered>
            <Modal.Body className="text-center py-4">
              <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3 d-block"></i>
              <h5 className="fw-semibold mb-2">Confirmar Exclusão</h5>
              {loadingDetalhesExcluir ? (
                <p className="text-secondary mb-4">Carregando detalhes...</p>
              ) : detalhesExcluir ? (
                <p className="text-secondary mb-4">
                  Deseja realmente excluir a consulta de{" "}
                  <span className="fw-semibold">
                    {detalhesExcluir.animal_nome || "-"}
                  </span>{" "}
                  com{" "}
                  <span className="fw-semibold">
                    {detalhesExcluir.veterinario_nome
                      ? `${detalhesExcluir.veterinario_nome} ${detalhesExcluir.veterinario_sobrenome || ""}`
                      : "-"}
                  </span>{" "}
                  em{" "}
                  <span className="fw-semibold">
                    {formatarDataBR(detalhesExcluir.data_consulta)}
                  </span>
                  ?
                </p>
              ) : (
                <p className="text-secondary mb-4">
                  Deseja realmente excluir esta consulta?
                </p>
              )}
              <div className="d-flex justify-content-center gap-2">
                <Button variant="outline-secondary" onClick={fecharModalExcluir}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={confirmarExclusao}>
                  <i className="bi bi-trash me-1"></i> Excluir
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Container>
      </main>
    </>
  );
}

export default AgendaDeConsultas;
