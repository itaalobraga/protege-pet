import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "src/test/renderWithRouter.jsx";
import DetalhesDoacao from "./DetalhesDoacao.jsx";
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

describe("DetalhesDoacao help integration", () => {
  beforeEach(() => {
    ApiService.get.mockResolvedValue({
      id: 1,
      created_at: "2026-05-26 10:00:00",
      doador_nome: "Maria",
      doador_contato: "maria@email.com",
      tipo_doacao: "DINHEIRO",
      valor: 50,
      observacao: "Recibo enviado",
    });
  });

  it("shows the details help content", async () => {
    const user = userEvent.setup();

    renderWithRouter(<DetalhesDoacao />, {
      route: "/doacoes/1",
      path: "/doacoes/:id",
    });

    const button = await screen.findByRole("button", { name: "Help" });
    await user.click(button);

    expect(
      screen.getByText("Como ler os detalhes da doacao"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Revise identificacao, data, doador, tipo e observacao."),
    ).toBeInTheDocument();
  });
});
