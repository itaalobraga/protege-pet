import { describe, expect, it } from "vitest";
import { getHelpContent, helpContent } from "./helpContent.js";

describe("helpContent", () => {
  it("returns content for a valid module and variant", () => {
    const content = getHelpContent("adocoes", "lista");

    expect(content).not.toBeNull();
    expect(content.heading).toBe("Como usar a lista de adocoes");
    expect(content.sections.map((section) => section.title)).toEqual([
      "O que voce faz aqui",
      "Como executar",
      "Atencao ao usar",
      "Dicas rapidas",
    ]);
  });

  it("returns null for an unknown key", () => {
    expect(getHelpContent("rf8", "lista")).toBeNull();
    expect(getHelpContent("adocoes", "agenda")).toBeNull();
  });

  it("keeps all sections as arrays of strings", () => {
    Object.values(helpContent).forEach((variants) => {
      Object.values(variants).forEach((entry) => {
        expect(entry.heading).toEqual(expect.any(String));
        expect(Array.isArray(entry.sections)).toBe(true);
        entry.sections.forEach((section) => {
          expect(section.title).toEqual(expect.any(String));
          expect(Array.isArray(section.items)).toBe(true);
          section.items.forEach((item) => {
            expect(item).toEqual(expect.any(String));
          });
        });
      });
    });
  });
});
