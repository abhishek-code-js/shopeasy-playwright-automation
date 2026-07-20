import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,

  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/playwright-report", open: "always" }],
    ["json", { outputFile: "reports/results.json" }],
    ["junit", { outputFile: "reports/results.xml" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",
    trace: "off",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: false,
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:5173",
        reuseExistingServer: !process.env.CI,
      },
});
