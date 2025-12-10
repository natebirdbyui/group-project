import { setupNav } from "./navigation.js";
import { getTodayISO, setMinDate, setMinTime, isPastDate, isPastTime } from "./calendar.js";
import { setupBookingForm, setupModalElements, showModal } from "./modal.js";
import { applyServiceRules } from "./service_rules.js";
import { saveFormData, restoreSavedData, clearSavedData } from "./local_storage.js";
import { loadMenu, addDish, updateAllTotals, updateDishRow } from "./menu_manager.js";
import { showSlide } from "./slideshow.js";

//DOM Elements
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

//URL Parameters
const params = new URLSearchParams(window.location.search);
let service = params.get("service") || "";
const dishParam = params.get("dish") || "";
const preselectedDish = dishParam ? Number(dishParam) : null;

//Modal Setup
const modalEls = setupModalElements(
  document.querySelector("#booking-modal"),
  document.querySelector("#modal-message"),
  document.querySelector("#modal-ok"),
  document.querySelector("#close-modal")
);

//Initialize Dishes
async function initializeDishes(savedData) {
  await loadMenu(
    dishesContainer,
    savedData,
    (id) => addDish(dishesContainer, id, guestsInput, grandTotalEl),
    preselectedDish
  );
}

//Event Listeners
//---Autosave features
// Autosave on almost everything
function setupAutosave() {

  // Save any form field
  bookingForm.addEventListener("input", () => {
    saveFormData(bookingForm, dishesContainer);
  });

  bookingForm.addEventListener("change", () => {
    saveFormData(bookingForm, dishesContainer);
  });

  // Save dish select
  dishesContainer.addEventListener("change", e => {
    if (e.target.matches(".menu-item-select")) {
      updateDishRow(e.target.closest(".dish-row"), guestsInput, grandTotalEl);
      saveFormData(bookingForm, dishesContainer);
    }
  });

  // Save when rows are added / removed
  //mutation observer to catch all changes in dishes container
  const observer = new MutationObserver(() => {
    saveFormData(bookingForm, dishesContainer);
  });

  observer.observe(dishesContainer, { childList: true, subtree: true });

  // Save if user leaves page
  window.addEventListener("beforeunload", () => {
    saveFormData(bookingForm, dishesContainer);
  });
}

//When a dish select changes
dishesContainer.addEventListener("change", (e) => {
  if (e.target.matches(".menu-item-select")) {
    updateDishRow(e.target.closest(".dish-row"), guestsInput, grandTotalEl);
    saveFormData(bookingForm, dishesContainer);
  }
});

//more event listeners
guestsInput.addEventListener("input", () => {
  updateAllTotals(dishesContainer, guestsInput, grandTotalEl);
  dishesContainer.querySelectorAll(".dish-row").forEach(row => updateDishRow(row, guestsInput, grandTotalEl));
  saveFormData(bookingForm, dishesContainer);
});

addDishButton.addEventListener("click", () => {
  addDish(dishesContainer, null, guestsInput, grandTotalEl);
  saveFormData(bookingForm, dishesContainer);
});

//make sure to change window to modalElements
restartButton.addEventListener("click", () => {
  showModal(modalEls, "Restart booking? All selections will be lost!", () => {
    clearSavedData();
    bookingForm.reset();
    dishesContainer.querySelectorAll(".dish-row").forEach(row => row.remove());
    grandTotalEl.textContent = "0.00";
    addDish(dishesContainer, null, guestsInput, grandTotalEl);
  });
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
  saveFormData(bookingForm, dishesContainer);
});

//phone input: allow only digits
const phoneInput = document.querySelector("#phone");

phoneInput.addEventListener("input", () => {
  //Remove everything except digits
  let digits = phoneInput.value.replace(/\D/g, "").substring(0, 10);// Limit to 10 digits so no extra digits are entered
  let formatted = "";
  if (digits.length > 0) {
    formatted = "(" + digits.substring(0, 3);
  }
  if (digits.length >= 4) {
    formatted += ") " + digits.substring(3, 6);
  }
  if (digits.length >= 7) {
    formatted += "-" + digits.substring(6, 10);
  }
  phoneInput.value = formatted;
  saveFormData(bookingForm, dishesContainer);
});

phoneInput.addEventListener("invalid", () => {
  phoneInput.setCustomValidity("Phone number must contain 10 digits");
});

phoneInput.addEventListener("input", () => {
  phoneInput.setCustomValidity("");
});

//Add blur listener for past time also not allow user to enter past time if date is today
timeInput.addEventListener("blur", () => {
  if (dateInput.value === getTodayISO() && isPastTime(dateInput.value, timeInput.value)) {
    showModal(modalEls, "Event time cannot be in the past for the selected date. It has been reset to the current time.");
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    timeInput.value = `${hh}:${mm}`;
  }
});

//Initialization
document.addEventListener("DOMContentLoaded", async () => {
  setupAutosave();
  const savedData = restoreSavedData();


  //Load dishes etc.
  await initializeDishes(savedData);
  setMinDate(dateInput);
  setMinTime(dateInput, timeInput);

  // Restore other form inputs
  if (savedData.formData) {
  Object.keys(savedData.formData).forEach(name => {
    const input = bookingForm.querySelector(`[name="${name}"]`);
    if (input) input.value = savedData.formData[name];
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

