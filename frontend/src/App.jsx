import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import CadastroDeVoluntarios from "./pages/CadastroDeVoluntarios/CadastroDeVoluntarios.jsx";
import ListaDeVoluntarios from "./pages/ListaDeVoluntarios/ListaDeVoluntarios.jsx";
import CadastroDeUsuarios from "./pages/CadastroDeUsuarios/CadastroDeUsuarios.jsx";
import ListaDeUsuarios from "./pages/ListaDeUsuarios/ListaDeUsuarios.jsx";
import CadastroDeAnimais from "./pages/CadastroDeAnimais/CadastroDeAnimais.jsx";
import ListaDeAnimais from "./pages/ListaDeAnimais/ListaDeAnimais.jsx";
import CadastroDeProdutos from "./pages/CadastroDeProdutos/CadastroDeProdutos.jsx";
import ListaDeProdutos from "./pages/ListaDeProdutos/ListaDeProdutos.jsx";
import CadastroDeVeterinarios from "./pages/CadastroDeVeterinarios/CadastroDeVeterinarios.jsx";
import ListaDeVeterinarios from "./pages/ListaDeVeterinarios/ListaDeVeterinarios.jsx";
import AgendaDeConsultas from "./pages/AgendaDeConsultas/AgendaDeConsultas.jsx";
import ConsultaForm from "./pages/AgendaDeConsultas/ConsultaForm.jsx";
import CadastroDeFuncoes from "./pages/CadastroDeFuncoes/CadastroDeFuncoes.jsx";
import ListaDeFuncoes from "./pages/ListaDeFuncoes/ListaDeFuncoes.jsx";
import ListaDeCategorias from "./pages/ListaDeCategorias/ListaDeCategorias";
import CadastroDeCategorias from "./pages/CadastroDeCategorias/CadastroDeCategorias";
import ListaDeRacas from "./pages/ListaDeRacas/ListaDeRacas.jsx";
import CadastroDeRacas from "./pages/CadastroDeRacas/CadastroDeRacas.jsx";
import CadastroDeMovimentacoes from "./pages/CadastroDeMovimentacoes/CadastroDeMovimentacoes.jsx";
import ListaDeMovimentacoes from "./pages/ListaDeMovimentacoes/ListaDeMovimentacoes.jsx";
import DetalhesMovimentacao from "./pages/DetalhesMovimentacao/DetalhesMovimentacao.jsx";
import Login from "./pages/Login/Login.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/usuarios" replace />} />
            <Route path="/voluntarios" element={<ListaDeVoluntarios />} />
            <Route
              path="/voluntarios/cadastro"
              element={<CadastroDeVoluntarios />}
            />
            <Route
              path="/voluntarios/cadastro/editar/:id"
              element={<CadastroDeVoluntarios />}
            />
            <Route path="/usuarios" element={<ListaDeUsuarios />} />
            <Route path="/usuarios/cadastro" element={<CadastroDeUsuarios />} />
            <Route
              path="/usuarios/cadastro/editar/:id"
              element={<CadastroDeUsuarios />}
            />
            <Route path="/animais" element={<ListaDeAnimais />} />
            <Route path="/animais/cadastro" element={<CadastroDeAnimais />} />
            <Route
              path="/animais/cadastro/editar/:id"
              element={<CadastroDeAnimais />}
            />
            <Route path="/produtos" element={<ListaDeProdutos />} />
            <Route path="/produtos/cadastro" element={<CadastroDeProdutos />} />
            <Route
              path="/produtos/cadastro/editar/:id"
              element={<CadastroDeProdutos />}
            />
            <Route path="/veterinarios" element={<ListaDeVeterinarios />} />
            <Route
              path="/veterinarios/cadastro"
              element={<CadastroDeVeterinarios />}
            />
            <Route
              path="/veterinarios/cadastro/editar/:id"
              element={<CadastroDeVeterinarios />}
            />
            <Route path="/consultas" element={<AgendaDeConsultas />} />
            <Route path="/consultas/novo" element={<ConsultaForm />} />
            <Route path="/consultas/editar/:id" element={<ConsultaForm />} />
            <Route path="/funcoes" element={<ListaDeFuncoes />} />
            <Route path="/funcoes/cadastro" element={<CadastroDeFuncoes />} />
            <Route
              path="/funcoes/cadastro/editar/:id"
              element={<CadastroDeFuncoes />}
            />
            <Route path="/categorias" element={<ListaDeCategorias />} />
            <Route
              path="/categorias/cadastro"
              element={<CadastroDeCategorias />}
            />
            <Route
              path="/categorias/cadastro/editar/:id"
              element={<CadastroDeCategorias />}
            />
            <Route path="/racas" element={<ListaDeRacas />} />
            <Route path="/racas/cadastro" element={<CadastroDeRacas />} />
            <Route
              path="/racas/cadastro/editar/:id"
              element={<CadastroDeRacas />}
            />
            <Route path="/movimentacoes" element={<ListaDeMovimentacoes />} />
            <Route
              path="/movimentacoes/nova"
              element={<CadastroDeMovimentacoes />}
            />
            <Route
              path="/movimentacoes/:id"
              element={<DetalhesMovimentacao />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
