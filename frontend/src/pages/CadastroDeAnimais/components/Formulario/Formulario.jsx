import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ApiService from "../../../../services/ApiService";

const ESPECIES = ["Canina", "Felina", "Ave", "Outro"];
const SEXOS = ["Macho", "Fêmea"];
const PORTES = ["Pequeno", "Médio", "Grande"];
const STATUS_OPTIONS = ["Apto", "Em tratamento", "Adotado", "Em observação"];

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca_id: "", 
    pelagem: "",
    sexo: "",
    data_nascimento: "",
    data_ocorrencia: "",
    local_resgate: "",
    porte: "",
    peso: "",
    status: "Apto",
  });

  const [listaRacas, setListaRacas] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    ApiService.get("/racas")
      .then((response) => {
        setListaRacas(response || []);
      })
      .catch((error) => console.error("Erro ao carregar raças:", error));
  }, []);

  useEffect(() => {
    if (isEdit) {
      ApiService.get(`/animais/${id}`).then((response) => {
        const dados = Array.isArray(response) ? response[0] : response;
        if (dados) {
          setFormData({
            nome: dados.nome || "",
            especie: dados.especie || "", 
            raca_id: dados.raca_id || "", 
            pelagem: dados.pelagem || "",
            sexo: dados.sexo || "",
            data_nascimento: dados.data_nascimento
              ? dados.data_nascimento.split("T")[0]
              : "",
            data_ocorrencia: dados.data_ocorrencia
              ? dados.data_ocorrencia.split("T")[0]
              : "",
            local_resgate: dados.local_resgate || "",
            porte: dados.porte || "",
            peso: dados.peso || "",
            status: dados.status || "Apto",
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "especie") {
      setFormData({ ...formData, [name]: value, raca_id: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const racasFiltradas = listaRacas.filter(r => 
    r.especie?.toUpperCase() === formData.especie?.toUpperCase()
  );

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome || formData.nome.length < 2) {
      novosErros.nome = "Nome deve ter pelo menos 2 caracteres";
    }
    if (!formData.especie) {
      novosErros.especie = "Selecione uma espécie";
    }
    if (!formData.sexo) {
      novosErros.sexo = "Selecione o sexo";
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const exibirToast = (mensagem, variante = "success") => {
    setToastMessage(mensagem);
    setToastVariant(variante);
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const payload = { ...formData };

      try {
        if (isEdit) {
          await ApiService.put(`/animais/${id}`, payload);
          exibirToast("Animal atualizado com sucesso!");
        } else {
          await ApiService.post("/animais", payload);
          exibirToast("Animal cadastrado com sucesso!");
        }
        setTimeout(() => navigate("/animais"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar animal", "danger");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Animal" : "Novo Animal"}
        </h5>
        <Link
          to="/animais"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          aria-label="Voltar para lista"
        >
          <i className="bi bi-arrow-left"></i> Voltar
        </Link>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <h6 className="fw-semibold text-secondary mb-3">Dados da Ocorrência</h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Data da Ocorrência</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_ocorrencia"
                    value={formData.data_ocorrencia}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Local do Resgate</Form.Label>
                  <Form.Control
                    type="text"
                    name="local_resgate"
                    value={formData.local_resgate}
                    onChange={handleChange}
                    placeholder="Endereço ou referência do local"
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <h6 className="fw-semibold text-secondary mb-3">Dados do Animal</h6>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nome *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do animal"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Espécie *</Form.Label>
                  <Form.Select
                    name="especie"
                    value={formData.especie}
                    onChange={handleChange}
                    isInvalid={!!errors.especie}
                    className={!formData.especie ? "placeholder-active" : ""}
                  >
                    <option value="">Selecione</option>
                    {ESPECIES.map((esp) => (
                      <option key={esp} value={esp.toUpperCase()}>
                        {esp}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.especie}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Raça</Form.Label>
                  <Form.Select
                    name="raca_id" 
                    value={formData.raca_id}
                    onChange={handleChange}
                    isInvalid={!!errors.raca_id}
                    disabled={!formData.especie} 
                  >
                    <option value="">
                      {!formData.especie 
                        ? "Selecione a espécie primeiro" 
                        : racasFiltradas.length === 0 
                          ? "Nenhuma raça encontrada" 
                          : "Selecione a raça"}
                    </option>
                    {racasFiltradas.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nome}
                      </option>
                    ))}
                  </Form.Select>
                  {formData.especie && racasFiltradas.length === 0 && (
                    <Form.Text className="text-muted">
                       Não encontrou? <Link to="/racas/cadastro">Cadastre aqui</Link>.
                    </Form.Text>
                  )}
                   <Form.Control.Feedback type="invalid">
                    {errors.raca_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Sexo *</Form.Label>
                  <Form.Select
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    isInvalid={!!errors.sexo}
                    className={!formData.sexo ? "placeholder-active" : ""}
                  >
                    <option value="">Selecione</option>
                    {SEXOS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.sexo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Pelagem</Form.Label>
                  <Form.Control
                    type="text"
                    name="pelagem"
                    value={formData.pelagem}
                    onChange={handleChange}
                    placeholder="Ex: Dourada, Curta"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Data de Nascimento</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Porte</Form.Label>
                  <Form.Select
                    name="porte"
                    value={formData.porte}
                    onChange={handleChange}
                    className={!formData.porte ? "placeholder-active" : ""}
                  >
                    <option value="">Selecione</option>
                    {PORTES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Peso</Form.Label>
                  <Form.Control
                    type="text"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    placeholder="Ex: 15kg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="success">
                <i className="bi bi-check-lg me-1"></i>
                {isEdit ? "Salvar" : "Cadastrar"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className="border-0 shadow"
        >
          <Toast.Body className={`d-flex align-items-center gap-2 text-${toastVariant}`}>
            <i className={`bi bi-${toastVariant === "success" ? "check-circle-fill" : "exclamation-circle-fill"}`}></i>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Formulario;