# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/cart.spec.js >> Shopping cart >> TC-C-001 | Empty cart shows empty message
- Location: tests/ui/cart.spec.js:18:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: undefined
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - navigation [ref=e3]:
    - heading "🛒 ShopEasy" [level=1] [ref=e4]
    - generic [ref=e5]:
      - link "Products" [ref=e6] [cursor=pointer]:
        - /url: "#"
      - link "Cart 0" [ref=e7] [cursor=pointer]:
        - /url: "#"
      - link "Contact" [ref=e8] [cursor=pointer]:
        - /url: "#"
      - link "Logout" [ref=e9] [cursor=pointer]:
        - /url: "#"
  - main [ref=e10]:
    - generic [ref=e11]:
      - heading "Shopping Cart" [level=2] [ref=e12]
      - paragraph [ref=e13]: Your cart is empty.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { LoginPage } from "../pages/LoginPage";
  3  | import { ProductPage } from "../pages/ProductPage";
  4  | import { CartPage } from "../pages/CartPage";
  5  | 
  6  | test.describe("Shopping cart", () => {
  7  |   let productPage, cartPage;
  8  | 
  9  |   test.beforeEach(async ({ page }) => {
  10 |     const lp = new LoginPage(page);
  11 |     await lp.navigate();
  12 |     await lp.login("test@shopeasy.com", "Test@1234");
  13 |     await page.waitForSelector("#page-products.active");
  14 |     productPage = new ProductPage(page);
  15 |     cartPage = new CartPage(page);
  16 |   });
  17 | 
  18 |   test("TC-C-001 | Empty cart shows empty message", async () => {
  19 |     await cartPage.navigate();
> 20 |     expect(await cartPage.isCartEmpty()).toBe(true);
     |                                          ^ Error: expect(received).toBe(expected) // Object.is equality
  21 |   });
  22 | 
  23 |   test("TC-C-OO2 | Adding product increments cart count", async ({ page }) => {
  24 |     await productPage.addProductToCart(1);
  25 |     const count = await productPage.getCartCount();
  26 |     expect(count).toBe(1);
  27 |   });
  28 | 
  29 |   test("TC-C-003 | Cart shows correct item after add", async ({ page }) => {
  30 |     await productPage.addProductToCart(1);
  31 |     await cartPage.navigate();
  32 |     const itemCount = await cartPage.getItemCount();
  33 |     expect(itemCount).toBe(1);
  34 |   });
  35 | 
  36 |   test("TC-C-004 | Adding same product twice increments quantity", async ({
  37 |     page,
  38 |   }) => {
  39 |     await productPage.addProductToCart(2);
  40 |     await productPage.addProductToCart(2);
  41 |     await cartPage.navigate();
  42 |     expect(await cartPage.getItemQty(2)).toBe(2);
  43 |   });
  44 | });
  45 | 
```