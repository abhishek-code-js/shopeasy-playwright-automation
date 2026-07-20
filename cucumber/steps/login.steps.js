import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:5173";

Given("I am on the login page", async function () {
  await this.page.goto(BASE);
  await this.page.waitForSelector("#page-login.active");
});

When(
  "I enter email {string} and password {string}",
  async function (email, password) {
    if (email) await this.page.getByTestId("email-input").fill(email);
    if (password) await this.page.getByTestId("password-input").fill(password);
  },
);

When("I click the Sign In button", async function () {
  await this.page.getByTestId("login-btn").click();
});

Then("I should see {string}", async function (text) {
  await expect(this.page.locator(".alert.show")).toContainText(text);
});

Then("I should be redirected to the products page", async function () {
  await this.page.waitForSelector("#page-products.active", { timeout: 3000 });
  await expect(this.page.locator("#page-products")).toBeVisible();
});
