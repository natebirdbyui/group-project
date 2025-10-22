// Updates the year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

//slideshow
document.addEventListener("DOMContentLoaded", () => {
    const slideshows = document.querySelectorAll(".menu-gallery-slideshow");

    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll(".slide");
        if (slides.length === 0) return;

        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // show first slide
        showSlide(currentSlide);

        // auto-advance every 5 seconds
        setInterval(nextSlide, 5000);
    });
});
