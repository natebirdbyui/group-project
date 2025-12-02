// Apply service-specific rules
export function applyServiceRules(
  serviceType,
  bookingForm,
  dishesContainer,
  addDishButton,
  bookingHeader,
  guestsInput,
  addDish,
  preselectedDish = null
) {
  const oldNote = document.getElementById("service-rule-note");
  if (oldNote) oldNote.remove();

  // Reset default state
  addDishButton.style.display = "inline-block";
  dishesContainer.style.display = "block";
  guestsInput.disabled = false;

  if (serviceType === "private") {
    bookingHeader.textContent = "Book a Private Dining Experience";
    guestsInput.min = 2;
    guestsInput.placeholder = "Minimum 2 guests required";

    const note = document.createElement("p");
    note.id = "service-rule-note";
    note.textContent = "Private dining allows selection of dishes for your event.";
    bookingForm.prepend(note);

    // Ensure at least one dish row exists
    if (dishesContainer.querySelectorAll(".dish-row").length === 0) {
      addDish(dishesContainer, preselectedDish, guestsInput, document.getElementById("grand-total"));
    }
  }

  if (serviceType === "catering") {
    bookingHeader.textContent = "Book Catering Services";
    guestsInput.min = 10;
    guestsInput.placeholder = "Minimum 10 guests required";

    const note = document.createElement("p");
    note.id = "service-rule-note";
    note.textContent = "Catering orders require a minimum of 10 guests.";
    bookingForm.prepend(note);

    // Ensure at least one dish row exists
    if (dishesContainer.querySelectorAll(".dish-row").length === 0) {
      addDish(dishesContainer, preselectedDish, guestsInput, document.getElementById("grand-total"));
    }
  }
}
