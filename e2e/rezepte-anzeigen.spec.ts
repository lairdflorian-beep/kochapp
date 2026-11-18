import { test, expect } from "@playwright/test";

test("Rezeptdetails anzeigen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button",
    { name: /Omas Apfelkuchen/ }).click();
  await expect(page).toHaveURL("/rezept/1");
  const detail = page.getByRole("region",
    { name: "Rezeptdetails" });
  await expect(detail.getByRole("heading"))
    .toHaveText("Omas Apfelkuchen");
  await expect(detail).toContainText("ID: 1");
  await expect(detail).toContainText("Autor: Oma");
  await expect(detail)
    .toContainText("Dauer: 1 Std. 15 Min.");
});
