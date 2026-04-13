import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container, Form, Row, Col, Spinner } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { format, isValid, parse } from "date-fns";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function formatarDataParaDatetimeLocal(valor) {
  if (!valor) return "";
  const s = String(valor).replace(" ", "T");
  if (s.length >= 16) return s.slice(0, 16);
  return s;
}

function toMysqlDateTimeFromDatetimeLocal(datetimeLocal) {
  const dt = parse(String(datetimeLocal ?? ""), "yyyy-MM-dd'T'HH:mm", new Date(0));
  if (!isValid(dt)) return null;
  return format(dt, "yyyy-MM-dd HH:mm:ss");
}

function formatarDataConsultaOpcao(mysql) {
  if (!mysql) return "";
  const dt = parse(String(mysql).replace(" ", "T"), "yyyy-MM-dd'T'HH:mm:ss", new Date(0));
  if (!isValid(dt)) return String(mysql);
  return format(dt, "dd/MM/yyyy HH:mm");
}

function CadastroDeAtendimentos() {
  const navigate = useNavigate();
  const { id: atendimentoId } = useParams();
  const isEdit = useMemo(
    () => Boolean(atendimentoId && String(atendimentoId).trim() !== ""),
    [atendimentoId],
  );

  const [animais, setAnimais] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [tiposExames, setTiposExames] = useState([]);
  const [consultasSemAtendimento, setConsultasSemAtendimento] = useState([]);
  const [loadingDados, setLoadingDados] = useState(true);

  const [modoConsulta, setModoConsulta] = useState("existente");
  const [consultaId, setConsultaId] = useState("");
  const [observacaoAgenda, setObservacaoAgenda] = useState("");

  const [animalId, setAnimalId] = useState("");
  const [veterinarioId, setVeterinarioId] = useState("");
  const [diagnosticoId, setDiagnosticoId] = useState("");
  const [peso, setPeso] = useState("");
  const [dataAtendimento, setDataAtendimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [examesSelecionados, setExamesSelecionados] = useState([]);
  const [consultaIdVinculoEdicao, setConsultaIdVinculoEdicao] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const exibirToast = useCallback((mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setLoadingDados(true);
      try {
        const reqs = [
          ApiService.get("/animais"),
          ApiService.get("/veterinarios"),
          ApiService.get("/diagnosticos"),
          ApiService.get("/tipos-de-exames"),
        ];
        if (!isEdit) {
          reqs.push(ApiService.get("/atendimentos/consultas-sem-atendimento"));
        }

        const results = await Promise.all(reqs);
        if (cancelado) return;

        setAnimais(results[0] || []);
        setVeterinarios(results[1] || []);
        setDiagnosticos(results[2] || []);
        setTiposExames(results[3] || []);
        if (!isEdit) {
          setConsultasSemAtendimento(results[4] || []);
        }

        if (isEdit && atendimentoId) {
          const at = await ApiService.get(`/atendimentos/${atendimentoId}`);
          if (cancelado) return;
          setConsultaIdVinculoEdicao(at.consulta_id ?? null);
          setAnimalId(String(at.animal_id ?? ""));
          setVeterinarioId(String(at.veterinario_id ?? ""));
          setDiagnosticoId(
            at.diagnostico_id != null ? String(at.diagnostico_id) : "",
          );
          setPeso(
            at.peso != null && at.peso !== "" ? String(at.peso) : "",
          );
          setObservacoes(at.observacoes || "");
          setDataAtendimento(
            formatarDataParaDatetimeLocal(at.data_atendimento) ||
              (() => {
                const agora = new Date();
                agora.setMinutes(
                  agora.getMinutes() - agora.getTimezoneOffset(),
                );
                return agora.toISOString().slice(0, 16);
              })(),
          );
          setExamesSelecionados(
            (at.exames || []).map((e) => Number(e.id)).filter(Boolean),
          );
        } else {
          const agora = new Date();
          agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
          setDataAtendimento(agora.toISOString().slice(0, 16));
        }
      } catch (error) {
        console.error(error);
        if (!cancelado) {
          exibirToast(
            isEdit
              ? "Erro ao carregar o atendimento. Redirecionando…"
              : "Erro ao carregar dados do sistema. Tente recarregar a página.",
            "danger",
          );
          if (isEdit) {
            setTimeout(() => navigate("/atendimentos"), 2000);
          }
        }
      } finally {
        if (!cancelado) setLoadingDados(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [atendimentoId, isEdit, exibirToast, navigate]);

  const handleExameChange = (id) => {
    const numId = Number(id);
    setExamesSelecionados((prev) =>
      prev.includes(numId)
        ? prev.filter((e) => e !== numId)
        : [...prev, numId],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEdit) {
      if (modoConsulta === "existente") {
        if (!consultaId) {
          exibirToast("Selecione uma consulta da agenda ou crie uma nova.", "danger");
          return;
        }
      } else if (!animalId || !veterinarioId) {
        exibirToast("Animal e veterinário são obrigatórios para agendar.", "danger");
        return;
      }
    } else if (!animalId || !veterinarioId) {
      exibirToast("Animal e veterinário são obrigatórios.", "danger");
      return;
    }

    if (!isEdit && modoConsulta === "nova") {
      const dataMysql = toMysqlDateTimeFromDatetimeLocal(dataAtendimento);
      if (!dataMysql) {
        exibirToast("Informe uma data e hora válidas para a consulta.", "danger");
        return;
      }
    }

    if (isEdit) {
      if (!dataAtendimento) {
        exibirToast("Informe a data e hora da consulta.", "danger");
        return;
      }
    }

    setLoading(true);
    try {
      const exames = examesSelecionados;
      const baseClinico = {
        diagnostico_id: diagnosticoId || null,
        peso: peso ? parseFloat(peso) : null,
        observacoes,
        exames,
      };

      if (isEdit) {
        const payload = {
          animal_id: Number(animalId),
          veterinario_id: Number(veterinarioId),
          data_atendimento: toMysqlDateTimeFromDatetimeLocal(dataAtendimento),
          ...baseClinico,
        };
        if (!payload.data_atendimento) {
          exibirToast("Data e hora inválidas.", "danger");
          setLoading(false);
          return;
        }
        await ApiService.put(`/atendimentos/${atendimentoId}`, payload);
        exibirToast("Atendimento atualizado com sucesso!", "success");
      } else if (modoConsulta === "existente") {
        await ApiService.post("/atendimentos", {
          consulta_id: Number(consultaId),
          ...baseClinico,
        });
        exibirToast("Atendimento registrado com sucesso!", "success");
      } else {
        const dataMysql = toMysqlDateTimeFromDatetimeLocal(dataAtendimento);
        await ApiService.post("/atendimentos", {
          animal_id: Number(animalId),
          veterinario_id: Number(veterinarioId),
          data_consulta: dataMysql,
          observacao_agenda: observacaoAgenda.trim() || null,
          ...baseClinico,
        });
        exibirToast("Atendimento registrado com sucesso!", "success");
      }
      setTimeout(() => navigate("/atendimentos"), 1500);
    } catch (error) {
      exibirToast(error.message || "Erro ao salvar o atendimento.", "danger");
    } finally {
      setLoading(false);
    }
  };

  if (loadingDados) {
    return (
      <>
        <Header />
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <Spinner animation="border" variant="success" />
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h3 className="fw-bold mb-2">
                {isEdit ? "Editar atendimento" : "Realizar atendimento clínico"}
              </h3>
              <p className="text-muted mb-4">
                {isEdit
                  ? "Altere data da consulta na agenda, peso, diagnóstico e exames. As observações abaixo são do prontuário clínico."
                  : "Vincule o atendimento a uma consulta já agendada ou crie o agendamento aqui (sem enviar e-mail ao veterinário). Em seguida registre peso, diagnóstico e exames."}
              </p>

              <Form onSubmit={handleSubmit}>
                {!isEdit && (
                  <Row className="mb-4">
                    <Col md={12}>
                      <Form.Label className="fw-semibold d-block mb-2">
                        Consulta na agenda
                      </Form.Label>
                      <div className="d-flex flex-wrap gap-4">
                        <Form.Check
                          type="radio"
                          id="modo-consulta-existente"
                          name="modoConsulta"
                          label="Usar consulta já cadastrada"
                          checked={modoConsulta === "existente"}
                          onChange={() => setModoConsulta("existente")}
                        />
                        <Form.Check
                          type="radio"
                          id="modo-consulta-nova"
                          name="modoConsulta"
                          label="Criar nova consulta (sem notificação por e-mail)"
                          checked={modoConsulta === "nova"}
                          onChange={() => setModoConsulta("nova")}
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Ao criar nova consulta por este fluxo, o sistema não envia e-mail de agendamento.
                      </Form.Text>
                    </Col>
                  </Row>
                )}

                {isEdit && consultaIdVinculoEdicao != null && (
                  <Row className="mb-3">
                    <Col>
                      <div className="small text-muted">
                        Vinculado à consulta da agenda{" "}
                        <span className="fw-semibold">#{consultaIdVinculoEdicao}</span>
                      </div>
                    </Col>
                  </Row>
                )}

                {!isEdit && modoConsulta === "existente" && (
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          Selecione a consulta <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={consultaId}
                          onChange={(e) => setConsultaId(e.target.value)}
                          required={modoConsulta === "existente"}
                        >
                          <option value="">Escolha um horário agendado sem atendimento…</option>
                          {consultasSemAtendimento.map((c) => (
                            <option key={c.id} value={c.id}>
                              #{c.id} — {c.animal_nome} — Dr(a). {c.veterinario_nome}{" "}
                              {c.veterinario_sobrenome || ""} —{" "}
                              {formatarDataConsultaOpcao(c.data_consulta)}
                            </option>
                          ))}
                        </Form.Select>
                        {consultasSemAtendimento.length === 0 && (
                          <Form.Text className="text-warning">
                            Não há consultas livres. Use &quot;Criar nova consulta&quot; ou cadastre
                            um horário na agenda de consultas.
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {(isEdit || modoConsulta === "nova") && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Paciente (animal) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={animalId}
                          onChange={(e) => setAnimalId(e.target.value)}
                          required
                        >
                          <option value="">Selecione o animal…</option>
                          {animais.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.nome} ({a.especie})
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Veterinário responsável{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          value={veterinarioId}
                          onChange={(e) => setVeterinarioId(e.target.value)}
                          required
                        >
                          <option value="">Selecione o veterinário…</option>
                          {veterinarios.map((v) => (
                            <option key={v.id} value={v.id}>
                              Dr(a). {v.nome}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Data e hora da consulta{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={dataAtendimento}
                          onChange={(e) => setDataAtendimento(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>

                    {!isEdit && modoConsulta === "nova" && (
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Observação da agenda (opcional)</Form.Label>
                          <Form.Control
                            value={observacaoAgenda}
                            onChange={(e) => setObservacaoAgenda(e.target.value)}
                            placeholder="Ex.: retorno, jejum, etc."
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                )}

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Peso do animal (kg)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        placeholder="Ex.: 4.5"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Diagnóstico clínico</Form.Label>
                      <Form.Select
                        value={diagnosticoId}
                        onChange={(e) => setDiagnosticoId(e.target.value)}
                      >
                        <option value="">(Nenhum / em investigação)</option>
                        {diagnosticos.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.nome}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label>Exames solicitados</Form.Label>
                      <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded border">
                        {tiposExames.length === 0 ? (
                          <span className="text-muted small">
                            Nenhum exame cadastrado.
                          </span>
                        ) : (
                          tiposExames.map((exame) => (
                            <Form.Check
                              key={exame.id}
                              type="checkbox"
                              id={`exame-${exame.id}`}
                              label={exame.nome}
                              checked={examesSelecionados.includes(Number(exame.id))}
                              onChange={() => handleExameChange(exame.id)}
                            />
                          ))
                        )}
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label>Observações / prontuário</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Relate os sintomas, conduta médica, etc."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="success" disabled={loading}>
                    <i className="bi bi-check-lg me-1"></i>
                    {loading
                      ? "Salvando…"
                      : isEdit
                        ? "Salvar alterações"
                        : "Registrar atendimento"}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/atendimentos")}>
                    Cancelar
                  </Button>
                </div>
              </Form>
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

export default CadastroDeAtendimentos;
