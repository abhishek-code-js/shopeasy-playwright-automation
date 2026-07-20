import { test, expect } from "@playwright/test";

const API = process.env.API_BASE || "http://localhost:3001";

test.describe("Products API", () => {
  test("TC-API-P-001 | GET /products returns 200 and an array", async ({
    request,
  }) => {
    const res = await request.get(`${API}/products`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test("TC-API-P-002 | GET /products returns correct fields per item", async ({
    request,
  }) => {
    const res = await request.get(`${API}/products`);
    const products = await res.json();

    products.forEach((p) => {
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("name");
      expect(p).toHaveProperty("price");
      expect(p).toHaveProperty("category");
      expect(p).toHaveProperty("stock");
      expect(typeof p.price).toBe("number");
      expect(p.price).toBeGreaterThan(0);
    });
  });

  test("TC-API-P-003 | GET /products/:id returns single product", async ({
    request,
  }) => {
    const res = await request.get(`${API}/products/1`);
    expect(res.status()).toBe(200);
    const product = await res.json();
    expect(product.id).toBe(1);
    expect(product.name).toBe("Wireless Headphones");
  });

  test("TC-API-P-004 | GET /products/9999 returns 404", async ({ request }) => {
    const res = await request.get(`${API}/products/9999`);
    expect(res.status()).toBe(404);
  });

  test("TC-API-P-005 | POST /products creates a new product", async ({
    request,
  }) => {
    const res = await request.post(`${API}/products`, {
      data: {
        name: "Test Gadget",
        price: 999,
        category: "Electronics",
        stock: 10,
      },
    });
    expect(res.status()).toBe(201);
    const created = await res.json();
    expect(created.name).toBe("Test Gadget");
    expect(created.id).toBeDefined();

    // Clean up — delete what we just created so other tests aren't affected
    await request.delete(`${API}/products/${created.id}`);
  });

  test("TC-API-P-006 | PATCH /products/1 updates stock", async ({
    request,
  }) => {
    const res = await request.patch(`${API}/products/1`, {
      data: {
        stock: 45,
      },
    });
    expect(res.status(200)).toBe(200);
    expect((await res.json()).stock).toBe(45);

    await request.patch(`${API}/products/1`, { data: { stock: 50 } });
  });
});
