// Updates the year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

import { initSlideshows } from "./slideshow.js";
document.addEventListener("DOMContentLoaded", initSlideshows);

