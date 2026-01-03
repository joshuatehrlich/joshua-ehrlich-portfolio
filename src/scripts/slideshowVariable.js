// Variable Slideshow functionality (supports images, GIFs, and videos)
// Refactored with proper initialization, bfcache handling, and positioning gates

// ============================================================================
// MODULE-LEVEL STATE (accessible to pageshow handler)
// ============================================================================

const MOBILE_BREAKPOINT = 850; // Must match $mobile-medium in variables.scss

let mainImages = null;
let thumbnails = null;
let selectors = null;
let mainImageContainer = null;
let pageOverlay = null;
let slideshowContainer = null;
let thumbnailContainer = null;
let thumbnailElements = null;

let loopingIndex = 0;
let cumulativeIndex = 0;
let currentIndex = 0;
let slideShowShift = 0;
let targetSlideShowShift = 0;
let isDragging = false;
let modal = null;

let initialPositioningComplete = false;
let listenersAttached = false;
let animationRunning = false;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getSlideSpacing() {
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  return isMobile ? window.innerWidth / 1.15 : window.innerWidth * 0.1;
}

function getSlideSpeed() {
  return 0.006;
}

// Check if first image has REAL dimensions (not just layout dimensions)
function firstImageHasDimensions() {
  if (!mainImages || mainImages.length === 0) return false;
  
  const firstSlide = mainImages[0];
  const imgElement = firstSlide.querySelector('.main-image-content');
  
  if (imgElement && imgElement.tagName === 'IMG') {
    // For images: check complete AND naturalWidth
    return imgElement.complete && imgElement.naturalWidth > 0;
  }
  
  const videoElement = firstSlide.querySelector('.main-video-content');
  if (videoElement) {
    if (videoElement.tagName === 'VIDEO') {
      return videoElement.readyState >= 1; // HAVE_METADATA
    }
    if (videoElement.tagName === 'IFRAME') {
      // Iframes are tricky - check if slide has dimensions
      return firstSlide.getBoundingClientRect().width > 0;
    }
  }
  
  // Fallback: check slide dimensions
  return firstSlide.getBoundingClientRect().width > 0;
}

// Wait for first image to have real dimensions
function waitForFirstImageDimensions() {
  return new Promise((resolve) => {
    if (firstImageHasDimensions()) {
      resolve();
      return;
    }
    
    const firstSlide = mainImages[0];
    if (!firstSlide) {
      resolve();
      return;
    }
    
    const imgElement = firstSlide.querySelector('.main-image-content');
    const videoElement = firstSlide.querySelector('.main-video-content');
    
    let resolved = false;
    const doResolve = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };
    
    if (imgElement && imgElement.tagName === 'IMG') {
      if (imgElement.complete && imgElement.naturalWidth > 0) {
        doResolve();
      } else {
        imgElement.addEventListener('load', doResolve, { once: true });
        imgElement.addEventListener('error', doResolve, { once: true });
      }
    } else if (videoElement) {
      if (videoElement.tagName === 'VIDEO') {
        videoElement.addEventListener('loadedmetadata', doResolve, { once: true });
      } else {
        videoElement.addEventListener('load', doResolve, { once: true });
      }
    }
    
    // Timeout fallback - don't wait forever (3 seconds max)
    setTimeout(doResolve, 3000);
  });
}

// ============================================================================
// CORE SLIDESHOW FUNCTIONS
// ============================================================================

function manageVideoPlayback(index) {
  if (!mainImages) return;
  
  mainImages.forEach((slide, i) => {
    const video = slide.querySelector('video');
    
    if (video) {
      if (i === index) {
        video.play().catch(e => console.log('Video play prevented:', e));
      } else {
        video.pause();
      }
    }
  });
}

function repositionSlides() {
  if (!mainImages || !mainImageContainer) return;
  
  const spacing = getSlideSpacing();
  
  mainImages.forEach((slide, i) => {
    const width = slide.getBoundingClientRect().width;
    
    // Skip if no valid dimensions yet
    if (width === 0) {
      return;
    }
    
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

function showImage(index) {
  if (!mainImages || mainImages.length === 0) return;
  
  if (index < 0) index = mainImages.length - 1;
  if (index >= mainImages.length) index = 0;

  // Find true desired delta through closest path of travel
  let possibleDeltas = [
    (index - loopingIndex),
    (index - loopingIndex + mainImages.length),
    (index - loopingIndex - mainImages.length)
  ];
  let correctDeltaIndex = 0;
  possibleDeltas.forEach((possibility, i) => {
    if (Math.abs(possibility) < Math.abs(possibleDeltas[correctDeltaIndex])) {
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
  if (thumbnails) {
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
  }
  
  // Add active class to current image and thumbnail
  if (mainImages[index]) mainImages[index].classList.add('active');
  if (thumbnails && thumbnails[index]) thumbnails[index].classList.add('active');
  
  currentIndex = index;
  
  // Manage video playback
  manageVideoPlayback(index);
  
  // Update modal if it's open
  updateModalMedia();
}

function resetSlideshow() {
  loopingIndex = 0;
  cumulativeIndex = 0;
  slideShowShift = 0;
  targetSlideShowShift = 0;
  currentIndex = 0;
  
  if (mainImageContainer) {
    mainImageContainer.style.transform = 'translate(0px, 0)';
  }
  
  showImage(0);
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================

let lastTimeStamp = 0;

function update() {
  const now = window.performance.now();
  const deltaTime = now - lastTimeStamp;
  lastTimeStamp = now;

  // Only lerp when not actively dragging
  if (!isDragging && mainImageContainer) {
    slideShowShift = slideShowShift + (targetSlideShowShift - slideShowShift) * getSlideSpeed() * deltaTime;
    mainImageContainer.style.transform = `translate(${slideShowShift}px, 0)`;
  }
  
  if (animationRunning) {
    requestAnimationFrame(update);
  }
}

function startAnimationLoop() {
  if (!animationRunning) {
    animationRunning = true;
    lastTimeStamp = window.performance.now();
    requestAnimationFrame(update);
  }
}

// ============================================================================
// MODAL FUNCTIONALITY
// ============================================================================

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

function updateModalMedia() {
  if (modal) {
    const media = getActiveMediaContent();
    if (!media) return;
    
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
      let modalSrc = media.iframe.src;
      
      if (modalSrc.includes('youtube.com')) {
        modalSrc = modalSrc.replace('controls=0', 'controls=1');
      }
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
      
      const isGif = media.astroImage?.classList.contains('gif-image') || 
                    media.img?.classList.contains('gif-image') ||
                    imgClone.src.includes('.gif');
      
      imgClone.className = isGif ? 'modal-image gif-image' : 'modal-image';
      modalContent.appendChild(imgClone);
    }
  }
}

function openHighResModal() {
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
    
    modal.addEventListener('click', (e) => {
      const clickX = e.clientX;
      const modalWidth = modal.offsetWidth;
      const clickPosition = clickX / modalWidth;

      if (!mouseOverCenterZone) {
        modal.classList.remove('active');
      } else if (clickPosition < 0.33) {
        showImage(currentIndex - 1);
      } else if (clickPosition > 0.67) {
        showImage(currentIndex + 1);
      } else {
        modal.classList.remove('active');
      }
    });
    
    modal.addEventListener('mousemove', (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const modalWidth = modal.offsetWidth;
      const clickPosition = clickX / modalWidth;

      const centerZone = modal.querySelector('.modal-center-zone');
      const centerZoneRect = centerZone.getBoundingClientRect();
      if (clickX >= centerZoneRect.left && clickX <= centerZoneRect.right && 
          clickY >= centerZoneRect.top && clickY <= centerZoneRect.bottom) {
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
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }
  
  modal.classList.add('active');
  updateModalMedia();
}

// ============================================================================
// POSITIONING STATE MANAGEMENT
// ============================================================================

function markAllPositioned() {
  if (mainImages) {
    mainImages.forEach(img => img.classList.add('positioned'));
  }
  if (thumbnailElements) {
    thumbnailElements.forEach(thumb => thumb.classList.add('positioned'));
  }
  if (thumbnailContainer) {
    thumbnailContainer.classList.add('positioned');
  }
}

function clearAllPositioned() {
  if (mainImages) {
    mainImages.forEach(img => img.classList.remove('positioned'));
  }
  if (thumbnailElements) {
    thumbnailElements.forEach(thumb => thumb.classList.remove('positioned'));
  }
  if (thumbnailContainer) {
    thumbnailContainer.classList.remove('positioned');
  }
}

function markImageLoaded(img) {
  const mainImage = img.closest('.main-image');
  if (mainImage) {
    if (initialPositioningComplete) {
      mainImage.classList.add('loaded');
    } else {
      mainImage.dataset.pendingLoaded = 'true';
    }
  }
}

function processPendingLoaded() {
  if (mainImages) {
    mainImages.forEach(img => {
      if (img.dataset.pendingLoaded === 'true') {
        img.classList.add('loaded');
        delete img.dataset.pendingLoaded;
      }
    });
  }
  
  if (thumbnailElements) {
    thumbnailElements.forEach(thumbnail => {
      if (thumbnail.dataset.pendingLoaded === 'true') {
        thumbnail.classList.add('loaded');
        delete thumbnail.dataset.pendingLoaded;
      }
    });
  }
  
  if (thumbnailContainer) {
    thumbnailContainer.classList.add('loaded');
  }
}

// ============================================================================
// EVENT LISTENER ATTACHMENT (with guard to prevent duplicates)
// ============================================================================

function attachEventListeners() {
  if (listenersAttached) return;
  listenersAttached = true;
  
  // Thumbnail click listeners
  if (thumbnails) {
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        showImage(index);
      });
    });
  }

  // Selector click listeners
  if (selectors) {
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
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });

  // Touch/drag support for mobile
  let startX = 0;
  let startY = 0;
  let startScrollPosition = 0;
  let touchStartTime = 0;

  if (pageOverlay) {
    pageOverlay.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollPosition = slideShowShift;
      touchStartTime = Date.now();
    }, { passive: true });

    pageOverlay.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      slideShowShift = startScrollPosition + deltaX;
      if (mainImageContainer) {
        mainImageContainer.style.transform = `translate(${slideShowShift}px, 0)`;
      }
      
      e.preventDefault();
    }, { passive: false });

    pageOverlay.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      const deltaX = slideShowShift - startScrollPosition;
      const touchDuration = Date.now() - touchStartTime;
      
      const isTap = Math.abs(deltaX) < 20 && touchDuration < 300;
      
      if (isTap) {
        const activeImage = document.querySelector('.main-image.active');
        if (activeImage) {
          const rect = activeImage.getBoundingClientRect();
          const tapInBounds = startX >= rect.left && startX <= rect.right &&
                              startY >= rect.top && startY <= rect.bottom;
          if (tapInBounds) {
            openHighResModal();
          }
        }
      } else if (deltaX > 50) {
        showImage(currentIndex - 1);
      } else if (deltaX < -50) {
        showImage(currentIndex + 1);
      } else {
        targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      }
    });

    pageOverlay.addEventListener('touchcancel', () => {
      if (isDragging) {
        isDragging = false;
        targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      }
    });
  }

  // Resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Cancel any active drag
    if (isDragging) {
      isDragging = false;
    }
    
    // Temporarily hide to prevent flash
    clearAllPositioned();
    
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      slideShowShift = targetSlideShowShift;
      repositionSlides();
      markAllPositioned();
    }, 50);
  });

  // Orientation change handler (more reliable than resize for mobile)
  window.addEventListener('orientationchange', () => {
    clearAllPositioned();
    
    setTimeout(() => {
      targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      slideShowShift = targetSlideShowShift;
      repositionSlides();
      markAllPositioned();
    }, 150);
  });

  // Visibility change handler
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      targetSlideShowShift = -cumulativeIndex * getSlideSpacing();
      slideShowShift = targetSlideShowShift;
      repositionSlides();
    }
  });

  // Image load listeners
  document.querySelectorAll('.main-image-content').forEach(img => {
    if (img.complete) {
      markImageLoaded(img);
    } else {
      img.addEventListener('load', () => {
        markImageLoaded(img);
        repositionSlides();  // Reposition after lazy image loads
      });
      img.addEventListener('error', () => markImageLoaded(img));
    }
  });

  // Video load listeners
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
        repositionSlides();  // Reposition after lazy video loads
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
        repositionSlides();  // Reposition after lazy iframe loads
      });
    }
  });

  // Thumbnail load listeners
  if (thumbnailElements) {
    thumbnailElements.forEach(thumbnail => {
      const img = thumbnail.querySelector('.thumbnail-image');
      const videoIndicator = thumbnail.querySelector('.thumbnail-video-indicator');
      
      const markLoaded = () => {
        if (initialPositioningComplete) {
          thumbnail.classList.add('loaded');
        } else {
          thumbnail.dataset.pendingLoaded = 'true';
        }
      };
      
      if (img) {
        // Image thumbnail - wait for load
        if (img.complete) {
          markLoaded();
        } else {
          img.addEventListener('load', markLoaded);
          img.addEventListener('error', markLoaded);
        }
      } else if (videoIndicator) {
        // Video indicator doesn't need to load - mark immediately
        markLoaded();
      }
    });
  }
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

async function initializeSlideshow() {
  // Query DOM elements
  mainImages = document.querySelectorAll('.main-image');
  thumbnails = document.querySelectorAll('.thumbnail');
  selectors = document.querySelectorAll('.selector');
  mainImageContainer = document.querySelector('.main-image-container');
  pageOverlay = document.querySelector('.page-overlay');
  slideshowContainer = document.querySelector('.slideshow-container');
  thumbnailContainer = document.querySelector('.thumbnail-container');
  thumbnailElements = document.querySelectorAll('.thumbnail');
  
  // Early exit if no slideshow elements
  if (!mainImages || mainImages.length === 0 || !thumbnails || thumbnails.length === 0) {
    return;
  }
  
  // Attach event listeners (only once)
  attachEventListeners();
  
  // Start animation loop (only once)
  startAnimationLoop();
  
  // Wait for first image to have real dimensions
  await waitForFirstImageDimensions();
  
  // Now we can safely position
  resetSlideshow();
  
  // Mark positioning as complete
  initialPositioningComplete = true;
  
  // Add positioned class to all elements
  markAllPositioned();
  
  // Process any images that loaded while we were waiting
  processPendingLoaded();
}

// Re-initialize for bfcache restoration (doesn't re-attach listeners)
function reinitializeSlideshow() {
  if (!mainImages || mainImages.length === 0) {
    // Elements not ready, do full init
    initializeSlideshow();
    return;
  }
  
  // Reset position state
  resetSlideshow();
  
  // Recalculate positions
  targetSlideShowShift = 0;
  slideShowShift = 0;
  repositionSlides();
  
  // Ensure positioned class is set
  markAllPositioned();
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

// Initial page load
document.addEventListener('DOMContentLoaded', () => {
  initializeSlideshow();
});

// Handle bfcache restoration
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('Page restored from bfcache, reinitializing slideshow');
    reinitializeSlideshow();
  }
});

// Also reinitialize when all resources are loaded
window.addEventListener('load', () => {
  // Re-run positioning after all resources loaded (safety net)
  if (initialPositioningComplete) {
    repositionSlides();
  }
});
