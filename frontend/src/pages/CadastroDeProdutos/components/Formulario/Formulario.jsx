import { useEffect, useState } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Modal from "react-bootstrap/Modal";
import ApiService from "../../../../services/ApiService";

function Formulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nome: "",
    sku: "",
    quantidade: "",
    categoria: "",
    descricao: "",
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");


  const [categorias, setCategorias] = useState([]);


  const [showNovaCategoriaModal, setShowNovaCategoriaModal] = useState(false);
  const [showGerenciarCategoriasModal, setShowGerenciarCategoriasModal] =
    useState(false);

 
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");

  
  const [editingCategoriaId, setEditingCategoriaId] = useState(null);
  const [editingCategoriaNome, setEditingCategoriaNome] = useState("");

  
  useEffect(() => {
    if (isEdit) {
      ApiService.get(`/produtos/${id}`).then((response) => {
        if (response) {
          setFormData({
            nome: response.nome || "",
            sku: response.sku || "",
            quantidade: response.quantidade ?? "",
            categoria: response.categoria || "",
            descricao: response.descricao || "",
          });
        }
      });
    }
  }, [id, isEdit]);

 
  const carregarCategorias = async () => {
    try {
      const lista = await ApiService.get("/categorias");
      setCategorias(lista || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome || formData.nome.length < 2) {
      novosErros.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.sku || formData.sku.length < 3) {
      novosErros.sku = "Código deve ter pelo menos 3 caracteres";
    }

    if (formData.quantidade === "" || Number(formData.quantidade) < 0) {
      novosErros.quantidade = "Quantidade deve ser um número válido";
    }

    if (!formData.categoria) {
      novosErros.categoria = "Selecione uma categoria";
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
      const payload = {
        nome: formData.nome,
        sku: formData.sku,
        quantidade: Number(formData.quantidade),
        categoria: formData.categoria,
        descricao: formData.descricao,
      };

      try {
        if (isEdit) {
          await ApiService.put(`/produtos/${id}`, payload);
          exibirToast("Produto atualizado com sucesso!");
        } else {
          await ApiService.post("/produtos", payload);
          exibirToast("Produto cadastrado com sucesso!");
        }
        setTimeout(() => navigate("/produtos"), 1500);
      } catch (error) {
        exibirToast(error.message || "Erro ao salvar produto", "danger");
      }
    }
  };

 
const handleSalvarNovaCategoria = async () => {
  const nome = novaCategoriaNome.trim();
  if (!nome) {
    alert("Informe o nome da categoria");
    return;
  }

  const jaExiste = categorias.some(
    (cat) => cat.nome.toLowerCase() === nome.toLowerCase()
  );
  if (jaExiste) {
    alert("Já existe uma categoria com esse nome!");
    return;
  }

  try {
    
    await ApiService.post("/categorias", { nome });

    setNovaCategoriaNome("");
    setShowNovaCategoriaModal(false);

   
    await carregarCategorias();

    setFormData((prev) => ({ ...prev, categoria: nome }));
  } catch (error) {
    console.error("Erro ao salvar categoria:", error);
    alert("Erro ao salvar categoria");
  }
};

  const handleExcluirCategoria = async (idCat) => {
    if (!window.confirm("Deseja realmente excluir esta categoria?")) return;

    try {
      await ApiService.delete(`/categorias/${idCat}`);
      await carregarCategorias();

     
      setFormData((prev) => {
        const catExcluida = categorias.find((c) => c.id === idCat);
        if (catExcluida && prev.categoria === catExcluida.nome) {
          return { ...prev, categoria: "" };
        }
        return prev;
      });
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria");
    }
  };

  
  const handleSalvarEdicaoCategoria = async () => {
    const nome = editingCategoriaNome.trim();
    if (!nome) {
      alert("Informe o nome da categoria");
      return;
    }

   
    const jaExiste = categorias.some(
      (cat) =>
        cat.id !== editingCategoriaId &&
        cat.nome.toLowerCase() === nome.toLowerCase()
    );
    if (jaExiste) {
      alert("Já existe uma categoria com esse nome!");
      return;
    }

    try {
      const idEditando = editingCategoriaId;

      await ApiService.put(`/categorias/${idEditando}`, { nome });
      setEditingCategoriaId(null);
      setEditingCategoriaNome("");

      await carregarCategorias();

      
      setFormData((prev) => {
        const catAntiga = categorias.find((c) => c.id === idEditando);
        if (catAntiga && prev.categoria === catAntiga.nome) {
          return { ...prev, categoria: nome };
        }
        return prev;
      });
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
      alert("Erro ao editar categoria");
    }
  };

  
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold">
          {isEdit ? "Editar Produto" : "Novo Produto"}
        </h5>
        <Link
          to="/produtos"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          aria-label="Voltar para lista"
        >
          <i className="bi bi-arrow-left"></i> Voltar
        </Link>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nome *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome do produto"
                    isInvalid={!!errors.nome}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Código (SKU) *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Ex: 1234567"
                    isInvalid={!!errors.sku}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sku}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Quantidade *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="quantidade"
                    min="0"
                    value={formData.quantidade}
                    onChange={handleChange}
                    placeholder="0"
                    isInvalid={!!errors.quantidade}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.quantidade}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="fw-semibold mb-0">
                      Categoria *
                    </Form.Label>

                    <div className="d-flex gap-2">
            
                      <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowNovaCategoriaModal(true)}
                      >
                        Nova categoria
                      </Button>

                      
                      <Button
                      type="button" 
                      variant="outline-primary"
                      size="sm"
                      style={{ width: "120px", padding: "0" }}
                      onClick={() => setShowGerenciarCategoriasModal(true)}
                     >
                       Editar Categorias
                      </Button>


                    </div>
                  </div>

                  <Form.Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    isInvalid={!!errors.categoria}
                    className={`${
                      !formData.categoria ? "placeholder-active" : ""
                    } mt-2`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.nome}>
                        {cat.nome}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categoria}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                rows={3}
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição do produto (opcional)"
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="success">
                <i className="bi bi-check-lg me-1"></i>
                {isEdit ? "Salvar" : "Cadastrar"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* TOAST */}
      <ToastContainer position="bottom-center" className="mb-4">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
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

      
      <Modal
        show={showNovaCategoriaModal}
        onHide={() => setShowNovaCategoriaModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Nova categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome da categoria</Form.Label>
            <Form.Control
              type="text"
              value={novaCategoriaNome}
              onChange={(e) => setNovaCategoriaNome(e.target.value)}
              placeholder="Ex.: Ração, Brinquedo..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowNovaCategoriaModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSalvarNovaCategoria}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      
      <Modal
        show={showGerenciarCategoriasModal}
        onHide={() => {
          setShowGerenciarCategoriasModal(false);
          setEditingCategoriaId(null);
          setEditingCategoriaNome("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Gerenciar categorias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categorias.length === 0 ? (
            <p className="text-muted mb-0">Nenhuma categoria cadastrada.</p>
          ) : (
            categorias.map((cat) =>
              editingCategoriaId === cat.id ? (
                <div
                  key={cat.id}
                  className="d-flex align-items-center gap-2 mb-2"
                >
                  <Form.Control
                    size="sm"
                    value={editingCategoriaNome}
                    onChange={(e) => setEditingCategoriaNome(e.target.value)}
                  />
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleSalvarEdicaoCategoria}
                  >
                    Salvar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setEditingCategoriaId(null);
                      setEditingCategoriaNome("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <div
                  key={cat.id}
                  className="d-flex align-items-center justify-content-between mb-2"
                >
                  <span>{cat.nome}</span>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setEditingCategoriaId(cat.id);
                        setEditingCategoriaNome(cat.nome);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleExcluirCategoria(cat.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              )
            )
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Formulario;
