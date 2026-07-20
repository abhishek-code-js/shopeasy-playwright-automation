export class ProductPage {
  constructor(page) {
    this.page = page;
    this.productGrid = page.getByTestId("product-grid");
    this.cartCount = page.locator("#cart-count");
  }

  async navigate() {
    await this.page.evaluate(() => window.navigate("products"));
    await this.page.waitForSelector("#page-products.active");
  }

  async addProductToCart(id) {
    await this.page.getByTestId(`add-to-cart-${id}`).click();
  }

  async getCartCount() {
    return parseInt(await this.cartCount.textContent(), 10);
  }
}
