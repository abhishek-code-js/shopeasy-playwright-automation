import { test, expect } from "@playwright/test";
const API = process.env.API_BASE || "http://localhost:3001";

test.describe("Orders API", () => {
  test("TC-API-O-001 | GET /orders returns 200", async ({ request }) => {
    const res = await request.get(`${API}/orders`);
    expect(res.status()).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });

  test("TC-API-O-002 | GET /orders/101 has correct structure", async ({
    request,
  }) => {
    const res = await request.get(`${API}/orders/101`);
    const order = await res.json();
    expect(order).toHaveProperty("id");
    expect(order).toHaveProperty("userId");
    expect(order).toHaveProperty("items");
    expect(order).toHaveProperty("total");
    expect(order).toHaveProperty("status");
    expect(Array.isArray(order.items)).toBe(true);
  });

  test("TC-API-O-003 | POST /orders creates order", async ({ request }) => {
    const res = await request.post(`${API}/orders`, {
      data: {
        userId: 1,
        items: [{ productId: 2, qty: 1 }],
        total: 3499,
        status: "pending",
      },
    });
    expect(res.status()).toBe(201);
    const created = await res.json();
    expect(created.status).toBe("pending");
    await request.delete(`${API}/orders/${created.id}`);
  });

  test("TC-API-O-004 | PATCH /orders/:id updates status", async ({
    request,
  }) => {
    const { id } = await (
      await request.post(`${API}/orders`, {
        data: { userId: 1, items: [], total: 0, status: "pending" },
      })
    ).json();

    const patched = await (
      await request.patch(`${API}/orders/${id}`, {
        data: { status: "shipped" },
      })
    ).json();

    expect(patched.status).toBe("shipped");
    await request.delete(`${API}/orders/${id}`);
  });

  test("TC-API-O-005 | DELETE /orders/:id removes it", async ({ request }) => {
    const { id } = await (
      await request.post(`${API}/orders`, {
        data: { userId: 1, items: [], total: 0, status: "pending" },
      })
    ).json();

    await request.delete(`${API}/orders/${id}`);
    const getRes = await request.get(`${API}/orders/${id}`);
    expect(getRes.status()).toBe(404);
  });
});

test.describe("Contacts API", () => {
  test("TC-API-C-001 | POST /contacts saves submission", async ({
    request,
  }) => {
    const res = await request.post(`${API}/contacts`, {
      data: {
        name: "Abhishek",
        email: "a@test.com",
        subject: "general",
        message: "Test.",
      },
    });
    expect(res.status()).toBe(201);
    const c = await res.json();
    expect(c.email).toBe("a@test.com");
    await request.delete(`${API}/contacts/${c.id}`);
  });

  test("TC-API-C-002 | GET /contacts returns list", async ({ request }) => {
    const res = await request.get(`${API}/contacts`);
    expect(res.status()).toBe(200);
    expect(Array.isArray(await res.json())).toBe(true);
  });
});
