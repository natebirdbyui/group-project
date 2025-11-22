// DOM Elements
const bookingForm = document.querySelector("#booking-form");
const menuSelect = document.querySelector("#menu-item");
const dishesContainer = document.querySelector("#dishes-container");
const addDishButton = document.querySelector("#add-dish-btn");
const restartButton = document.querySelector("#restart-booking-btn");
const guestsInput = document.querySelector("#guests");
const grandTotalEl = document.getElementById("grand-total");
const menuDetails = document.querySelector("#menu-details");
const menuImage = document.querySelector("#menu-image");
const menuName = document.querySelector("#menu-name");
const menuDescription = document.querySelector("#menu-description");
const menuServings = document.querySelector("#menu-servings");
const traysInfo = document.querySelector("#trays-needed");

// URL Parameter for preselecting dish
const params = new URLSearchParams(window.location.search);
const preselectedId = parseInt(params.get("id"));

let menuData = [];
let dishCount = 0;
let savedData = {};

// Load menu.json
async function loadMenu() {
  try {
    const response = await fetch("js/menu.json");
    const data = await response.json();
    menuData = data.menu;

    // Populate first dish select
    menuData.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} (${item.category})`;
      menuSelect.appendChild(option);
    });

    // Restore saved data
    savedData = JSON.parse(localStorage.getItem("bookingData")) || {};
    restoreSavedData();

    // Preselect URL param dish if no saved dishes
    if (preselectedId && (!savedData.dishes || savedData.dishes.length === 0)) {
      menuSelect.value = preselectedId;
      updateFirstDish();
    }

  } catch (error) {
    console.error("Error loading menu data:", error);
  }
}

// Update first dish photo/details
function updateFirstDish() {
  const selectedItem = menuData.find(item => item.id === parseInt(menuSelect.value));
  if (!selectedItem) {
    menuDetails.style.display = "none";
    return;
  }
  menuDetails.style.display = "block";
  menuImage.src = selectedItem.image;
  menuImage.alt = selectedItem.name;
  menuName.textContent = selectedItem.name;
  menuDescription.textContent = selectedItem.description;
  menuServings.textContent = selectedItem.servings;

  updateAllTotals();
}

// Add a dynamic dish row
function addDish(preselectId = null) {
  dishCount++;
  const row = document.createElement("div");
  row.classList.add("dish-row");
  row.dataset.row = dishCount;

  row.innerHTML = `
    <label>Dish ${dishCount}:</label>
    <select class="menu-item-select" required>
      <option value="" disabled selected>Select a dish</option>
    </select>
    <button type="button" class="remove-dish-btn">Remove</button>
    <div class="menu-details" style="display:none;">
      <img class="menu-image" alt="Dish Image"/>
      <h3 class="menu-name"></h3>
      <p class="menu-description"></p>
      <p><strong>Servings:</strong> <span class="menu-servings"></span></p>
      <p><strong>Price per Serving:</strong> $<span class="menu-price"></span></p>
    </div>
    <p><strong>Price per Serving:</strong> $<span class="price-per-serving">0.00</span></p>
    <p><strong>Total for this Dish:</strong> $<span class="estimated-total">0.00</span></p>
  `;

  dishesContainer.appendChild(row);

  const select = row.querySelector(".menu-item-select");
  menuData.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} (${item.category})`;
    select.appendChild(option);
  });

  if (preselectId) select.value = preselectId;

  select.addEventListener("change", () => updateDishRow(row));
  row.querySelector(".remove-dish-btn").addEventListener("click", () => {
    row.remove();
    updateAllTotals();
    saveFormData();
  });

  updateDishRow(row);
}

// Update a single dynamic dish row
function updateDishRow(row) {
  const select = row.querySelector(".menu-item-select");
  const selectedItem = menuData.find(item => item.id === parseInt(select.value));
  const priceEl = row.querySelector(".price-per-serving");
  const totalEl = row.querySelector(".estimated-total");
  const menuDetails = row.querySelector(".menu-details");
  const guests = parseInt(guestsInput.value || 0);

  if (!selectedItem) {
    if (menuDetails) menuDetails.style.display = "none";
    priceEl.textContent = "0.00";
    totalEl.textContent = "0.00";
    updateAllTotals();
    return;
  }

  // Show details
  menuDetails.style.display = "block";
  row.querySelector(".menu-image").src = selectedItem.image;
  row.querySelector(".menu-image").alt = selectedItem.name;
  row.querySelector(".menu-name").textContent = selectedItem.name;
  row.querySelector(".menu-description").textContent = selectedItem.description;
  row.querySelector(".menu-servings").textContent = selectedItem.servings;
  row.querySelector(".menu-price").textContent = selectedItem.price_per_serving.toFixed(2);

  priceEl.textContent = selectedItem.price_per_serving.toFixed(2);

  const traysNeeded = guests > 0 ? Math.ceil(guests / selectedItem.servings) : 0;
  totalEl.textContent = (traysNeeded * selectedItem.servings * selectedItem.price_per_serving).toFixed(2);

  updateAllTotals();
}

// Update totals for first + dynamic dishes
function updateAllTotals() {
  const guests = parseInt(guestsInput.value || 0);
  let total = 0;

  // First dish
  const firstItem = menuData.find(item => item.id === parseInt(menuSelect.value));
  if (firstItem) {
    const trays = guests > 0 ? Math.ceil(guests / firstItem.servings) : 0;
    total += trays * firstItem.servings * firstItem.price_per_serving;
    traysInfo.textContent = trays > 0 ? `${trays} tray(s) needed` : "";
  }

  // Dynamic dishes
  document.querySelectorAll(".dish-row").forEach(row => {
    const select = row.querySelector(".menu-item-select");
    const item = menuData.find(i => i.id === parseInt(select.value));
    if (item) {
      const trays = guests > 0 ? Math.ceil(guests / item.servings) : 0;
      total += trays * item.servings * item.price_per_serving;
      row.querySelector(".estimated-total").textContent = (trays * item.servings * item.price_per_serving).toFixed(2);
    }
  });

  grandTotalEl.textContent = total.toFixed(2);
}

// Save form data to localStorage
function saveFormData() {
  const formData = {};
  new FormData(bookingForm).forEach((value, key) => (formData[key] = value));

  // Save first dish
  formData.firstDish = parseInt(menuSelect.value) || null;

  // Save dynamic dishes
  formData.dishes = [];
  document.querySelectorAll(".dish-row").forEach(row => {
    const select = row.querySelector(".menu-item-select");
    if (select.value) formData.dishes.push(parseInt(select.value));
  });

  localStorage.setItem("bookingData", JSON.stringify(formData));
}

// Restore saved form data
function restoreSavedData() {
  savedData = JSON.parse(localStorage.getItem("bookingData")) || {};

  for (const [key, value] of Object.entries(savedData)) {
    const field = bookingForm.querySelector(`[name="${key}"]`);
    if (field) field.value = value;
  }

  if (savedData.firstDish) {
    menuSelect.value = savedData.firstDish;
    updateFirstDish();
  }

  if (savedData.dishes && savedData.dishes.length > 0) {
    savedData.dishes.forEach(id => addDish(id));
  }
}

// Listeners
menuSelect.addEventListener("change", () => {
  updateFirstDish();
  saveFormData();
});

guestsInput.addEventListener("input", () => {
  updateAllTotals();
  saveFormData();
});

addDishButton.addEventListener("click", () => addDish());

bookingForm.addEventListener("input", saveFormData);

restartButton.addEventListener("click", () => {
  const confirmRestart = window.confirm(
    "Are you sure you want to restart the booking? All current selections will be lost!"
  );
  if (!confirmRestart) return;

  bookingForm.reset();
  document.querySelectorAll(".dish-row").forEach(row => row.remove());
  addDish();
  menuDetails.style.display = "none";
  grandTotalEl.textContent = "0.00";
  traysInfo.textContent = "";
  localStorage.removeItem("bookingData");
});

bookingForm.addEventListener("submit", e => {
  e.preventDefault();
  alert("Booking submitted! Thank you. It will be our pleasure to serve you.");
  bookingForm.reset();
  document.querySelectorAll(".dish-row").forEach(row => row.remove());
  addDish();
  menuDetails.style.display = "none";
  grandTotalEl.textContent = "0.00";
  traysInfo.textContent = "";
  localStorage.removeItem("bookingData");
});

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadMenu();
  restoreSavedData();
});

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});