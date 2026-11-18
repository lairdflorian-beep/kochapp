import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: [
    { command: "node server/server.ts",
      url: "http://localhost:3001/rezepte",
      reuseExistingServer: true },
    { command: "npm start",
      url: "http://localhost:3000",
      reuseExistingServer: true },
  ],
  projects: [
    { name: "chromium",
      use: { ...devices["Desktop Chrome"] } },
    { name: "firefox",
      use: { ...devices["Desktop Firefox"] } },
    { name: "webkit",
      use: { ...devices["Desktop Safari"] } },
    { name: "smartphone",
      use: { ...devices["iPhone 15"] } },
  ],
});
