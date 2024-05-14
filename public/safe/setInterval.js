// Auto-scrolling gallery
const galleryContainers = document.querySelectorAll('.custom-gallery-container');
const intervalTime = 3000; // Change this value to adjust the interval time

galleryContainers.forEach((galleryContainer) => {
    const galleryItems = galleryContainer.querySelectorAll('.custom-gallery-item');
    let slideIndex = 0;

    function nextSlide() {
        slideIndex++;
        if (slideIndex >= galleryItems.length) {
            slideIndex = 0; // Reset to the first image
        }
        updateGallery();
    }

    function updateGallery() {
        galleryContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
        // Update h3 text
        const h3Text = galleryItems[slideIndex].querySelector('img').alt;
        galleryContainer.querySelector('h3').textContent = h3Text;
    }

    // Start auto-scrolling
    const intervalId = setInterval(nextSlide, intervalTime);
});
