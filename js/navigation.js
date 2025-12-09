// navigation.js
export function setupNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".site-nav");

  if (!navToggle || !navMenu) {
    console.warn("Nav toggle or nav menu not found.");
    return;
  }

  // Toggle menu visibility on hamburger click
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent document click from immediately closing it
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking any link inside the menu
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });

  // Close menu if user clicks outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("active");
    }
  });

  //close menu on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      navMenu.classList.remove("active");
    }
  });
}
