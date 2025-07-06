const products = [
  {
    id: 1,
    name: "Kaya's Digestive Care Juice",
    category: "Health Care",
    image: "images/products/1.png",
    variants: [
      { label: "250ml", price: 199 },
      { label: "500ml", price: 349 },
      { label: "1000ml", price: 1000 }
    ]
  },
  {
    id: 2,
    name: "Kaya's Extra Virgin Coconut Oil",
    category: "haircare",
    image: "images/products/2.png",
    variants: [
      { label: "150ml", price: 299 },
      { label: "300ml", price: 499 }
    ]
  },
  {
    id: 3, name: "Kaya's Seeraga Mittai", category: "Health Care", image: "images/products/3.png", variants: [{ label: "50g", price: 149 }]
  },
  {
    id: 4, name: "Kaya's Eco Scrub", category: "Home Care", image: "images/products/4.png", variants: [{ label: "50g", price: 149 }]
  },
  {
    id: 5, name: "Kaya's Natural Honey", category: "Health Care", image: "images/products/5.png", variants: [{ label: "50g", price: 149 }]
  },
  {
    id: 6, name: "Kaya's Karupu Kollu Idli Podi", category: "Health Care", image: "images/products/6.png", variants: [{ label: "50g", price: 149 }]
  },
  {
    id: 7, name: "Kaya's Weight Loss Mix", category: "Health Care", image: "images/products/7.png", variants: [{ label: "50g", price: 149 }]
  },
  {
    id: 8, name: "Kaya's Eco Scrub", category: "Home Care", image: "images/products/8.png", variants: [{ label: "50g", price: 149 }]
  }
];
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const DELIVERY_CHARGE = 50;
const VALID_COUPONS = { FLAT10: 10, FLAT50: 50 };
let cart = [];
let appliedDiscount = 0;
let appliedCoupon = "";
function loadCart() {
  const stored = localStorage.getItem("cart");
  if (stored) cart = JSON.parse(stored);
}
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function renderProducts() {
  const keyword = searchInput?.value.toLowerCase() || "";
  const category = categoryFilter?.value || "all";
  productList.innerHTML = "";
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(keyword) &&
    (category === "all" || p.category === category)
  );
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    const variantButtons = p.variants.map((variant, i) =>
      `<button onclick="addToCart(${p.id}, ${i})">${variant.label} - ₹${variant.price}</button>`
    ).join("");
    card.innerHTML = `
      <a href="product.html?id=${p.id}">
        <img src="${p.image}" alt="${p.name}">
      </a>
      <h3>${p.name}</h3>
      <div class="variant-buttons">${variantButtons}</div>
    `;
    productList.appendChild(card);
  });
}
function addToCart(productId, variantIndex) {
  const product = products.find(p => p.id === productId);
  const variant = product.variants[variantIndex];
  const existing = cart.find(item => item.id === productId && item.variant.label === variant.label);
  existing ? existing.quantity++ : cart.push({ id: productId, name: product.name, image: product.image, variant, quantity: 1 });
  updateCart();
}
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}
function clearCart() {
  if (!cart.length) return alert("Cart is already empty.");
  if (confirm("Clear the cart?")) {
    cart = [];
    appliedDiscount = 0;
    appliedCoupon = "";
    localStorage.removeItem("cart");
    updateCart();
  }
}
function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase();
  if (VALID_COUPONS[code]) {
    appliedCoupon = code;
    appliedDiscount = VALID_COUPONS[code];
    alert(`Coupon "${code}" applied! ₹${appliedDiscount} off.`);
  } else {
    alert("Invalid coupon code.");
    appliedCoupon = "";
    appliedDiscount = 0;
  }
  updateCart();
}
function updateCart() {
  saveCart();
  cartItems.innerHTML = "";
  let subtotal = 0;
  cart.forEach((item, index) => {
    const total = item.variant.price * item.quantity;
    subtotal += total;
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <span>${item.name} (${item.variant.label}) x${item.quantity} - ₹${total}</span>
      <button onclick="removeFromCart(${index})">✖</button>
    `;
    cartItems.appendChild(itemDiv);
  });
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  const finalTotal = subtotal + DELIVERY_CHARGE - appliedDiscount;
  const totalsDiv = document.createElement("div");
  totalsDiv.innerHTML = `
    <p><strong>Subtotal:</strong> ₹${subtotal}</p>
    <p><strong>Delivery:</strong> ₹${DELIVERY_CHARGE}</p>
    <p><strong>Discount (${appliedCoupon || "None"}):</strong> -₹${appliedDiscount}</p>
    <p><strong>Total:</strong> ₹${finalTotal}</p>
  `;
  cartItems.appendChild(totalsDiv);
}
function checkout() {
  if (!cart.length) return alert("Cart is empty!");
  const orderLines = cart.map(item =>
    `- ${item.name} (${item.variant.label}) x${item.quantity} = ₹${item.variant.price * item.quantity}`
  );
  const subtotal = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const total = subtotal + DELIVERY_CHARGE - appliedDiscount;
  const message = `🛒 *Order Details:*\n${orderLines.join("\n")}\n\nSubtotal: ₹${subtotal}\nDelivery: ₹${DELIVERY_CHARGE}\nDiscount: ₹${appliedDiscount}\n\n*Total: ₹${total}*`;
  window.open(`https://wa.me/917010615338?text=${encodeURIComponent(message)}`, "_blank");
}
const couponInput = document.createElement("input");
couponInput.type = "text";
couponInput.placeholder = "Enter Coupon Code";
couponInput.style.margin = "10px 0";
couponInput.style.padding = "6px";
couponInput.style.width = "100%";
const applyBtn = document.createElement("button");
applyBtn.textContent = "Apply Coupon";
applyBtn.style.margin = "10px 0";
applyBtn.onclick = applyCoupon;
cartDrawer.insertBefore(couponInput, checkoutBtn);
cartDrawer.insertBefore(applyBtn, checkoutBtn);
searchInput?.addEventListener("input", renderProducts);
categoryFilter?.addEventListener("change", renderProducts);
cartBtn.addEventListener("click", () => cartDrawer.classList.toggle("open"));
checkoutBtn.addEventListener("click", checkout);
clearCartBtn.addEventListener("click", clearCart);
loadCart();
renderProducts();
updateCart();
document.addEventListener("DOMContentLoaded", () => {
  const starContainer = document.getElementById("starRating");
  const ratingInput = document.getElementById("rating");
  const stars = starContainer.querySelectorAll("span");
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const value = parseInt(star.getAttribute("data-value"));
      ratingInput.value = value;
      updateStars(value);
    });
  });
  function updateStars(value) {
    stars.forEach(star => {
      const starValue = parseInt(star.getAttribute("data-value"));
      if (starValue <= value) {
        star.classList.add("selected");
      } else {
        star.classList.remove("selected");
      }
    });
  }
  document.getElementById("feedbackForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const rating = document.getElementById("rating").value;
    const message = document.getElementById("message").value.trim();
    if (!name || !rating || !message) {
      alert("Please fill out all fields and select a rating.");
      return;
    }
    const whatsappNumber = "917094983311"; // Your WhatsApp number in international format
    const text = `🌿 *New Feedback for Kaya's!* 🌿\n\n👤 Name: ${name}\n⭐ Rating: ${rating}/5\n💬 Message: ${message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const reviews = [
    {
      name: "Aarthi S.",
      rating: 5,
      message: "Kaya's Digestive Juice really improved my health! 100% natural and effective."
    },
    {
      name: "Ravi Kumar",
      rating: 4,
      message: "Hair oil from Kaya is amazing. Saw results in just two weeks. Highly recommended."
    },
    {
      name: "Deepa M.",
      rating: 5,
      message: "Loved the packaging and the herbal face pack. Feels pure and refreshing!"
    },
    {
      name: "Tharun Raj",
      rating: 4,
      message: "Delivery was fast, and the product quality is top notch. Will reorder!"
    }
  ];
  const reviewList = document.getElementById("reviewList");
  reviews.forEach(review => {
    const card = document.createElement("div");
    card.className = "review-card";
    const author = document.createElement("div");
    author.className = "review-author";
    author.textContent = review.name;
    const stars = document.createElement("div");
    stars.className = "review-stars";
    stars.innerHTML = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    const message = document.createElement("p");
    message.className = "review-text";
    message.textContent = review.message;
    card.appendChild(author);
    card.appendChild(stars);
    card.appendChild(message);
    reviewList.appendChild(card);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const seoData = {
    title: "Kaya - Health Care Store",
    description: "Discover Kaya's quality health care products made with natural ingredients.",
    image: "https://www.kayas.co.in/images/logo/2.png",
    url: "https://www.kayas.co.in/",
    siteName: "Kaya Health Care",
    twitterHandle: "@kayahealthcare"
  };
  document.title = seoData.title;
  setMeta("name", "description", seoData.description);
  setMeta("name", "keywords", "health care, wellness, herbal, organic, Kaya");
  setMeta("name", "author", seoData.siteName);
  setMeta("link", "canonical", seoData.url);
  setMeta("property", "og:title", seoData.title);
  setMeta("property", "og:description", seoData.description);
  setMeta("property", "og:image", seoData.image);
  setMeta("property", "og:url", seoData.url);
  setMeta("property", "og:type", "website");
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", seoData.title);
  setMeta("name", "twitter:description", seoData.description);
  setMeta("name", "twitter:image", seoData.image);
  setMeta("name", "twitter:site", seoData.twitterHandle);
  function setMeta(attr, name, content) {
    let tag;
    if (attr === "link") {
      tag = document.querySelector(`link[rel="${name}"]`);
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("href", content);
    } else {
      tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    }
  }
});
let prevScrollPos = window.pageYOffset;
const navbar = document.getElementById("navbar");
window.onscroll = function () {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos) {
    navbar.style.top = "0";
  } else {
    navbar.style.top = "-100px";
  }
  prevScrollPos = currentScrollPos;
};
document.getElementById('feedbackForm').addEventListener('submit', function (e) {
  e.preventDefault();
});