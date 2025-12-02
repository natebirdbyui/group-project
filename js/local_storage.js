// local_storage.js
// Improved booking storage

const STORAGE_KEY = "bookingData";

// Save form data and dishes
export function saveFormData(bookingForm, dishesContainer) {
  const formData = {};
  new FormData(bookingForm).forEach((value, key) => (formData[key] = value));

  // Save selected dishes
  const dishes = [];
  dishesContainer.querySelectorAll(".dish-row").forEach(row => {
    const select = row.querySelector(".menu-item-select");
    if (select && select.value) {
      dishes.push(Number(select.value));
    }
  });

  const dataToSave = { formData, dishes };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// Restore saved data
export function restoreSavedData() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  return saved || { formData: {}, dishes: [] };
}

// Clear saved data
export function clearSavedData() {
  localStorage.removeItem(STORAGE_KEY);
}
