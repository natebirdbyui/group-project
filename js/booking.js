import { setupNav } from "./navigation.js";
import { getTodayISO, setMinDate, setMinTime, isPastDate, isPastTime } from "./calendar.js";
import { setupBookingForm, setupModalElements, showModal } from "./modal.js";
import { applyServiceRules } from "./service_rules.js";
import { saveFormData, restoreSavedData, clearSavedData } from "./local_storage.js";
import { loadMenu, addDish, updateAllTotals, updateDishRow } from "./menu_manager.js";

// --- DOM Elements ---
const bookingForm = document.querySelector("#booking-form");
const dateInput = document.querySelector("#event-date");
const timeInput = document.querySelector("#event-time");
const dishesContainer = document.querySelector("#dishes-container");
const addDishButton = document.querySelector("#add-dish-btn");
const restartButton = document.querySelector("#restart-booking-btn");
const guestsInput = document.querySelector("#guests");
const grandTotalEl = document.getElementById("grand-total");
const sessionSelect = document.getElementById("typeSession");
const bookingHeader = document.querySelector("#booking-section h2");

// --- URL Parameters ---
const params = new URLSearchParams(window.location.search);
let service = params.get("service") || "";
const dishParam = params.get("dish") || "";
const preselectedDish = dishParam ? Number(dishParam) : null;

// --- Modal Setup ---
const modalEls = setupModalElements(
  document.querySelector("#booking-modal"),
  document.querySelector("#modal-message") || document.createElement("p"),
  document.querySelector("#modal-ok") || document.createElement("button"),
  document.querySelector("#close-modal") || document.createElement("span")
);

// --- Initialize Dishes ---
async function initializeDishes(savedData) {
  await loadMenu(
    dishesContainer,
    savedData,
    (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl),
    preselectedDish
  );
}

// --- Event Listeners ---
guestsInput.addEventListener("input", () => {
  updateAllTotals(dishesContainer, guestsInput, grandTotalEl);
  dishesContainer.querySelectorAll(".dish-row").forEach(row => updateDishRow(row, guestsInput, grandTotalEl));
  saveFormData(bookingForm, dishesContainer);
});

addDishButton.addEventListener("click", () => addDish(dishesContainer, null, guestsInput, grandTotalEl));

restartButton.addEventListener("click", () => {
  if (!window.confirm("Restart booking? All selections will be lost!")) return;

  clearSavedData();
  bookingForm.reset();
  dishesContainer.querySelectorAll(".dish-row").forEach(row => row.remove());
  grandTotalEl.textContent = "0.00";
  addDish(dishesContainer, null, guestsInput, grandTotalEl);
});

sessionSelect.addEventListener("change", () => {
  service = sessionSelect.value;
  applyServiceRules(
    service,
    bookingForm,
    dishesContainer,
    addDishButton,
    bookingHeader,
    guestsInput,
    (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl)
  );
});

// --- Initialization ---
document.addEventListener("DOMContentLoaded", async () => {
  const savedData = restoreSavedData();

  // Load dishes etc.
  await initializeDishes(savedData);
  setMinDate(dateInput);
  setMinTime(dateInput, timeInput);

  // Restore other form inputs
  if (savedData) {
    Object.keys(savedData).forEach(key => {
      const input = bookingForm.querySelector(`[name="${key}"]`);
      if (input) input.value = savedData[key];
    });
  }

  // Apply service rules if needed
  if (service === "private" || service === "catering") {
    sessionSelect.value = service;
    applyServiceRules(
      service,
      bookingForm,
      dishesContainer,
      addDishButton,
      bookingHeader,
      guestsInput,
      (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl)
    );
  }

  // Setup booking form submission
  setupBookingForm(
    bookingForm,
    guestsInput,
    dateInput,
    timeInput,
    (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl),
    grandTotalEl,
    service,
    modalEls,
    dishesContainer
  );

  // Only call setupNav once here
  setupNav();

  console.log("Booking.js initialized. Preselected dish:", preselectedDish);
});

