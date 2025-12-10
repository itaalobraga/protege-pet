import Header from "../../components/Header/Header";
import { Container, Card } from "react-bootstrap";
import Formulario from "./components/Formulario/Formulario";
import { useParams } from "react-router-dom";

function CadastroDeRacas() {
  const { id } = useParams();
  const titulo = id ? "Editar Raça" : "Cadastrar Nova Raça";

  return (
    <>
      <Header />
      <main>
        <Container className="py-4">
          <h4 className="mb-4 fw-semibold">{titulo}</h4>
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Formulario />
            </Card.Body>
          </Card>
        </Container>
      </main>
    </>
  );
}

export default CadastroDeRacas;