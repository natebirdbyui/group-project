// Updates the year in the footer
document.getElementById("year").textContent = new Date().getFullYear();


// Slideshow
document.addEventListener("DOMContentLoaded", () => {
    const slideshows = document.querySelectorAll(".menu-gallery-slideshow");
    let intervals = [];

    function showSlide(slideshow, index) {
        const slides = slideshow.querySelectorAll(".slide");
        slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        });
    }

    function nextSlide(slideshow) {
        const slides = slideshow.querySelectorAll(".slide");
        let currentIndex = [...slides].findIndex(slide =>
        slide.classList.contains("active")
        );
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(slideshow, currentIndex);
    }

    function startAllSlideshows() {
        stopAllSlideshows();
        slideshows.forEach(slideshow => {
        const id = setInterval(() => nextSlide(slideshow), 5000);
        intervals.push(id);
        });
    }

    function stopAllSlideshows() {
        intervals.forEach(id => clearInterval(id));
        intervals = [];
    }

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
