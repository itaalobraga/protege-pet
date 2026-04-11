import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Form, Row, Col, Spinner } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Header from "../../components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function CadastroDeAtendimentos() {
  const navigate = useNavigate();
  
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
    async function carregarDependencias() {
      try {
        const [resAnimais, resVeterinarios, resDiagnosticos, resExames] = await Promise.all([
          ApiService.get("/animais"),
          ApiService.get("/veterinarios"),
          ApiService.get("/diagnosticos"),
          ApiService.get("/tipos-de-exames")
        ]);
        
        setAnimais(resAnimais || []);
        setVeterinarios(resVeterinarios || []);
        setDiagnosticos(resDiagnosticos || []);
        setTiposExames(resExames || []);

        const agora = new Date();
        agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
        setDataAtendimento(agora.toISOString().slice(0, 16));

      } catch (error) {
        exibirToast("Erro ao carregar dados do sistema. Tente recarregar a página.", "danger");
      } finally {
        setLoadingDados(false);
      }
    }
    carregarDependencias();
  }, [exibirToast]);

  const handleExameChange = (id) => {
    setExamesSelecionados(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
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
        exames: examesSelecionados
      };

      await ApiService.post("/atendimentos", payload);
      exibirToast("Atendimento registrado com sucesso!", "success");
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
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
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
              <h3 className="fw-bold mb-2">Realizar Atendimento Clínico</h3>
              <p className="text-muted mb-4">Registre a consulta, peso, diagnóstico e solicite exames.</p>
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Paciente (Animal) <span className="text-danger">*</span></Form.Label>
                      <Form.Select value={animalId} onChange={(e) => setAnimalId(e.target.value)} required>
                        <option value="">Selecione o animal...</option>
                        {animais.map(a => <option key={a.id} value={a.id}>{a.nome} ({a.especie})</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Veterinário Responsável <span className="text-danger">*</span></Form.Label>
                      <Form.Select value={veterinarioId} onChange={(e) => setVeterinarioId(e.target.value)} required>
                        <option value="">Selecione o veterinário...</option>
                        {veterinarios.map(v => <option key={v.id} value={v.id}>Dr(a). {v.nome}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Data e Hora <span className="text-danger">*</span></Form.Label>
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
                      <Form.Label>Peso do Animal (kg)</Form.Label>
                      <Form.Control 
                        type="number" 
                        step="0.01" 
                        placeholder="Ex: 4.5" 
                        value={peso} 
                        onChange={(e) => setPeso(e.target.value)} 
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Diagnóstico Clínico</Form.Label>
                      <Form.Select value={diagnosticoId} onChange={(e) => setDiagnosticoId(e.target.value)}>
                        <option value="">(Nenhum / Em investigação)</option>
                        {diagnosticos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label>Exames Solicitados</Form.Label>
                      <div className="d-flex flex-wrap gap-3 p-3 bg-light rounded border">
                        {tiposExames.length === 0 ? <span className="text-muted small">Nenhum exame cadastrado.</span> : 
                          tiposExames.map(exame => (
                            <Form.Check 
                              key={exame.id}
                              type="checkbox"
                              id={`exame-${exame.id}`}
                              label={exame.nome}
                              checked={examesSelecionados.includes(exame.id)}
                              onChange={() => handleExameChange(exame.id)}
                            />
                          ))
                        }
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label>Observações / Prontuário</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Relate os sintomas, conduta médica, etc..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex gap-2">
                  <Button type="submit" variant="success" disabled={loading}>
                    <i className="bi bi-check-lg me-1"></i> {loading ? "Salvando..." : "Registrar Atendimento"}
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
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={4000} autohide className="border-0 shadow">
          <Toast.Body className={`d-flex align-items-center gap-2 text-${toastVariant}`}>
            <i className={`bi bi-${toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default CadastroDeAtendimentos;