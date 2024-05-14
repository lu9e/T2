document.addEventListener("DOMContentLoaded", function() {
    var images1 = document.querySelectorAll(".picP img");
    var currentImage1 = 0;

    images1[currentImage1].classList.add("active");

    setInterval(function() {
        images1[currentImage1].classList.remove("active");
        currentImage1 = (currentImage1 + 1) % images1.length;
        images1[currentImage1].classList.add("active");
    }, 4000); 
});

document.addEventListener("DOMContentLoaded", function() {
    var images2 = document.querySelectorAll(".picP2 img");
    var currentImage2 = 0;

    images2[currentImage2].classList.add("active");

    setInterval(function() {
        images2[currentImage2].classList.remove("active");
        currentImage2 = (currentImage2 + 1) % images2.length;
        images2[currentImage2].classList.add("active");
    }, 3700); 
});

document.addEventListener("DOMContentLoaded", function() {
    var images2 = document.querySelectorAll(".picP3 img");
    var currentImage2 = 0;

    images2[currentImage2].classList.add("active");

    setInterval(function() {
        images2[currentImage2].classList.remove("active");
        currentImage2 = (currentImage2 + 1) % images2.length;
        images2[currentImage2].classList.add("active");
    }, 4000); 
});

const toggles = document.querySelectorAll('.faq-toggle')

toggles.forEach(toggle => { 
    toggle.addEventListener('click', () => {
        toggle.parentNode.classList.toggle('active')
    })
})




