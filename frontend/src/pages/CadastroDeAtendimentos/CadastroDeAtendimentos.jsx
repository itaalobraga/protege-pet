import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container, Form, Row, Col, Spinner } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function formatarDataParaDatetimeLocal(valor) {
  if (!valor) return "";
  const s = String(valor).replace(" ", "T");
  if (s.length >= 16) return s.slice(0, 16);
  return s;
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
  const [loadingDados, setLoadingDados] = useState(true);

  const [animalId, setAnimalId] = useState("");
  const [veterinarioId, setVeterinarioId] = useState("");
  const [diagnosticoId, setDiagnosticoId] = useState("");
  const [peso, setPeso] = useState("");
  const [dataAtendimento, setDataAtendimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [examesSelecionados, setExamesSelecionados] = useState([]);

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
        const [resAnimais, resVeterinarios, resDiagnosticos, resExames] =
          await Promise.all([
            ApiService.get("/animais"),
            ApiService.get("/veterinarios"),
            ApiService.get("/diagnosticos"),
            ApiService.get("/tipos-de-exames"),
          ]);

        if (cancelado) return;

        setAnimais(resAnimais || []);
        setVeterinarios(resVeterinarios || []);
        setDiagnosticos(resDiagnosticos || []);
        setTiposExames(resExames || []);

        if (isEdit && atendimentoId) {
          const at = await ApiService.get(`/atendimentos/${atendimentoId}`);
          if (cancelado) return;
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
    if (!animalId || !veterinarioId) {
      exibirToast("Animal e Veterinário são obrigatórios.", "danger");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        animal_id: animalId,
        veterinario_id: veterinarioId,
        diagnostico_id: diagnosticoId || null,
        peso: peso ? parseFloat(peso) : null,
        data_atendimento: dataAtendimento.replace("T", " ") + ":00",
        observacoes,
        exames: examesSelecionados,
      };

      if (isEdit) {
        await ApiService.put(`/atendimentos/${atendimentoId}`, payload);
        exibirToast("Atendimento atualizado com sucesso!", "success");
      } else {
        await ApiService.post("/atendimentos", payload);
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
                  ? "Altere os dados da consulta, peso, diagnóstico e exames solicitados."
                  : "Registre a consulta, peso, diagnóstico e solicite exames."}
              </p>

              <Form onSubmit={handleSubmit}>
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

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Data e hora <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={dataAtendimento}
                        onChange={(e) => setDataAtendimento(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>

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
