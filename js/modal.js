// Setup modal elements
export function setupModalElements(modalEl, messageEl, okBtn, closeBtn) {
  return { modalEl, messageEl, okBtn, closeBtn };
}

// Show modal with message and optional callback
export function showModal(modalElements, message, callback = null) {
  const { modalEl, messageEl, okBtn, closeBtn } = modalElements;

  messageEl.textContent = message;
  modalEl.style.display = "flex";

  function closeModal() {
    modalEl.style.display = "none";
    removeListeners();
    if (callback) callback();
  }

  function handleOutsideClick(e) {
    if (e.target === modalEl) closeModal();
  }

  function removeListeners() {
    okBtn.removeEventListener("click", closeModal);
    closeBtn.removeEventListener("click", closeModal);
    window.removeEventListener("click", handleOutsideClick);
  }

  okBtn.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", handleOutsideClick);
}

// Setup booking form validation and submission
export function setupBookingForm(
  bookingForm,
  guestsInput,
  dateInput,
  timeInput,
  addDish,
  grandTotalEl,
  service,
  modalElements,
  dishesContainer
) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const guests = parseInt(guestsInput.value || 0);
    const eventDate = dateInput.value;
    const eventTime = timeInput.value;

    // Guest count validation
    if (service === "private" && guests < 2) {
      showModal(modalElements, "Private dining requires at least 2 guests.");
      return;
    }
    if (service === "catering" && guests < 10) {
      showModal(modalElements, "Catering requires a minimum of 10 guests.");
      return;
    }

    // Date & time validation
    if (!eventDate) {
      showModal(modalElements, "Please select a valid event date.");
      return;
    }
    if (!eventTime) {
      showModal(modalElements, "Please select a valid event time.");
      return;
    }

    // All validations passed
    showModal(modalElements, "Booking submitted! Thank you! It will be our pleasure to serve you!", () => {
      bookingForm.reset();
      document.querySelectorAll(".dish-row").forEach(row => row.remove());
      addDish(dishesContainer, null, guestsInput, grandTotalEl);
      grandTotalEl.textContent = "0.00";
      localStorage.removeItem("bookingData");
    });
  });
}
