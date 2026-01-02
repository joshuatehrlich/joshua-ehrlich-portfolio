// Variable Slideshow functionality (supports images, GIFs, and videos)

document.addEventListener('DOMContentLoaded', () => {
  
  const mainImages = document.querySelectorAll('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const selectors = document.querySelectorAll('.selector');
  const mainImageContainer = document.querySelector('.main-image-container');
  const pageOverlay = document.querySelector('.page-overlay');
  const slideshowContainer = document.querySelector('.slideshow-container');
  
  // Dynamic slide spacing - recalculates on each call
  function getSlideSpacing() {
    const isMobile = window.innerWidth < 768;
    return isMobile ? window.innerWidth / 1.15 : window.innerWidth * 0.1;
  }
  
  function getSlideSpeed() {
    const isMobile = window.innerWidth < 768;
    return isMobile ? 0.006 : 0.006;
  }

  let loopingIndex = 0;
  let cumulativeIndex = 0;
  
  if (mainImages.length === 0 || thumbnails.length === 0) return;
  
  let currentIndex = 0;
  let modal = null;
  let slideShowShift = 0; 
  let targetSlideShowShift = 0;

  
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

  // Function to reposition all slides based on current state
  function repositionSlides() {
    const spacing = getSlideSpacing();
    
    mainImages.forEach((slide, i) => {
      const width = slide.getBoundingClientRect().width;
      
      // Calculate offset from current cumulative position
      let offset = i - loopingIndex;
      
      // Wrap offset to be within half-length on either side
      if (offset > mainImages.length / 2) {
        offset -= mainImages.length;
      } else if (offset < -mainImages.length / 2) {
        offset += mainImages.length;
      }
      
      // Position relative to cumulativeIndex
      const position = cumulativeIndex + offset;
      slide.style.translate = `${-width/2 + spacing * position}px -50%`;
    });
    
    // Update container position
    mainImageContainer.style.transform = `translate(${slideShowShift}px, 0)`;
  }
  
  // Function to show specific image/video
  function showImage(index) {
    if (index < 0) index = mainImages.length - 1;
    if (index >= mainImages.length) index = 0;

    // Find true desired delta through closest path of travel
    let possibleDeltas = [
      (index - loopingIndex),
      (index - loopingIndex + mainImages.length),
      (index - loopingIndex - mainImages.length)
    ];
    let correctDeltaIndex;
    possibleDeltas.forEach((possibility, i) => {
      if (i == 0) {
        correctDeltaIndex = i;
      }
      else if (Math.abs(possibility) < Math.abs(possibleDeltas[correctDeltaIndex])) {
        correctDeltaIndex = i;
      }
    });
    const deltaIndex = possibleDeltas[correctDeltaIndex];

    loopingIndex = index;
    cumulativeIndex += deltaIndex;
    targetSlideShowShift -= getSlideSpacing() * deltaIndex;

    // Reposition all slides
    repositionSlides();

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

  // Touch/drag state - declared here so update() can access it
  let isDragging = false;

  let lastTimeStamp = window.performance.now();
  function update() {
    // update every frame
    const deltaTime = window.performance.now() - lastTimeStamp;
    lastTimeStamp = window.performance.now();

    // Only lerp when not actively dragging
    if (!isDragging) {
      slideShowShift = slideShowShift + (targetSlideShowShift - slideShowShift) * getSlideSpeed() * deltaTime;
      mainImageContainer.style.transform = `translate(${slideShowShift}px, 0)`;
    }
    requestAnimationFrame(update);
  }
  update();

  // Handle window resize - recalculate positions
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate target position with new spacing
      targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      slideShowShift = targetSlideShowShift; // Snap immediately
      repositionSlides();
    }, 100);
  });

  // Handle tab visibility change - re-sync positions
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      slideShowShift = targetSlideShowShift;
      repositionSlides();
    }
  });

  
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
        
        // Check if the original image is a GIF and add the gif-image class
        const isGif = media.astroImage?.classList.contains('gif-image') || 
                      media.img?.classList.contains('gif-image') ||
                      imgClone.src.includes('.gif');
        
        imgClone.className = isGif ? 'modal-image gif-image' : 'modal-image';
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

      let mouseOverCenterZone = false;
      
      // Handle clicks on modal - detect which third was clicked
      modal.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        const modalWidth = modal.offsetWidth;
        const clickPosition = clickX / modalWidth;

        if (!mouseOverCenterZone) {
          modal.classList.remove('active');
        } else if (clickPosition < 0.33) {
          // Left third - previous image
          showImage(currentIndex - 1);
        } else if (clickPosition > 0.67) {
          // Right third - next image
          showImage(currentIndex + 1);
        } else {
          modal.classList.remove('active');
        }
      });
      
      // Dynamically change cursor based on position
      modal.addEventListener('mousemove', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        const modalWidth = modal.offsetWidth;
        const clickPosition = clickX / modalWidth;

        // check if mouse is over modal center zone
        const centerZone = modal.querySelector('.modal-center-zone');
        const centerZoneRect = centerZone.getBoundingClientRect();
        if (clickX >= centerZoneRect.left && clickX <= centerZoneRect.right && clickY >= centerZoneRect.top && clickY <= centerZoneRect.bottom) {
          mouseOverCenterZone = true;
          
          if (clickPosition < 0.33) {
            modal.style.cursor = 'w-resize';
          } else if (clickPosition > 0.67) {
            modal.style.cursor = 'e-resize';
          } else {
            modal.style.cursor = 'zoom-out';
          }

        } else {
          mouseOverCenterZone = false;
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

  // Touch/drag support for mobile
  // Use pageOverlay since it sits on top and captures touch events
  // isDragging is declared above (near update function) so it can pause the lerp
  let startX = 0;
  let startScrollPosition = 0;

  // Only attach touch events if pageOverlay exists
  if (pageOverlay) {
    // TOUCH START - finger down
    pageOverlay.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startScrollPosition = slideShowShift;
      console.log("touchstart triggered");
    }, { passive: true });

    // TOUCH MOVE - finger dragging
    pageOverlay.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      console.log("touchmove");
      
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      // Update position directly (no animation)
      slideShowShift = startScrollPosition + deltaX;
      mainImageContainer.style.transform = `translate(${slideShowShift}px, 0)`;
      
      e.preventDefault();
    }, { passive: false });

    // TOUCH END - finger up
    pageOverlay.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      console.log("touchend");
      
      const deltaX = slideShowShift - startScrollPosition;
      
      if (deltaX > 50) {
        // Dragged right → go to previous slide
        showImage(currentIndex - 1);
      } else if (deltaX < -50) {
        // Dragged left → go to next slide
        showImage(currentIndex + 1);
      } else {
        // Small drag → snap back to current
        targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      }
    });

    // Also handle touch cancel (e.g., interrupted by notification)
    pageOverlay.addEventListener('touchcancel', () => {
      if (isDragging) {
        isDragging = false;
        targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      }
    });
  } else {
    console.warn('pageOverlay not found - touch events disabled');
  }

  // Reset container position to ensure clean start
  function resetSlideshow() {
    loopingIndex = 0;
    cumulativeIndex = 0;
    slideShowShift = 0;
    targetSlideShowShift = 0;
    currentIndex = 0;
    mainImageContainer.style.transform = 'translate(0px, 0)';
    showImage(0);
  }

  // Flag to track if initial positioning is complete
  let initialPositioningComplete = false;

  // Function to add .loaded class to an image's parent
  function markImageLoaded(img) {
    const mainImage = img.closest('.main-image');
    if (mainImage) {
      // Only add .loaded if positioning is complete, otherwise queue it
      if (initialPositioningComplete) {
        mainImage.classList.add('loaded');
      } else {
        // Will be handled after positioning completes
        mainImage.dataset.pendingLoaded = 'true';
      }
    }
  }

  // Function to process any pending .loaded classes after positioning
  function processPendingLoaded() {
    mainImages.forEach(img => {
      if (img.dataset.pendingLoaded === 'true') {
        img.classList.add('loaded');
        delete img.dataset.pendingLoaded;
      }
    });
  }

  // Set up image load listeners
  document.querySelectorAll('.main-image-content').forEach(img => {
    if (img.complete) {
      markImageLoaded(img);
    } else {
      img.addEventListener('load', () => markImageLoaded(img));
    }
  });

  // Handle videos
  document.querySelectorAll('.main-video-content').forEach(video => {
    if (video.tagName === 'VIDEO') {
      video.addEventListener('loadeddata', () => {
        const mainImage = video.closest('.main-image');
        if (mainImage) {
          if (initialPositioningComplete) {
            mainImage.classList.add('loaded');
          } else {
            mainImage.dataset.pendingLoaded = 'true';
          }
        }
      });
    } else if (video.tagName === 'IFRAME') {
      video.addEventListener('load', () => {
        const mainImage = video.closest('.main-image');
        if (mainImage) {
          if (initialPositioningComplete) {
            mainImage.classList.add('loaded');
          } else {
            mainImage.dataset.pendingLoaded = 'true';
          }
        }
      });
    }
  });

  // Handle thumbnails
  const thumbnailContainer = document.querySelector('.thumbnail-container');
  if (thumbnailContainer) {
    const thumbnailImages = document.querySelectorAll('.thumbnail-image');
    let loadedCount = 0;
    
    function checkThumbnailsLoaded() {
      loadedCount++;
      if (loadedCount >= 1 && initialPositioningComplete) {
        thumbnailContainer.classList.add('loaded');
      }
    }
    
    thumbnailImages.forEach(img => {
      if (img.complete) {
        checkThumbnailsLoaded();
      } else {
        img.addEventListener('load', checkThumbnailsLoaded);
        img.addEventListener('error', checkThumbnailsLoaded);
      }
    });
    
    if (thumbnailImages.length === 0) {
      // No thumbnails - will be shown after positioning
    }
  }

  // Initialize with a slight delay to ensure viewport is stable
  // This fixes mobile browsers where viewport dimensions may not be final on DOMContentLoaded
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Double RAF ensures browser has completed layout
      resetSlideshow();
      
      // NOW mark positioning as complete and process pending loaded states
      initialPositioningComplete = true;
      processPendingLoaded();
      
      // Also show thumbnail container now
      if (thumbnailContainer) {
        thumbnailContainer.classList.add('loaded');
      }
    });
  });

  // Also reinitialize when all images are loaded (in case of late loading)
  window.addEventListener('load', () => {
    // Re-run positioning after all resources loaded
    repositionSlides();
  });
});
