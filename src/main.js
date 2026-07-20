// ===== ShopEasy – Main App =====
// Vanilla JS SPA for QA demo purposes

const VALID_USER = { email: "test@shopeasy.com", password: "Test@1234" };
let cart = [];
let isLoggedIn = false;

const products = [
  { id: 1, name: "Wireless Headphones", price: 1999, category: "Electronics" },
  { id: 2, name: "Running Shoes", price: 3499, category: "Footwear" },
  { id: 3, name: "Yoga Mat", price: 799, category: "Fitness" },
  { id: 4, name: "Coffee Mug", price: 349, category: "Kitchen" },
  { id: 5, name: "Desk Lamp", price: 1299, category: "Home" },
  { id: 6, name: "Notebook Set", price: 499, category: "Stationery" },
];

// ---- Router ----
function navigate(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.add("active");
  updateNav();
}

function updateNav() {
  const cartBadge = document.getElementById("cart-count");
  if (cartBadge) cartBadge.textContent = cart.length;
  const authLink = document.getElementById("nav-auth");
  if (authLink) authLink.textContent = isLoggedIn ? "Logout" : "Login";
}

// ---- Login ----
function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    let valid = true;

    if (!email) {
      showError("email-error", "Email is required");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showError("email-error", "Enter a valid email");
      valid = false;
    }
    if (!password) {
      showError("password-error", "Password is required");
      valid = false;
    }

    if (!valid) return;

    if (email === VALID_USER.email && password === VALID_USER.password) {
      isLoggedIn = true;
      showAlert("login-alert", "Login successful! Redirecting…", "success");
      setTimeout(() => navigate("products"), 1000);
    } else {
      showAlert("login-alert", "Invalid email or password.", "error");
    }
  });
}

// ---- Products ----
function initProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = products
    .map(
      (p) => `
    <div class="product-card" data-testid="product-${p.id}">
      <h3 data-testid="product-name">${p.name}</h3>
      <span class="price" data-testid="product-price">₹${p.price.toLocaleString("en-IN")}</span>
      <small style="color:var(--muted)">${p.category}</small>
      <button class="btn btn-primary btn-sm" data-testid="add-to-cart-${p.id}"
        onclick="addToCart(${p.id})">Add to Cart</button>
    </div>`,
    )
    .join("");
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  updateNav();
  showToast(`${product.name} added to cart`);
}

window.addToCart = addToCart;

// ---- Cart ----
function initCart() {}

function renderCart() {
  const tbody = document.getElementById("cart-body");
  const emptyMsg = document.getElementById("cart-empty");
  const cartTable = document.getElementById("cart-table-wrap");
  if (!tbody) return;
  if (cart.length === 0) {
    emptyMsg && (emptyMsg.style.display = "block");
    cartTable && (cartTable.style.display = "none");
    return;
  }
  emptyMsg && (emptyMsg.style.display = "none");
  cartTable && (cartTable.style.display = "block");
  tbody.innerHTML = cart
    .map(
      (item) => `
    <tr data-testid="cart-item-${item.id}">
      <td>${item.name}</td>
      <td>₹${item.price.toLocaleString("en-IN")}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="changeQty(${item.id}, -1)">–</button>
        <span data-testid="qty-${item.id}" style="margin:0 0.5rem">${item.qty}</span>
        <button class="btn btn-outline btn-sm" onclick="changeQty(${item.id}, 1)">+</button>
      </td>
      <td>₹${(item.price * item.qty).toLocaleString("en-IN")}</td>
      <td><button class="btn btn-danger btn-sm" data-testid="remove-${item.id}" onclick="removeFromCart(${item.id})">Remove</button></td>
    </tr>`,
    )
    .join("");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("cart-total").textContent =
    `₹${total.toLocaleString("en-IN")}`;
}

function changeQty(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((c) => c.id !== id);
  updateNav();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  updateNav();
  renderCart();
}

function clearCart() {
  cart = [];
  updateNav();
  renderCart();
}

window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;

// ---- Contact Form ----
function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    const name = document.getElementById("c-name").value.trim();
    const email = document.getElementById("c-email").value.trim();
    const subject = document.getElementById("c-subject").value;
    const message = document.getElementById("c-message").value.trim();
    let valid = true;

    if (!name) {
      showError("c-name-error", "Name is required");
      valid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showError("c-email-error", "Valid email required");
      valid = false;
    }
    if (!subject) {
      showError("c-subject-error", "Please select a subject");
      valid = false;
    }
    if (message.length < 20) {
      showError("c-msg-error", "Message must be at least 20 characters");
      valid = false;
    }

    if (valid)
      showAlert(
        "contact-alert",
        "Your message has been sent successfully!",
        "success",
      );
  });
}

// ---- Helpers ----
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.classList.add("show");
  }
}

function clearErrors() {
  document
    .querySelectorAll(".error-msg")
    .forEach((el) => el.classList.remove("show"));
  document
    .querySelectorAll(".alert")
    .forEach((el) => el.classList.remove("show"));
}

function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
}

function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText =
    "position:fixed;bottom:1.5rem;right:1.5rem;background:#1e293b;color:#fff;padding:.75rem 1.25rem;border-radius:.5rem;font-size:.875rem;z-index:9999;opacity:1;transition:opacity .5s";
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 500);
  }, 2000);
}

// ---- Bootstrap ----
function boot() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <nav>
      <h1>🛒 ShopEasy</h1>
      <div>
        <a href="#" onclick="navigate('products')">Products</a>
        <a href="#" onclick="navigate('cart'); renderCart()">Cart <span class="badge" id="cart-count">0</span></a>
        <a href="#" onclick="navigate('contact')">Contact</a>
        <a href="#" id="nav-auth" onclick="handleAuth()">Login</a>
      </div>
    </nav>
    <main>

      <!-- Login Page -->
      <div class="page active" id="page-login">
        <div class="auth-card">
          <h2>Sign In</h2>
          <div class="alert" id="login-alert"></div>
          <form id="login-form" data-testid="login-form" novalidate>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" data-testid="email-input" placeholder="you@example.com" autocomplete="email" />
              <span class="error-msg" id="email-error"></span>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" data-testid="password-input" placeholder="••••••••" autocomplete="current-password" />
              <span class="error-msg" id="password-error"></span>
            </div>
            <button type="submit" class="btn btn-primary" data-testid="login-btn">Sign In</button>
          </form>
          <p style="text-align:center;margin-top:1rem;font-size:.8rem;color:var(--muted)">
            Demo: test@shopeasy.com / Test@1234
          </p>
        </div>
      </div>

      <!-- Products Page -->
      <div class="page" id="page-products">
        <h2>Our Products</h2>
        <div class="product-grid" id="product-grid" data-testid="product-grid"></div>
      </div>

      <!-- Cart Page -->
      <div class="page" id="page-cart">
        <h2>Shopping Cart</h2>
        <p id="cart-empty" style="display:none;color:var(--muted)">Your cart is empty.</p>
        <div id="cart-table-wrap" style="display:none">
          <table class="cart-table" data-testid="cart-table">
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
            <tbody id="cart-body"></tbody>
          </table>
          <div class="cart-total">Total: <span id="cart-total" data-testid="cart-total">₹0</span></div>
          <div class="cart-actions">
            <button class="btn btn-outline" onclick="clearCart()">Clear Cart</button>
            <button class="btn btn-primary" data-testid="checkout-btn" onclick="showAlert('checkout-msg','Order placed successfully! 🎉','success'); clearCart()">Checkout</button>
          </div>
          <div class="alert" id="checkout-msg" style="margin-top:1rem"></div>
        </div>
      </div>

      <!-- Contact Page -->
      <div class="page" id="page-contact">
        <h2>Contact Us</h2>
        <div class="alert" id="contact-alert"></div>
        <form id="contact-form" data-testid="contact-form" class="contact-form" novalidate>
          <div class="form-group">
            <label for="c-name">Full Name</label>
            <input type="text" id="c-name" data-testid="contact-name" placeholder="Your name" />
            <span class="error-msg" id="c-name-error"></span>
          </div>
          <div class="form-group">
            <label for="c-email">Email</label>
            <input type="email" id="c-email" data-testid="contact-email" placeholder="you@example.com" />
            <span class="error-msg" id="c-email-error"></span>
          </div>
          <div class="form-group">
            <label for="c-subject">Subject</label>
            <select id="c-subject" data-testid="contact-subject">
              <option value="">-- Select a subject --</option>
              <option value="order">Order Issue</option>
              <option value="return">Return / Refund</option>
              <option value="general">General Enquiry</option>
            </select>
            <span class="error-msg" id="c-subject-error"></span>
          </div>
          <div class="form-group">
            <label for="c-message">Message</label>
            <textarea id="c-message" data-testid="contact-message" rows="5" placeholder="Describe your issue…"></textarea>
            <span class="error-msg" id="c-msg-error"></span>
          </div>
          <button type="submit" class="btn btn-primary" data-testid="contact-submit">Send Message</button>
        </form>
      </div>

    </main>`;

  initLogin();
  initProducts();
  initContact();
  updateNav();
}

function handleAuth() {
  if (isLoggedIn) {
    isLoggedIn = false;
    cart = [];
    updateNav();
    navigate("login");
  } else {
    navigate("login");
  }
}
window.handleAuth = handleAuth;
window.navigate = navigate;
window.renderCart = renderCart;

boot();
