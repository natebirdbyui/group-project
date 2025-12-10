//This file will display menu items from slideshow.js and pull information from menu.json
import { initSlideshows } from "./slideshow.js";
import { setupNav } from "./navigation.js";
import { saveHomepageDish } from "./local_storage.js";
let menuData = [];

// Load menu data from menu.json and populate slideshows
async function loadMenu() {
  try {
    const response = await fetch("js/menu.json");
    const data = await response.json();
    menuData = data.menu;

    // Category containers
    const categories = {
      "BBQ": document.querySelector(".gallery-bbq .menu-gallery-slideshow"),
      "Baking": document.querySelector(".gallery-baking .menu-gallery-slideshow"),
      "Cooking": document.querySelector(".gallery-cooking .menu-gallery-slideshow"),
    };

    // Create slides
    menuData.forEach(item => {
      const slide = document.createElement("div");
      slide.classList.add("slide");

      // Make the first slide active for each category
      if (categories[item.category].children.length === 0) {
        slide.classList.add("active");
      }

      
    // Using URL Parameters to link to booking page Without forcing a service
    slide.innerHTML = `
      <a href="booking.html?dish=${item.id}" class="menu-link">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
      </a>
    `;

    // Save the dish selection when clicked
      slide.querySelector("a").addEventListener("click", (e) => {
        saveHomepageDish(item.id);
      });
      
      categories[item.category].appendChild(slide);
    });

    // Initialize all slideshows after slides are added
    initSlideshows();

  } catch (error) {
    console.error("Error loading menu data:", error);
  }
}

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  loadMenu();
  setupNav();
  initSlideshows();
});
