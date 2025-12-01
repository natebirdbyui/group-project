// Apply service-specific rules
export function applyServiceRules(
  serviceType,
  bookingForm,
  dishesContainer,
  addDishButton,
  bookingHeader,
  guestsInput,
  addDish
) {
  const oldNote = document.getElementById("service-rule-note");
  if (oldNote) oldNote.remove();

  // Reset default state
  addDishButton.style.display = "inline-block";
  dishesContainer.style.display = "block";
  guestsInput.disabled = false;

  if (serviceType === "private") {
    bookingHeader.textContent = "Book a Private Dining Experience";
    addDishButton.style.display = "none";
    dishesContainer.style.display = "none";
    guestsInput.min = 2;
    guestsInput.placeholder = "Minimum 2 guests required";

    document.querySelectorAll(".dish-row").forEach((row) => row.remove());

    const note = document.createElement("p");
    note.id = "service-rule-note";
    note.textContent = "Private dining includes one chef-curated dish for all guests.";
    bookingForm.prepend(note);
  }

  if (serviceType === "catering") {
    bookingHeader.textContent = "Book Catering Services";
    addDishButton.style.display = "inline-block";
    dishesContainer.style.display = "block";
    guestsInput.min = 10;
    guestsInput.placeholder = "Minimum 10 guests required";

    const note = document.createElement("p");
    note.id = "service-rule-note";
    note.textContent = "Catering orders require a minimum of 10 guests.";
    bookingForm.prepend(note);

    // Ensure at least one dish row exists for Catering
    if (dishesContainer.querySelectorAll(".dish-row").length === 0) {
      addDish(null);
    }
  }
}
