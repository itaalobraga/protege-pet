import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "src/test/renderWithRouter.jsx";
import ListaDeAdocoes from "./ListaDeAdocoes.jsx";
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

describe("ListaDeAdocoes help integration", () => {
  beforeEach(() => {
    ApiService.get.mockResolvedValue([]);
  });

  it("renders the shared help and opens the adoption guidance", async () => {
    const user = userEvent.setup();

    renderWithRouter(<ListaDeAdocoes />);

    const button = await screen.findByRole("button", { name: "Ajuda" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);

    expect(screen.getByText("Como usar a lista de adoções")).toBeInTheDocument();
    expect(
      screen.getByText("Use a busca para localizar o adotante."),
    ).toBeInTheDocument();
  });
});
