import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import RezeptListe from "./RezeptListe";

const server = setupServer(
  http.get("*/rezepte", () =>
    HttpResponse.json([{ id: 4, name: "Pfannkuchen",
      autor: "Lena", dauerMinuten: 20 }])),
);
beforeAll(() => server.listen());
afterAll(() => server.close());

test("zeigt Rezepte aus der Schnittstelle", async () => {
  render(<RezeptListe />);
  expect(await screen.findByText("Pfannkuchen"))
    .toBeInTheDocument();
});
