import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HelpSection from "./HelpSection.jsx";

const sampleContent = {
  heading: "Como usar esta tela",
  sections: [
    {
      title: "O que voce faz aqui",
      items: ["Consulta dados operacionais."],
    },
    {
      title: "Como executar",
      items: ["Clique em Novo para iniciar o fluxo."],
    },
  ],
};

describe("HelpSection", () => {
  it("starts collapsed and expands on click", async () => {
    const user = userEvent.setup();

    render(<HelpSection content={sampleContent} />);

    const button = screen.getByRole("button", { name: "Help" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("O que voce faz aqui")).not.toBeInTheDocument();

    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("O que voce faz aqui")).toBeInTheDocument();
    expect(
      screen.getByText("Clique em Novo para iniciar o fluxo."),
    ).toBeInTheDocument();
  });

  it("collapses again on second click", async () => {
    const user = userEvent.setup();

    render(<HelpSection content={sampleContent} />);

    const button = screen.getByRole("button", { name: "Help" });
    await user.click(button);
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("O que voce faz aqui")).not.toBeInTheDocument();
  });

  it("returns null when content is missing", () => {
    const { container } = render(<HelpSection content={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
