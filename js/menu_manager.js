let menuData = [];
let dishCount = 0;

// Load menu from JSON
export async function loadMenu(dishesContainer, savedData = {}, addDishCallback, preselectedDish = null) {
  try {
    const response = await fetch("js/menu.json");
    const data = await response.json();
    menuData = data.menu;

    // Restore saved dishes
    if (savedData.dishes && savedData.dishes.length > 0) {
      savedData.dishes.forEach(id => addDishCallback(id));
    } else if (preselectedDish) {
      addDishCallback(preselectedDish);
    } else {
      addDishCallback(); // Always at least one row
    }
  } catch (error) {
    console.error("Error loading menu:", error);
  }
}

// Add a dish row
export function addDish(dishesContainer, preselectId = null, guestsInput, grandTotalEl) {
  if (!menuData.length) return;

  dishCount++;
  const row = document.createElement("div");
  row.classList.add("dish-row");
  row.dataset.row = dishCount;

  row.innerHTML = `
    <select class="menu-item-select" required>
      <option value="" disabled>Select a dish</option>
    </select>
    <button type="button" class="remove-dish-btn">Remove</button>
    <div class="menu-details" style="display:none;">
      <img class="menu-image" alt="Dish Image"/>
      <h3 class="menu-name"></h3>
      <p class="menu-description"></p>
      <p><strong>Servings:</strong> <span class="menu-servings"></span></p>
      <p><strong>Price per Serving:</strong> $<span class="menu-price"></span></p>
      <p><strong>Trays Needed:</strong> <span class="menu-trays"></span></p>
    </div>
    <p><strong>Total:</strong> $<span class="estimated-total">0.00</span></p>
  `;

  dishesContainer.appendChild(row);

  const select = row.querySelector(".menu-item-select");

  menuData.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} (${item.category})`;
    select.appendChild(option);
  });

  if (preselectId) {
  // Wait until options are populated
  setTimeout(() => {
    select.value = preselectId;
    // Trigger change to update dish details
    select.dispatchEvent(new Event("change"));
  }, 0);
}


  select.addEventListener("change", () => updateDishRow(row, guestsInput, grandTotalEl));

  row.querySelector(".remove-dish-btn").addEventListener("click", () => {
    const allRows = dishesContainer.querySelectorAll(".dish-row");
    if (allRows.length > 1) {
      row.remove();
      updateAllTotals(dishesContainer, guestsInput, grandTotalEl);
    } else {
      // Last row --> just clear selection instead of removing
      select.value = "";
      updateDishRow(row, guestsInput, grandTotalEl);
    }
  });

  if (!preselectId) updateDishRow(row, guestsInput, grandTotalEl);
}

// Update a single dish row
export function updateDishRow(row, guestsInput, grandTotalEl) {
  const select = row.querySelector(".menu-item-select");
  const selectedItem = menuData.find(item => item.id === parseInt(select.value));
  const totalEl = row.querySelector(".estimated-total");
  const menuDetails = row.querySelector(".menu-details");
  const guests = parseInt(guestsInput.value || 0);

  if (!selectedItem) {
    menuDetails.style.display = "none";
    totalEl.textContent = "0.00";
    updateAllTotals(row.parentElement, guestsInput, grandTotalEl);
    return;
  }

  menuDetails.style.display = "block";
  row.querySelector(".menu-image").src = selectedItem.image;
  row.querySelector(".menu-image").alt = selectedItem.name;
  row.querySelector(".menu-name").textContent = selectedItem.name;
  row.querySelector(".menu-description").textContent = selectedItem.description;
  row.querySelector(".menu-servings").textContent = selectedItem.servings;
  row.querySelector(".menu-price").textContent = selectedItem.price_per_serving.toFixed(2);

  const traysNeeded = guests > 0 ? Math.ceil(guests / selectedItem.servings) : 0;
  row.querySelector(".menu-trays").textContent = traysNeeded;
  totalEl.textContent = (traysNeeded * selectedItem.servings * selectedItem.price_per_serving).toFixed(2);

  updateAllTotals(row.parentElement, guestsInput, grandTotalEl);
}

// Update all totals
export function updateAllTotals(dishesContainer, guestsInput, grandTotalEl) {
  const guests = parseInt(guestsInput.value || 0);
  let total = 0;

  dishesContainer.querySelectorAll(".dish-row").forEach(row => {
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
