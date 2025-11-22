//This file will display menu items from slideshow.js and pull information from menu.json
import { initSlideshows } from "./slideshow.js";

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

      slide.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
      `;

      categories[item.category].appendChild(slide);
    });

    // Initialize all slideshows after slides are added
    initSlideshows();

  } catch (error) {
    console.error("Error loading menu data:", error);
  }
}

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".site-nav");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", loadMenu);
