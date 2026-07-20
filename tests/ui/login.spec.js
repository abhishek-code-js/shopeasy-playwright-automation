import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("login page", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("TC-L-001 | Login form renders all required fields", async ({
    page,
  }) => {
    await expect(page.getByTestId("email-input")).toBeVisible();
    await expect(page.getByTestId("password-input")).toBeVisible();
    await expect(page.getByTestId("login-btn")).toBeVisible();
    await expect(page.getByTestId("login-btn")).toHaveText("Sign In");
  });

  test("TC-L-002 | Successful login with valid credentials", async ({
    page,
  }) => {
    await loginPage.login("test@shopeasy.com", "Test@1234");
    await expect(page.locator("#login-alert")).toContainText(
      "Login successful",
    );
    await page.waitForSelector("#page-products.active", { timeout: 3000 });
    await expect(page.locator("#page-products")).toBeVisible();
  });

  test("TC-L-003 | Login fails with invalid password", async ({ page }) => {
    await loginPage.login("test@shopeasy.com", "WrongPass");
    await expect(page.locator("#login-alert")).toContainText(
      "Invalid email or password",
    );
  });

  test("TC-L-004 | Empty email shows error", async ({ page }) => {
    await loginPage.login("", "Test1234");
    await expect(page.locator("#email-error")).toContainText(
      "Email is required",
    );
  });

  test("TC-L-005 | Invalid email format shows error", async ({ page }) => {
    await loginPage.login("notanemail", "Test1234");
    await expect(page.locator("#email-error")).toContainText(
      "Enter a valid email",
    );
  });

  test("TC-L-006 | Password field is masked", async ({ page }) => {
    await expect(page.getByTestId("password-input")).toHaveAttribute(
      "type",
      "password",
    );
  });

  test("TC-L-007 | Screenshot captured on login failure", async ({ page }) => {
    await loginPage.login("wrong@email.com", "badpass");

    await page.screenshot({
      path: "screenshots/tc-l-007-login-failure.png",
      fullPage: true,
    });

    await expect(page.locator("#login-alert")).toContainText("Invalid");
  });
});
