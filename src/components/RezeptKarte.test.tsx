import { render, screen } from "@testing-library/react";
import RezeptKarte from "./RezeptKarte";

describe("RezeptKarte", () => {
  test("zeigt den Namen des Rezepts", () => {
    render(<RezeptKarte name="Pfannkuchen" autor="Lena"
      dauerMinuten={20} />);
    expect(screen.getByText("Pfannkuchen"))
      .toBeInTheDocument();
  });
  test("zeigt Autor und Dauer im Button", () => {
    render(<RezeptKarte name="Apfelkuchen" autor="Oma"
      dauerMinuten={75} />);
    expect(screen.getByRole("button"))
      .toHaveTextContent("von Oma · 1 Std. 15 Min.");
  });
});
