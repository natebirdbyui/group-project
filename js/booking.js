// Fields and containers and added buttons
const bookingForm = document.querySelector("#booking-form");
const guestsInput = document.querySelector("#guests");
const dishesContainer = document.querySelector("#dishes-container") || bookingForm;
const addDishButton = document.querySelector("#add-dish-btn"); // optional add dish button
const restartButton = document.querySelector("#restart-booking-btn"); // optional restart button
const grandTotalEl = document.getElementById("grand-total");

// URL Parameter for preselecting dish
const params = new URLSearchParams(window.location.search);
const preselectedId = parseInt(params.get("id"));

let menuData = [];
let dishCount = 0;

// Load menu data from menu.json
async function loadMenu() {
  try {
    const response = await fetch("js/menu.json");
    const data = await response.json();
    menuData = data.menu;

    // If URL param exists, add it as a dish
    if (preselectedId) {
      addDish(preselectedId);
    } else {
      addDish();
    }
  } catch (error) {
    console.error("Error loading menu data:", error);
  }
}

// Add a new dish row
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
    <p><strong>Total for this Dish:</strong> $<span class="estimated-total">0.00</span></p>
  `;

  dishesContainer.appendChild(row);

  const select = row.querySelector(".menu-item-select");
  menuData.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} (${item.category})`;
    option.dataset.price = item.price_per_serving;
    select.appendChild(option);
  });

  if (preselectId) select.value = preselectId;

  // Dish selection listener
  select.addEventListener("change", () => {
    updateDishRow(row);
    saveFormData();
  });

  // Remove dish listener
  row.querySelector(".remove-dish-btn").addEventListener("click", () => {
    row.remove();
    updateGrandTotal();
    saveFormData();
  });

  updateDishRow(row);
}

//Update a single dish row
function updateDishRow(row) {
  const select = row.querySelector(".menu-item-select");
  const selectedItem = menuData.find(item => item.id === parseInt(select.value));
  const menuDetails = row.querySelector(".menu-details");
  const totalEl = row.querySelector(".estimated-total");
  const guests = parseInt(guestsInput.value || 0);

  if (!selectedItem) {
    menuDetails.style.display = "none";
    totalEl.textContent = "0.00";
    updateGrandTotal();
    return;
  }

  //Fill dish details
  menuDetails.style.display = "block";
  row.querySelector(".menu-image").src = selectedItem.image;
  row.querySelector(".menu-image").alt = selectedItem.name;
  row.querySelector(".menu-name").textContent = selectedItem.name;
  row.querySelector(".menu-description").textContent = selectedItem.description;
  row.querySelector(".menu-servings").textContent = selectedItem.servings;
  row.querySelector(".menu-price").textContent = selectedItem.price_per_serving.toFixed(2);

  //Total for this dish
  const traysNeeded = guests > 0 ? Math.ceil(guests / selectedItem.servings) : 0;
  totalEl.textContent = (traysNeeded * selectedItem.servings * selectedItem.price_per_serving).toFixed(2);

  updateGrandTotal();
}

//Update all dish rows
function updateAllDishes() {
  const rows = document.querySelectorAll(".dish-row");
  rows.forEach(row => updateDishRow(row));
}

//Update grand total
function updateGrandTotal() {
  const rows = document.querySelectorAll(".dish-row");
  const guests = parseInt(guestsInput.value || 0);
  let total = 0;

  rows.forEach(row => {
    const select = row.querySelector(".menu-item-select");
    const selectedItem = menuData.find(item => item.id === parseInt(select.value));
    if (!selectedItem || guests <= 0) return;

    const traysNeeded = Math.ceil(guests / selectedItem.servings);
    total += traysNeeded * selectedItem.servings * selectedItem.price_per_serving;
  });

  if (grandTotalEl) grandTotalEl.textContent = total.toFixed(2);
}

//Save form data to localStorage
function saveFormData() {
  const formData = {};
  new FormData(bookingForm).forEach((value, key) => {
    formData[key] = value;
  });

  //Save selected dishes
  formData.dishes = [];
  document.querySelectorAll(".dish-row").forEach(row => {
    const select = row.querySelector(".menu-item-select");
    if (select.value) formData.dishes.push(parseInt(select.value));
  });

  localStorage.setItem("bookingData", JSON.stringify(formData));
}

//Restore saved data
function restoreSavedData() {
  const savedData = JSON.parse(localStorage.getItem("bookingData")) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = bookingForm.querySelector(`[name="${key}"]`);
    if (field) field.value = value;
  }

  //Restore dishes
  if (savedData.dishes && savedData.dishes.length > 0) {
    document.querySelectorAll(".dish-row").forEach(row => row.remove()); // clear
    savedData.dishes.forEach(id => addDish(id));
  }

  updateAllDishes();
}

//Guest input listener
guestsInput.addEventListener("input", () => {
  updateAllDishes();
  saveFormData();
});

// Form input listener
bookingForm.addEventListener("input", saveFormData);

// Form submission
bookingForm.addEventListener("submit", e => {
  e.preventDefault();
  alert("Booking submitted! Thank you. It will be our pleasure to serve you.");
  localStorage.removeItem("bookingData");
  bookingForm.reset();
  document.querySelectorAll(".dish-row").forEach(row => row.remove());
  addDish();
  if (grandTotalEl) grandTotalEl.textContent = "0.00";
});

// Add dish button
if (addDishButton) {
  addDishButton.addEventListener("click", () => addDish());
}

// Restart booking button
if (restartButton) {
  restartButton.addEventListener("click", () => {
    const confirmRestart = window.confirm(
      "Are you sure you want to restart the booking? All current selections will be lost!"
    );
    if (!confirmRestart) return; // if user cancels, do nothing

    bookingForm.reset();
    document.querySelectorAll(".dish-row").forEach(row => row.remove());
    addDish();
    if (grandTotalEl) grandTotalEl.textContent = "0.00";
    localStorage.removeItem("bookingData");
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadMenu();
  restoreSavedData();
});
