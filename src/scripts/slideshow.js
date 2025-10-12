// Slideshow functionality
document.addEventListener('DOMContentLoaded', () => {
  const mainImages = document.querySelectorAll('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const selectors = document.querySelectorAll('.selector');
  
  if (mainImages.length === 0 || thumbnails.length === 0) return;
  
  let currentIndex = 0;
  
  // Function to show specific image
  function showImage(index) {

    if (index < 0) index = mainImages.length - 1;
    if (index >= mainImages.length) index = 0;

    // Remove active class from all main images
    mainImages.forEach(img => img.classList.remove('active'));
    
    // Remove active class from all thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to current image and thumbnail
    if (mainImages[index]) mainImages[index].classList.add('active');
    if (thumbnails[index]) thumbnails[index].classList.add('active');
    
    currentIndex = index;
  }
  
  // Add click event listeners to thumbnails
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      showImage(index);
    });
  });

  selectors.forEach((selector) => {
    selector.addEventListener('click', () => {
      if (selector.classList.contains('left')) {
        showImage(currentIndex - 1);
      } else if (selector.classList.contains('right')) {
        showImage(currentIndex + 1);
      }
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });
  
  // Initialize with first image
  showImage(0);
});