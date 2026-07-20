import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";

test.describe("Shopping cart", () => {
  let productPage, cartPage;

  test.beforeEach(async ({ page }) => {
    const lp = new LoginPage(page);
    await lp.navigate();
    await lp.login("test@shopeasy.com", "Test@1234");
    await page.waitForSelector("#page-products.active");
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  test("TC-C-001 | Empty cart shows empty message", async () => {
    await cartPage.navigate();
    expect(await cartPage.isCartEmpty()).toBe(true);
  });

  test("TC-C-OO2 | Adding product increments cart count", async ({ page }) => {
    await productPage.addProductToCart(1);
    const count = await productPage.getCartCount();
    expect(count).toBe(1);
  });

  test("TC-C-003 | Cart shows correct item after add", async ({ page }) => {
    await productPage.addProductToCart(1);
    await cartPage.navigate();
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBe(1);
  });

  test("TC-C-004 | Adding same product twice increments quantity", async ({
    page,
  }) => {
    await productPage.addProductToCart(2);
    await productPage.addProductToCart(2);
    await cartPage.navigate();
    expect(await cartPage.getItemQty(2)).toBe(2);
  });
});
