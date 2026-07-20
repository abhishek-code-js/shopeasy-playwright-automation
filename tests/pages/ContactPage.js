export class ContactPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByTestId("contact-name");
    this.emailInput = page.getByTestId("contact-email");
    this.subjectSelect = page.getByTestId("contact-subject");
    this.messageInput = page.getByTestId("contact-message");
    this.submitBtn = page.getByTestId("contact-submit");
    this.successAlert = page.locator("#contact-alert");
  }

  async navigate() {
    await this.page.evaluate(() => window.navigate("contact"));
    await this.page.waitForSelector("#page-contact.active");
  }

  async fillAndSubmit({ name, email, subject, message }) {
    if (name) await this.nameInput.fill(name);
    if (email) await this.emailInput.fill(email);
    if (subject) await this.subjectSelect.selectOption(subject);
    if (message) await this.messageInput.fill(message);
    await this.submitBtn.click();
  }
}
