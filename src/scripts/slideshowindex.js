// Slideshow functionality - separated from Astro component
console.log('Slideshow script loaded');

let currentSlide = 0;
let slideTimer = null;
let isInitialized = false;

const SLIDE_DURATION = 5000; // 5 seconds

function initializeSlideshow() {
  if (isInitialized) {
    console.log('Slideshow already initialized, skipping');
    return;
  }

  const slides = document.querySelectorAll('.gallery-slide');
  const indicators = document.querySelectorAll('.indicator');
  
  if (slides.length === 0) {
    console.log('No slides found, retrying in 100ms');
    setTimeout(initializeSlideshow, 100);
    return;
  }

  console.log(`Initializing slideshow with ${slides.length} slides`);
  isInitialized = true;
  
  function showSlide(index) {
    console.log(`Showing slide ${index}`);
    
    // Hide all slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  
  function startAutoAdvance() {
    if (slideTimer) {
      clearInterval(slideTimer);
    }
    
    console.log('Starting auto-advance timer');
    slideTimer = setInterval(nextSlide, SLIDE_DURATION);
  }
  
  // Start the slideshow
  showSlide(0);
  startAutoAdvance();
  
  // Add click handlers to indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      console.log(`Indicator clicked: slide ${index}`);
      currentSlide = index;
      showSlide(currentSlide);
      
      // Reset timer when manually clicked
      if (slideTimer) {
        clearInterval(slideTimer);
      }
      setTimeout(startAutoAdvance, 1000);
    });
  });
  
  // Pause on hover
  const gallery = document.querySelector('.autoscroll-gallery');
  if (gallery) {
    gallery.addEventListener('mouseenter', () => {
      console.log('Mouse enter - pausing slideshow');
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    });
    
    gallery.addEventListener('mouseleave', () => {
      console.log('Mouse leave - resuming slideshow');
      startAutoAdvance();
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSlideshow);
} else {
  initializeSlideshow();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (slideTimer) {
    clearInterval(slideTimer);
  }
});