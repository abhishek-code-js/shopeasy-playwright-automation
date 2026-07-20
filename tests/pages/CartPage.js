export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartTable = page.getByTestId("cart-table");
    this.cartTotal = page.getByTestId("cart-total");
    this.checkoutBtn = page.getByTestId("checkout-btn");
    this.emptyMsg = page.locator("#cart-empty");
  }

  async navigate() {
    await this.page.evaluate(() => {
      window.navigate("cart");
      window.renderCart();
    });
    await this.page.waitForSelector("#page-cart.active");
  }

  async getItemCount() {
    const rows = await this.cartTable.locator("tbody tr").all();
    return rows.length;
  }

  async removeItem(id) {
    await this.page.getByTestId(`remove-${id}`).click();
  }

  async getTotal() {
    return this.cartTotal.textContent();
  }

  async clickCheckout() {
    await this.checkoutBtn.click();
  }

  async isCartEmpty() {
    await this.emptyMsg.isVisible();
  }

  async getItemQty(id) {
    return parseInt(await this.page.getByTestId(`qty-${id}`).textContent(), 10);
  }
}
