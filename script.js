
/* ==================================
   WHATSAPP NUMBER
================================== */

// Replace this with your WhatsApp number.
// Indonesian example: 081234567890 becomes 6281234567890.
// Do not include +, spaces, or dashes.

const whatsappNumber = "6281234567890";


/* ==================================
   PAGE NAVIGATION
================================== */

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");

function showPage(pageName) {
  pages.forEach(page => {
    page.classList.toggle("active", page.id === pageName);
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.page === pageName
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    showPage(link.dataset.page);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.go);
  });
});


/* ==================================
   MENU SELECTION
================================== */

let selectedProduct = "";

document.querySelectorAll("[data-product]").forEach(button => {
  button.addEventListener("click", () => {
    selectedProduct = button.dataset.product;

    const filling = document.querySelector("#filling");

    // Match the selected menu item to a filling.
    if (selectedProduct === "Oreo & Cream") {
      filling.value = "Oreo and cream";
    } else {
      filling.value = "Cream";
    }

    showPage("order");
    updateSummary();

    document.querySelector("#filling").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
});


/* ==================================
   ORDER SUMMARY
================================== */

const fillingInput = document.querySelector("#filling");
const quantityInput = document.querySelector("#quantity");

const summaryText = document.querySelector("#summary-text");
const sumQty = document.querySelector("#sum-qty");
const sumTotal = document.querySelector("#sum-total");

function getPrice() {
  const filling = fillingInput.value;

  if (filling === "Oreo and cream") {
    return 10000;
  }

  return 10000;
}

function updateSummary() {
  const quantity = Math.max(
    1,
    Number(quantityInput.value) || 1
  );

  const filling = fillingInput.value;
  const price = getPrice();
  const total = price * quantity;

  sumQty.textContent = quantity;

  sumTotal.textContent =
    "Rp " + total.toLocaleString("id-ID");

  if (filling) {
    summaryText.textContent =
      `${selectedProduct || filling} selected. ` +
      `Price: Rp ${price.toLocaleString("id-ID")} per serving.`;
  } else {
    summaryText.textContent =
      "Choose your filling and quantity to see your order summary.";
  }
}

fillingInput.addEventListener("change", () => {
  // Clear the menu selection if the customer changes filling manually.
  if (
    selectedProduct === "Oreo & Cream" &&
    fillingInput.value !== "Oreo and cream"
  ) {
    selectedProduct = "";
  }

  if (
    selectedProduct === "Classic Cream" &&
    fillingInput.value !== "Cream"
  ) {
    selectedProduct = "";
  }

  updateSummary();
});

quantityInput.addEventListener("input", updateSummary);


/* ==================================
   SEND ORDER TO WHATSAPP
================================== */

document.querySelector("#order-form").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const form = event.currentTarget;

    // Check all required fields.
    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);

    const name = data.get("name").trim();
    const contact = data.get("contact").trim();
    const filling = data.get("filling");
    const quantity = Number(data.get("quantity"));
    const payment = data.get("payment");
    const pickup = data.get("pickup");
    const notes = data.get("notes").trim() || "-";

    // Basic input checks.
    if (!Number.isInteger(quantity) || quantity < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    // Prices are per serving.
    const price = getPrice();
    const total = price * quantity;

    // Determine which product the customer selected.
    const productName = selectedProduct ||
      (filling === "Oreo and cream"
        ? "Oreo & Cream"
        : "Classic Cream");

    // Create the order message.
    const message = `
🫐 *NEW ORDER - BLUE BLOOM*

Hello! I would like to place an order.

👤 *CUSTOMER DETAILS*
Name: ${name}
Contact: ${contact}

🍰 *ORDER DETAILS*
Product: ${productName}
Filling: ${filling}
Quantity: ${quantity}
Price per serving: Rp ${price.toLocaleString("id-ID")}
Estimated total: Rp ${total.toLocaleString("id-ID")}

💳 *PAYMENT METHOD*
${payment}

📍 *PICKUP LOCATION*
${pickup}

📝 *ADDITIONAL NOTES*
${notes}

Please confirm my order. Thank you! ♡
`.trim();

    // Encode the message for WhatsApp.
    const encodedMessage = encodeURIComponent(message);

    // Open the WhatsApp chat with the order pre-filled.
    const whatsappURL =
      `https://wa.me/${6287743137481}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  }
);

/* ==================================
   CONTACT FORM - WHATSAPP
================================== */

document.querySelector("#contact-form").addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    if (!this.reportValidity()) {
      return;
    }

    const data = new FormData(this);

    const name = data.get("name").trim();
    const contact = data.get("contact").trim();
    const subject = data.get("subject");
    const customerMessage = data.get("message").trim();

    const message = `
🦭 *MARU CHI - CUSTOMER QUESTION*

Hello Maru Chi! I have a question.

👤 *Name:* ${name}
📱 *Contact:* ${contact}

📌 *Topic:* ${subject}

💬 *Message:*
${customerMessage}

Thank you!
    `.trim();

    const whatsappURL =
      `https://wa.me/${6287743137481}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
  }
);

/* ==================================
   INITIALIZE WEBSITE
================================== */

updateSummary();
