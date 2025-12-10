// calendar.js
// Returns today's date in "yyyy-mm-dd" format
export function getTodayISO() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Sets the minimum date for a date input to today
export function setMinDate(dateInput) {
  dateInput.min = getTodayISO();
}

// Sets the minimum time for a time input if the selected date is today
export function setMinTime(dateInput, timeInput) {
  function updateMinTime() {
    if (dateInput.value === getTodayISO()) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      timeInput.min = `${hours}:${minutes}`;
    } else {
      timeInput.min = "00:00";
    }
  }

  dateInput.addEventListener("change", updateMinTime);
  updateMinTime();
  setInterval(updateMinTime, 60000);
}



// Checks if a date string is in the past
export function isPastDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  const selectedDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate < today;
}

// Checks if a time string is in the past for a given date and checks time zone
export function isPastTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;

  // Parse date parts manually
  const [y, m, d] = dateStr.split("-");
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Create local date object
  const dt = new Date(y, m - 1, d, hours, minutes, 0, 0);

  // Compare to now
  return dt < new Date();
}

