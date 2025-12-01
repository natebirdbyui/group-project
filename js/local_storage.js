let savedData = {}; // local backup

export function saveFormData(bookingForm) {
  const formData = {};
  new FormData(bookingForm).forEach((value, key) => (formData[key] = value));

  localStorage.setItem("bookingData", JSON.stringify(formData));
}

export function restoreSavedData() {
  return JSON.parse(localStorage.getItem("bookingData")) || {};
}

export function clearSavedData() {
  localStorage.removeItem("bookingData");
  savedData = {};
}
