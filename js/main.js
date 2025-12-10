// main.js
import { setupNav } from "./navigation.js";
import { initSlideshows } from "./slideshow.js";

document.addEventListener("DOMContentLoaded", () => {
  // Update footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize slideshows
  initSlideshows();

  // Initialize hamburger/nav menu
  setupNav();
});