// Variable Slideshow functionality (supports images, GIFs, and videos)
document.addEventListener('DOMContentLoaded', () => {
  const mainImages = document.querySelectorAll('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const selectors = document.querySelectorAll('.selector');
  
  if (mainImages.length === 0 || thumbnails.length === 0) return;
  
  let currentIndex = 0;
  let modal = null;
  
  // Function to pause/play videos based on active state
  function manageVideoPlayback(index) {
    mainImages.forEach((slide, i) => {
      const video = slide.querySelector('video');
      const iframe = slide.querySelector('iframe');
      
      if (video) {
        if (i === index) {
          video.play().catch(e => console.log('Video play prevented:', e));
        } else {
          video.pause();
        }
      }
      
      // For iframes (YouTube/Vimeo), we can't directly control playback
      // The autoplay parameter in the URL handles this
    });
  }
  
  // Function to show specific image/video
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
    
    // Manage video playback
    manageVideoPlayback(index);
    
    // Update modal if it's open
    updateModalMedia();
  }
  
  // Function to get media content from active slide
  function getActiveMediaContent() {
    const activeSlide = document.querySelector('.main-image.active');
    if (!activeSlide) return null;
    
    const video = activeSlide.querySelector('video');
    const iframe = activeSlide.querySelector('iframe');
    const img = activeSlide.querySelector('img');
    const astroImage = activeSlide.querySelector('.main-image-content');
    
    return {
      video,
      iframe,
      img,
      astroImage,
      type: video ? 'video' : iframe ? 'iframe' : 'image'
    };
  }
  
  // Function to update modal with current media
  function updateModalMedia() {
    if (modal) {
      const media = getActiveMediaContent();
      if (!media) return;
      
      // Clear previous content
      const modalContent = modal.querySelector('.modal-center-zone');
      if (!modalContent) return;
      
      modalContent.innerHTML = '';
      
      if (media.type === 'video') {
        const videoClone = document.createElement('video');
        videoClone.src = media.video.src;
        videoClone.controls = true;
        videoClone.autoplay = true;
        videoClone.muted = true;
        videoClone.loop = true;
        videoClone.className = 'modal-video';
        modalContent.appendChild(videoClone);
      } else if (media.type === 'iframe') {
        const iframeClone = document.createElement('iframe');
        
        // Get original src and enable controls for modal
        let modalSrc = media.iframe.src;
        
        // Enable controls for YouTube
        if (modalSrc.includes('youtube.com')) {
          modalSrc = modalSrc.replace('controls=0', 'controls=1');
        }
        
        // Enable controls for Vimeo
        if (modalSrc.includes('vimeo.com')) {
          modalSrc = modalSrc.replace('controls=false', 'controls=true');
        }
        
        iframeClone.src = modalSrc;
        iframeClone.className = 'modal-iframe';
        iframeClone.frameBorder = '0';
        iframeClone.allow = 'autoplay; fullscreen; picture-in-picture';
        iframeClone.allowFullscreen = true;
        modalContent.appendChild(iframeClone);
      } else {
        const imgClone = document.createElement('img');
        imgClone.src = media.astroImage ? media.astroImage.src : media.img.src;
        imgClone.alt = 'Full size view';
        imgClone.className = 'modal-image';
        modalContent.appendChild(imgClone);
      }
    }
  }
  
  // High-res modal functionality
  function openHighResModal() {
    // Create modal if it doesn't exist
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'highres-modal';
      modal.innerHTML = `
        <div class="modal-left-zone"></div>
        <div class="modal-center-zone"></div>
        <div class="modal-right-zone"></div>
      `;
      document.body.appendChild(modal);
      
      // Handle clicks on modal - detect which third was clicked
      modal.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const modalWidth = modal.offsetWidth;
        const clickPosition = clickX / modalWidth;
        
        if (clickPosition < 0.33) {
          // Left third - previous image
          showImage(currentIndex - 1);
        } else if (clickPosition > 0.67) {
          // Right third - next image
          showImage(currentIndex + 1);
        } else {
          // Center third - close modal
          modal.classList.remove('active');
        }
      });
      
      // Dynamically change cursor based on position
      modal.addEventListener('mousemove', (e) => {
        const clickX = e.clientX;
        const modalWidth = modal.offsetWidth;
        const clickPosition = clickX / modalWidth;
        
        if (clickPosition < 0.33) {
          modal.style.cursor = 'w-resize';
        } else if (clickPosition > 0.67) {
          modal.style.cursor = 'e-resize';
        } else {
          modal.style.cursor = 'zoom-out';
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
    modal.classList.add('active');
    updateModalMedia();
  }
  
  // Add click event listeners to thumbnails
  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      showImage(index);
    });
  });

  // Add click event listeners to selectors
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
    if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });
  
  // Initialize with first image
  showImage(0);
});

