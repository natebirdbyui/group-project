document.addEventListener("DOMContentLoaded", async () => {
  const menuSelect = document.querySelector("#menu-item");
  const pricePerServingEl = document.querySelector("#price-per-serving");
  const estimatedTotalEl = document.querySelector("#estimated-total");
  const guestsInput = document.querySelector("#guests");
  const bookingForm = document.querySelector("#booking-form");

  // Menu detail elements
  const menuDetails = document.querySelector("#menu-details");
  const menuImage = document.querySelector("#menu-image");
  const menuName = document.querySelector("#menu-name");
  const menuDescription = document.querySelector("#menu-description");
  const menuServings = document.querySelector("#menu-servings");
  const menuPrice = document.querySelector("#menu-price");

  let data = null;

  // Show the selected dish details
  function showMenuDetails(item) {
    if (!item) {
      menuDetails.style.display = "none";
      return;
    }

    menuImage.src = item.image;
    menuImage.alt = item.name;
    menuName.textContent = item.name;
    menuDescription.textContent = item.description;
    menuServings.textContent = item.servings;
    menuPrice.textContent = item.price_per_serving.toFixed(2);

    menuDetails.style.display = "block";
  }

  // Restore saved form data
  const savedData = JSON.parse(localStorage.getItem("bookingData")) || {};
  for (const [key, value] of Object.entries(savedData)) {
    const field = bookingForm.querySelector(`[name="${key}"]`);
    if (field) field.value = value;
  }

  if (savedData["menu-item"] && savedData["guests"]) {
    const savedPrice = parseFloat(savedData.price_per_serving || 0);
    const total = savedData["guests"] * savedPrice;
    pricePerServingEl.textContent = `$${savedPrice.toFixed(2)}`;
    estimatedTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  try {
    // Load menu.json
    const response = await fetch("js/menu.json");
    data = await response.json();

    // Group dishes by category
    const categories = {};
    data.menu.forEach(item => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });

    // Populate dropdown
    for (const [category, items] of Object.entries(categories)) {
      const optGroup = document.createElement("optgroup");
      optGroup.label = category;
      items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        option.dataset.price = item.price_per_serving;
        optGroup.appendChild(option);
      });
      menuSelect.appendChild(optGroup);
    }

    // Update prices
    function updatePrice() {
      const selected = menuSelect.options[menuSelect.selectedIndex];
      const pricePerServing = parseFloat(selected?.dataset.price || 0);
      const guests = parseInt(guestsInput.value || 0);
      const total = guests * pricePerServing;

      pricePerServingEl.textContent = `$${pricePerServing.toFixed(2)}`;
      estimatedTotalEl.textContent = `$${total.toFixed(2)}`;

      saveFormData();
    }

    // Save form to localStorage
    function saveFormData() {
      const formData = {};
      new FormData(bookingForm).forEach((value, key) => {
        formData[key] = value;
      });
      const selected = menuSelect.options[menuSelect.selectedIndex];
      formData.price_per_serving = selected?.dataset.price || 0;

      localStorage.setItem("bookingData", JSON.stringify(formData));
    }

    // Event listeners
    menuSelect.addEventListener("change", () => {
      const selectedId = parseInt(menuSelect.value);
      const selectedItem = data.menu.find(item => item.id === selectedId);
      showMenuDetails(selectedItem);
      updatePrice();
    });

    guestsInput.addEventListener("input", updatePrice);
    bookingForm.addEventListener("input", saveFormData);

    bookingForm.addEventListener("submit", e => {
      e.preventDefault();
      alert("Booking submitted! Thank you. It will be our pleasure to serve you.");
      localStorage.removeItem("bookingData");
      bookingForm.reset();
      menuDetails.style.display = "none";
      pricePerServingEl.textContent = "$0.00";
      estimatedTotalEl.textContent = "$0.00";
    });

  } catch (error) {
    console.error("Error loading menu data:", error);
  }
});
