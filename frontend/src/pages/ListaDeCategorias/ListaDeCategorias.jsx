import React, { useEffect, useState } from "react";
import ApiService from "../../services/ApiService";
import { Link } from "react-router-dom";

function ListaDeCategorias() {
  const [categorias, setCategorias] = useState([]);

  async function carregar() {
    try {
      const dados = await ApiService.get("/categorias");
      setCategorias(dados);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      alert("Erro ao carregar categorias");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleExcluir(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta categoria?"
    );
    if (!confirmar) return;

    try {
      await ApiService.delete(`/categorias/${id}`);
      setCategorias((lista) => lista.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria");
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Categorias de Produtos</h2>
        <Link to="/categorias/nova" className="btn btn-primary">
          + Nova Categoria
        </Link>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th style={{ width: "140px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                Nenhuma categoria cadastrada
              </td>
            </tr>
          ) : (
            categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.nome}</td>
                <td>{cat.descricao}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleExcluir(cat.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaDeCategorias;
