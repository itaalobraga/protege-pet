  import { Container } from "react-bootstrap";
  import Header from "src/components/Header/Header.jsx";
  import Formulario from "./components/Formulario/Formulario.jsx";

  function CadastroDeProdutos() {
    return (
      <>
        <Header />
        <main>
          <Container className="py-4">
            <Formulario />
          </Container>
        </main>
      </>
    );
  }

  export default CadastroDeProdutos;