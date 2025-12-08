
import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "src/components/Header/Header.jsx";
import ApiService from "../../services/ApiService";

function CadastroDeCategorias() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    try {
      setSalvando(true);
      await ApiService.post("/categorias", { nome, descricao });
      alert("Categoria cadastrada com sucesso!");

      
      navigate("/categorias");
    } catch (error) {
      console.error("Erro ao cadastrar categoria:", error);
      alert("Erro ao cadastrar categoria");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Header />

      <main>
        <Container className="py-4 d-flex justify-content-center">
          
          <div style={{ maxWidth: "720px", width: "100%" }}>
           
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-semibold">Nova Categoria</h5>
              <Link
                to="/produtos/cadastro"
                className="btn btn-outline-secondary d-flex align-items-center gap-2"
                aria-label="Voltar para cadastro de produto"
              >
                <i className="bi bi-arrow-left"></i> Voltar
              </Link>
            </div>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Nome *</Form.Label>
                    <Form.Control
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome da categoria"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descrição da categoria (opcional)"
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button type="submit" variant="success" disabled={salvando}>
                      {salvando ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </main>
    </>
  );
}

export default CadastroDeCategorias;
