// Slideshow functionality
document.addEventListener('DOMContentLoaded', () => {
  const mainImages = document.querySelectorAll('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const selectors = document.querySelectorAll('.selector');
  
  if (mainImages.length === 0 || thumbnails.length === 0) return;
  
  let currentIndex = 0;
  let modal = null; // Store modal reference
  
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
    
    // Update modal if it's open
    updateModalImage();
  }
  
  // Function to update modal with current image
  function updateModalImage() {
    if (modal) {
      const activeImage = document.querySelector('.main-image.active .main-image-content');

// Inside the modal creation (if (!modal) block), add this after appendChild:
modal.addEventListener('mousemove', (e) => {
  const clickX = e.clientX;
  const modalWidth = modal.offsetWidth;
  const clickPosition = clickX / modalWidth;

  // check if mouse is over image itself
  const image = modal.querySelector('img');
  const imageRect = image.getBoundingClientRect();
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  // if (!(mouseX >= imageRect.left && mouseX <= imageRect.right && mouseY >= imageRect.top && mouseY <= imageRect.bottom)) {
  //   modal.style.cursor = 'zoom-out';
  //   return;
  // }
  
  if (clickPosition < 0.20) {
    modal.style.cursor = 'w-resize';  // or 'col-resize'
  } else if (clickPosition > 0.80) {
    modal.style.cursor = 'e-resize';  // or 'col-resize'
  } else {
    modal.style.cursor = 'zoom-out';
  }
});

      if (activeImage) {
        const imgSrc = activeImage.getAttribute('src');
        modal.querySelector('img').src = imgSrc;
      }
    }
  }
  
  // High-res modal functionality
  function openHighResModal() {
    // Create modal if it doesn't exist
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'highres-modal';
      modal.innerHTML = '<img />';
      document.body.appendChild(modal);
      
      // Handle clicks on modal - detect which third was clicked
      modal.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const modalWidth = modal.offsetWidth;
        const clickPosition = clickX / modalWidth;
        
        // check if mouse is over image itself
        const image = modal.querySelector('img');
        const imageRect = image.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        let mouseOverImage = false;
        if (mouseX >= imageRect.left && mouseX <= imageRect.right && mouseY >= imageRect.top && mouseY <= imageRect.bottom) {
          mouseOverImage = true;
        }
        mouseOverImage = true;

        if (clickPosition < 0.20 && mouseOverImage) {
          // Left third - previous image
          showImage(currentIndex - 1);
        } else if (clickPosition > 0.80 && mouseOverImage) {
          // Right third - next image
          showImage(currentIndex + 1);
        } else {
          // Center third - close modal
          modal.classList.remove('active');
        }
      });
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      });
    }
    
    // Update and show modal
    updateModalImage();
    modal.classList.add('active');
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
      } else if (selector.classList.contains('center')) {
        openHighResModal();
      }
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const modalActive = modal && modal.classList.contains('active');
    
    if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });
  
  // Initialize with first image
  showImage(0);
});