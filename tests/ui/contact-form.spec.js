import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ContactPage } from "../pages/ContactPage";

test.describe("Contact form", () => {
  let contactPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login("test@shopeasy.com", "Test@1234");
    await page.waitForSelector("#page-products.active");
    contactPage = new ContactPage(page);
    await contactPage.navigate();
  });

  test("TC-CF-001 | Contact form renders all fields", async ({ page }) => {
    await expect(page.getByTestId("contact-name")).toBeVisible();
    await expect(page.getByTestId("contact-email")).toBeVisible();
    await expect(page.getByTestId("contact-subject")).toBeVisible();
    await expect(page.getByTestId("contact-message")).toBeVisible();
    await expect(page.getByTestId("contact-submit")).toBeVisible();
  });

  test("TC-CF-002 | Valid submission shows success", async ({ page }) => {
    await contactPage.fillAndSubmit({
      name: "Abhishek Shah",
      email: "abhishekshah2018@gmail.com",
      subject: "general",
      message: "This is long enough text message from the QA automation suite",
    });
    await expect(page.locator("#contact-alert")).toContainText(
      "sent successfully",
    );
  });

  test("TC-CF-003 | Empty name shows error", async ({ page }) => {
    await contactPage.fillAndSubmit({
      name: "",
      email: "abhishek@gmail.com",
      subject: "order",
      message: "A properly long enough message for testing",
    });
  });

  test("TC-CF-004 | Message under 20 characters shows error", async ({
    page,
  }) => {
    await contactPage.fillAndSubmit({
      name: "Test User",
      email: "a@test.com",
      subject: "return",
      message: "Too short",
    });
    await expect(page.locator("#c-msg-error")).toContainText("20 characters");
  });

  test("TC-CF-005 | Invalid email in contact form shows error", async ({
    page,
  }) => {
    await contactPage.fillAndSubmit({
      name: "Test User",
      email: "bademail",
      subject: "general",
      message: "A properly long enough message for this test case.",
    });
    await expect(page.locator("#c-email-error")).toContainText("Valid email");
  });

  test("TC-CF-006 | Screenshot and trace after form submit", async ({
    page,
  }) => {
    await page.context().tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true,
    });

    await contactPage.fillAndSubmit({
      name: "QA Tester",
      email: "qa@shopeasy.com",
      subject: "general",
      message:
        "Automated test verifying the contact form submission flow end to end.",
    });

    await expect(page.locator("#contact-alert")).toBeVisible();

    await page.screenshot({
      path: "screenshots/tc-cf-006-form-success.png",
      fullPage: true,
    });

    await page.context().tracing.stop({
      path: "traces/tc-cf-006-trace.zip",
    });
  });

  test("TC-CF-007 | Element screenshot of success alert", async ({ page }) => {
    await contactPage.fillAndSubmit({
      name: "Element Test",
      email: "elem@test.com",
      subject: "order",
      message:
        "Testing element-level screenshot capture in Playwright automation.",
    });

    const alert = page.locator("#contact-alert");
    await expect(alert).toBeVisible();

    await alert.screenshot({
      path: "screenshots/tc-cf-007-alert-element.png",
    });
  });
});
