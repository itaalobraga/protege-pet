import { useState, useEffect } from "react";
import { Form, Button, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../../../services/ApiService";

function Formulario() {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("CANINA");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const navigate = useNavigate();
  const { id } = useParams(); 
  useEffect(() => {
    if (id) {
      const carregarDados = async () => {
        setLoading(true);
        try {
          const response = await ApiService.get(`/racas/${id}`); 
          const dados = Array.isArray(response) ? response[0] : response;
          
          if (dados) {
            setNome(dados.nome);
            setEspecie(dados.especie);
          }
        } catch (error) {
          exibirToast("Erro ao carregar dados da raça", "danger");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      carregarDados();
    }
  }, [id]);

  const exibirToast = (msg, variant) => {
    setToastMessage(msg);
    setToastVariant(variant);
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dados = { nome, especie };

    try {
      if (id) {
        await ApiService.put(`/racas/${id}`, dados);
        exibirToast("Raça atualizada com sucesso!", "success");
      } else {
        await ApiService.post("/racas", dados);
        exibirToast("Raça cadastrada com sucesso!", "success");
      }
      setTimeout(() => {
        navigate("/lista-racas");
      }, 1500);

    } catch (error) {
      exibirToast(error.response?.data?.error || "Erro ao salvar raça", "danger");
      setLoading(false); 
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">Nome da Raça</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ex: Labrador, Persa, Calopsita..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">Espécie</Form.Label>
          <Form.Select
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
            disabled={loading}
          >
            <option value="CANINA">Canina</option>
            <option value="FELINA">Felina</option>
            <option value="AVE">Ave</option>
            <option value="OUTRO">Outro</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </Button>
          
          <Button 
            variant="outline-secondary" 
            type="button" 
            onClick={() => navigate("/lista-racas")}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </Form>
      <ToastContainer position="bottom-center" className="mb-4">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="white" className="shadow border-0">
          <Toast.Body className={`text-${toastVariant} d-flex align-items-center gap-2`}>
            <i className={`bi bi-${toastVariant === 'success' ? 'check-circle' : 'exclamation-circle'}-fill`}></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Formulario;