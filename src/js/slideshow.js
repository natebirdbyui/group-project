// Slideshow
let intervals = [];
let slideshows = [];

export function showSlide(slideshow, index) {
    const slides = slideshow.querySelectorAll(".slide");
    slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    });
}

export function nextSlide(slideshow) {
    const slides = slideshow.querySelectorAll(".slide");
    let currentIndex = [...slides].findIndex(slide =>
    slide.classList.contains("active")
    );
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(slideshow, currentIndex);
}

export function startAllSlideshows() {
    stopAllSlideshows();
    slideshows.forEach(slideshow => {
    const id = setInterval(() => nextSlide(slideshow), 5000);
    intervals.push(id);
    });
}

export function stopAllSlideshows() {
    intervals.forEach(id => clearInterval(id));
    intervals = [];
}



document.addEventListener("DOMContentLoaded", () => {
    slideshows = document.querySelectorAll(".menu-gallery-slideshow");
    
    // Initialize all
    slideshows.forEach(slideshow => {
        showSlide(slideshow, 0);
    });
    startAllSlideshows();

// Hover control: pause all when any slideshow is hovered
    slideshows.forEach(slideshow => {
        slideshow.addEventListener("mouseenter", stopAllSlideshows);
        slideshow.addEventListener("mouseleave", () => {
        // Advance all once for smooth flow, then restart together
        slideshows.forEach(nextSlide);
        startAllSlideshows();
        });
    });
});