import { getTodayISO, setMinDate, setMinTime, isPastDate, isPastTime } from "./calendar.js";
import { showModal, setupBookingForm } from "./modal.js";
import { applyServiceRules } from "./service_rules.js";
import { saveFormData, restoreSavedData, clearSavedData } from "./local_storage.js";
import { loadMenu, addDish, updateAllTotals, updateDishRow } from "./menu_manager.js";

// DOM Elements
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

// URL Parameters
const params = new URLSearchParams(window.location.search);
let service = params.get("service") || "";
let preselectedDish = parseInt(params.get("dish")) || null;

// Listeners
guestsInput.addEventListener("input", () => {
  updateAllTotals();
  document.querySelectorAll(".dish-row").forEach(row => updateDishRow(row));
  saveFormData();
});

addDishButton.addEventListener("click", () => addDish());
bookingForm.addEventListener("input", saveFormData);

restartButton.addEventListener("click", () => {
  if (!window.confirm("Restart booking? All selections will be lost!")) return;

  // Clear localStorage and in-memory saved data
  localStorage.removeItem("bookingData");
  savedData = {};

  // Reset form
  bookingForm.reset();

  // Remove all existing dish rows
  document.querySelectorAll(".dish-row").forEach(row => row.remove());

  // Reset totals
  grandTotalEl.textContent = "0.00";

  // Add a fresh blank dish row
  addDish();
});

// --- Initialize ---
document.addEventListener("DOMContentLoaded", async () => {
  // Load menu and restore saved dishes or preselected dish
  const savedData = JSON.parse(localStorage.getItem("bookingData")) || {};
  await loadMenu(dishesContainer, savedData, (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl), preselectedDish);

  // Set date & time minimums
  setMinDate(dateInput);
  setMinTime(dateInput, timeInput);

  // Restore saved form inputs
  restoreSavedData((id) => addDish(dishesContainer, id, guestsInput, grandTotalEl));

  // Apply service rules if service URL param exists
  if (service === "private" || service === "catering") {
    sessionSelect.value = service;
    applyServiceRules(service, bookingForm, dishesContainer, addDishButton, bookingHeader, guestsInput, (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl));
  }

  // Setup booking form validation and submission
  setupBookingForm(bookingForm, guestsInput, dateInput, timeInput, (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl), grandTotalEl, service);
});

// --- Event Listeners ---

// Service type change
sessionSelect.addEventListener("change", () => {
  service = sessionSelect.value;
  applyServiceRules(service, bookingForm, dishesContainer, addDishButton, bookingHeader, guestsInput, (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl));
});

// Add dish button
addDishButton.addEventListener("click", () => addDish(dishesContainer, null, guestsInput, grandTotalEl));

// Guests input changes
guestsInput.addEventListener("input", () => {
  updateAllTotals(dishesContainer, guestsInput, grandTotalEl);
  dishesContainer.querySelectorAll(".dish-row").forEach(row => updateDishRow(row, guestsInput, grandTotalEl));
  saveFormData();
});

// Auto-save booking form changes
bookingForm.addEventListener("input", saveFormData);

// Restart booking
restartButton.addEventListener("click", () => {
  if (!window.confirm("Restart booking? All selections will be lost!")) return;

  clearSavedData();
  bookingForm.reset();
  dishesContainer.querySelectorAll(".dish-row").forEach(row => row.remove());
  grandTotalEl.textContent = "0.00";
  addDish(dishesContainer, null, guestsInput, grandTotalEl);
});
