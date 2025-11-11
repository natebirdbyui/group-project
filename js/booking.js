document.addEventListener("DOMContentLoaded", async () => {
  //filling out the fields for the booking
  const menuSelect = document.querySelector("#menu-item");
  const pricePerServingEl = document.querySelector("#price-per-serving");
  const estimatedTotalEl = document.querySelector("#estimated-total");
  const guestsInput = document.querySelector("#guests");
  const bookingForm = document.querySelector("#booking-form");
  //details for select dish for photos, description, etc. and calculations
  const menuDetails = document.querySelector("#menu-details");
  const menuImage = document.querySelector("#menu-image");
  const menuName = document.querySelector("#menu-name");
  const menuDescription = document.querySelector("#menu-description");
  const menuServings = document.querySelector("#menu-servings");
  const menuPrice = document.querySelector("#menu-price");

  let menuData = [];

  // Load menu data from menu.json
  try {
    const response = await fetch("js/menu.json");
    const data = await response.json();
    menuData = data.menu;

    // Populate dropdown
    menuData.forEach(item => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} (${item.category})`;
      option.dataset.price = item.price_per_serving;
      menuSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading menu data:", error);
  }

  // Show details for selected dish
  function showMenuDetails(item) {
    if (!item) {
      menuDetails.style.display = "none";
      return;
    }
    //pulls data from json to show details
    menuImage.src = item.image;
    menuImage.alt = item.name;
    menuName.textContent = item.name;
    menuDescription.textContent = item.description;
    menuServings.textContent = item.servings;
    menuPrice.textContent = item.price_per_serving.toFixed(2);

    menuDetails.style.display = "block";
  }

  function updatePrice() {
    const selected = menuSelect.options[menuSelect.selectedIndex];
    if (!selected || !selected.value) return;

    const pricePerServing = parseFloat(selected?.dataset.price || 0);
    const selectedItem = menuData.find(item => item.id === parseInt(selected.value));
    const servings = selectedItem ? selectedItem.servings : 1;
    const guests = parseInt(guestsInput.value || 0);

    // Calculate how many trays are needed
    const traysNeeded = guests > 0 ? Math.ceil(guests / servings) : 0;
    const total = traysNeeded * servings * pricePerServing;

    // Update displayed info
    pricePerServingEl.textContent = `$${pricePerServing.toFixed(2)}`;
    estimatedTotalEl.textContent = `$${total.toFixed(2)}`;

    // Shows how many trays are needed to make it easier for the user to see what they need
    const traysInfo = document.querySelector("#trays-needed");
    if (traysInfo) {
      traysInfo.textContent = traysNeeded > 0 ? `${traysNeeded} tray(s) needed` : "";
  }
}

// Save booking form data to localStorage
function saveFormData() {
    const formData = {};
    new FormData(bookingForm).forEach((value, key) => {
      formData[key] = value;
    });

    const selected = menuSelect.options[menuSelect.selectedIndex];
    formData.price_per_serving = selected?.dataset.price || 0;

    localStorage.setItem("bookingData", JSON.stringify(formData));
  }

  // Load saved data if available
  const savedData = JSON.parse(localStorage.getItem("bookingData")) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = bookingForm.querySelector(`[name="${key}"]`);
    if (field) field.value = value;
  }

  // Restore previously selected dish & guests
  if (savedData["menu-item"]) {
    const selectedItem = menuData.find(item => item.id === parseInt(savedData["menu-item"]));
    if (selectedItem) {
      showMenuDetails(selectedItem);
      menuSelect.value = selectedItem.id;
    }
  }

  if (savedData["guests"]) {
    const savedPrice = parseFloat(savedData.price_per_serving || 0);
    const total = savedData["guests"] * savedPrice;
    pricePerServingEl.textContent = `$${savedPrice.toFixed(2)}`;
    estimatedTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  menuSelect.addEventListener("change", () => {
    const selectedId = parseInt(menuSelect.value);
    const selectedItem = menuData.find(item => item.id === selectedId);
    showMenuDetails(selectedItem);
    updatePrice();
  });

  guestsInput.addEventListener("input", updatePrice);
  bookingForm.addEventListener("input", saveFormData);

  // Handle form submission
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Booking submitted! Thank you. It will be our pleasure to serve you.");
    localStorage.removeItem("bookingData");
    bookingForm.reset();
    menuDetails.style.display = "none";
    pricePerServingEl.textContent = "$0.00";
    estimatedTotalEl.textContent = "$0.00";
  });
});
