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
  const updateMinTime = () => {
    if (dateInput.value === getTodayISO()) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      timeInput.min = `${hours}:${minutes}`;
    } else {
      timeInput.min = "00:00";
    }
  };

  dateInput.addEventListener("change", updateMinTime);
  updateMinTime();
}

// Checks if a date string is in the past
export function isPastDate(dateStr) {
  const selectedDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate < today;
}

// Checks if a time string is in the past for a given date
export function isPastTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const dt = new Date(dateStr);
  dt.setHours(hours, minutes, 0, 0);
  return dt < new Date();
}
