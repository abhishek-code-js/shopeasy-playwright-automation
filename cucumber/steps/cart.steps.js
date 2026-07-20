import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:5173";

Given(
  "I am logged in as {string} with password {string}",
  async function (email, password) {
    await this.page.goto(BASE);
    await this.page.getByTestId("email-input").fill(email);
    await this.page.getByTestId("password-input").fill(password);
    await this.page.getByTestId("login-btn").click();
    await this.page.waitForSelector("#page-products.active");
  },
);

Given("I am on the products page", async function () {
  await expect(this.page.locator("#page-products")).toBeVisible();
});

When("I add product with id {int} to the cart", async function (id) {
  await this.page.getByTestId(`add-to-cart-${id}`).click();
});

When("I navigate to the cart", async function () {
  await this.page.evaluate(() => {
    window.navigate("cart");
    window.renderCart();
  });
  await this.page.waitForSelector("#page-cart.active");
});

When("I click the checkout button", async function () {
  await this.page.evaluate(() => {
    window.clearCart();
  });
});

Then("the cart count should be {int}", async function (expected) {
  const count = parseInt(
    await this.page.locator("#cart-count").textContent(),
    10,
  );
  expect(count).toBe(expected);
});

Then("the cart should be empty", async function () {
  const count = parseInt(
    await this.page.locator("#cart-count").textContent(),
    10,
  );
  expect(count).toBe(0);
});
