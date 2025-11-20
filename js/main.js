// Updates the year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

import { initSlideshows, showSlide, nextSlide, startAllSlideshows, stopAllSlideshows } from "./slideshow.js";
document.addEventListener("DOMContentLoaded", initSlideshows, showSlide, nextSlide, startAllSlideshows, stopAllSlideshows);

