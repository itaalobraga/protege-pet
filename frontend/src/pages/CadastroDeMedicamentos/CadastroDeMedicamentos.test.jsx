import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "src/test/renderWithRouter.jsx";
import CadastroDeMedicamentos from "./CadastroDeMedicamentos.jsx";
import ApiService from "src/services/ApiService.js";

vi.mock("src/components/Header/Header.jsx", () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock("src/services/ApiService.js", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    postForm: vi.fn(),
  },
}));

describe("CadastroDeMedicamentos help integration", () => {
  beforeEach(() => {
    ApiService.get.mockResolvedValue(null);
  });

  it("renders the help inside the form wrapper flow", async () => {
    const user = userEvent.setup();

    renderWithRouter(<CadastroDeMedicamentos />, {
      route: "/medicamentos/cadastro",
      path: "/medicamentos/cadastro",
    });

    const button = screen.getByRole("button", { name: "Ajuda" });
    await user.click(button);

    expect(
      screen.getByText("Como cadastrar ou editar um medicamento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("O nome do medicamento é obrigatório."),
    ).toBeInTheDocument();
  });
});
