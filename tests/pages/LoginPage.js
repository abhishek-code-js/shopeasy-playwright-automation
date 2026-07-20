export class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.loginBtn = page.getByTestId("login-btn");
    this.loginAlert = page.locator("#login-alert");
    this.emailError = page.locator("#email-error");
    this.passwordError = page.locator("#password-error");
  }

  async navigate() {
    await this.page.goto("/");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}
