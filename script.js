// Mobile nav toggle, smooth scrolling with header offset, contact form validation,
// and scroll reveal using IntersectionObserver
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');

  toggle.addEventListener('click', () => {
    const isOpen = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', String(!isOpen));
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close mobile nav and perform smooth scroll with offset so sticky header doesn't cover sections
  const navLinks = document.querySelectorAll('.site-nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // If it's an external link, let it behave normally
      if (!href || !href.startsWith('#')) {
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // Get header height from CSS variable (fallback to 64)
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        // Small extra gap
        const extra = 8;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - extra;
        window.scrollTo({ top, behavior: 'smooth' });
      }

      // Close mobile nav if open
      if (nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Basic contact form client validation and mailto fallback hint
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Simple HTML5 validation is usually enough; this prevents blank submits in older browsers
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        e.preventDefault();
        alert('Please fill out name, email, and message before sending.');
        return;
      }

      // For now we allow the mailto behavior to proceed (it will open the user's email client).
      // If you want submissions to be sent to a server/service instead, I can hook up Formspree/Netlify/Formsubmit.
    });
  }

  // -------- Scroll reveal logic --------
  // Elements with class "reveal" will gain "reveal--active" when they enter the viewport.
  (function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      // If user prefers reduced motion, make everything visible immediately
      reveals.forEach(el => el.classList.add('reveal--active'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      // Fallback: show all reveals immediately if IntersectionObserver isn't supported
      reveals.forEach(el => el.classList.add('reveal--active'));
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // trigger a bit before element fully in view
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--active');
          // If you want the element to animate every time it enters, remove the next line
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => {
      // Optional: stagger small inline reveals by using a data attribute
      const delay = el.dataset.revealDelay;
      if (delay) {
        el.style.transitionDelay = delay;
      }
      observer.observe(el);
    });
  })();

  // -------- Easter Egg: Profile Picture Click --------
  (function initEasterEgg() {
    const profilePic = document.getElementById('profile-picture');
    const candlesContainer = document.getElementById('candles-container');
    const youtubePlayer = document.getElementById('youtube-player');

    if (!profilePic || !candlesContainer) return;

    profilePic.addEventListener('click', function(e) {
      activateEasterEgg();
    });

    function activateEasterEgg() {
      // Create confetti animation
      createCandles();
      
      // Stop any existing video first
      youtubePlayer.src = '';
      
      // Play YouTube video once (no loop)
      const videoId = 'TtEhwkMX8cY';
      youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
      youtubePlayer.style.display = 'block';
      
      // Stop after video ends or 30 seconds
      setTimeout(() => {
        youtubePlayer.src = '';
        youtubePlayer.style.display = 'none';
      }, 30000);
    }

    function createCandles() {
      const container = candlesContainer;
      
      // Don't clear existing animations, just add a new one
      // Each animation will clean itself up

      // Wait for Lottie to be available
      function loadConfetti() {
        if (typeof lottie === 'undefined') {
          // Retry after a short delay
          setTimeout(loadConfetti, 100);
          return;
        }

        // Create a unique container for this animation instance
        const lottieContainer = document.createElement('div');
        lottieContainer.className = 'confetti-animation-instance';
        lottieContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10001;';
        container.appendChild(lottieContainer);

        let animation = null;

        // Try loading animation with multiple methods
        function tryLoadWithPath(path) {
          animation = lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: path
          });

          animation.addEventListener('data_failed', () => {
            console.log('Failed to load from:', path);
            if (animation) {
              animation.destroy();
            }
            // Try next path
            tryNextPath();
          });

          animation.addEventListener('DOMLoaded', () => {
            console.log('Animation loaded successfully!');
          });

          animation.addEventListener('complete', () => {
            setTimeout(() => {
              if (animation) {
                animation.destroy();
              }
              if (lottieContainer && lottieContainer.parentNode) {
                lottieContainer.parentNode.removeChild(lottieContainer);
              }
            }, 500);
          });
        }

        const paths = [
          'https://lottie.host/embed/ENxSnLhOBl.json',
          'https://assets5.lottiefiles.com/packages/lf20_ENxSnLhOBl.json',
          'https://assets9.lottiefiles.com/packages/lf20_ENxSnLhOBl.json',
          'https://assets1.lottiefiles.com/packages/lf20_ENxSnLhOBl.json'
        ];
        let currentPathIndex = 0;

        function tryNextPath() {
          if (currentPathIndex < paths.length) {
            tryLoadWithPath(paths[currentPathIndex]);
            currentPathIndex++;
          } else {
            console.error('All animation paths failed');
            // Fallback: show a simple confetti effect
            showFallbackConfetti();
          }
        }

        function showFallbackConfetti() {
          // Simple CSS-based confetti fallback
          const fallbackContainer = document.createElement('div');
          fallbackContainer.className = 'fallback-confetti';
          fallbackContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10001;';
          container.appendChild(fallbackContainer);

          for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
              position: fixed;
              width: 10px;
              height: 10px;
              background: ${['#6ee7b7', '#fff', '#ff6b35', '#ffeb3b'][Math.floor(Math.random() * 4)]};
              left: ${Math.random() * 100}%;
              top: -10px;
              border-radius: 50%;
              animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
              z-index: 10001;
            `;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            fallbackContainer.appendChild(confetti);
          }

          setTimeout(() => {
            if (fallbackContainer && fallbackContainer.parentNode) {
              fallbackContainer.parentNode.removeChild(fallbackContainer);
            }
          }, 4000);
        }

        tryNextPath();

        // Fallback: remove after 5 seconds
        setTimeout(() => {
          if (animation) {
            animation.destroy();
          }
          if (lottieContainer && lottieContainer.parentNode) {
            lottieContainer.parentNode.removeChild(lottieContainer);
          }
        }, 5000);
      }

      loadConfetti();
    }
  })();

  // -------- Easter Egg: Scorpion "Get Over Here" --------
  (function initScorpionEasterEgg() {
    const copyrightSymbol = document.getElementById('copyright-symbol');
    const scorpionContainer = document.getElementById('scorpion-container');
    const scorpionCharacter = document.getElementById('scorpion-character');
    const scorpionSpear = document.getElementById('scorpion-spear');
    const scorpionText = document.getElementById('scorpion-text');
    const fullscreenContainer = document.getElementById('fullscreen-video-container');
    const fullscreenVideo = document.getElementById('fullscreen-video');
    const closeFullscreen = document.getElementById('close-fullscreen');
    const scorpionAudio = document.getElementById('scorpion-audio');

    if (!copyrightSymbol || !scorpionContainer) return;

    copyrightSymbol.addEventListener('click', function() {
      activateScorpionEasterEgg();
    });

    if (closeFullscreen) {
      closeFullscreen.addEventListener('click', function() {
        closeFullscreenVideo();
      });
    }

    function activateScorpionEasterEgg() {
      // Show Scorpion container
      scorpionContainer.style.display = 'block';
      
      // Animate Scorpion sliding in from left
      setTimeout(() => {
        scorpionCharacter.classList.add('scorpion-enter');
        
        // After Scorpion appears, throw spear
        setTimeout(() => {
          scorpionSpear.classList.add('spear-throw');
          scorpionText.style.opacity = '1';
          
          // Play "Get over here!" sound
          if (scorpionAudio) {
            scorpionAudio.currentTime = 0;
            scorpionAudio.play().catch(err => {
              console.log('Audio play failed:', err);
            });
          }
          
          // After spear extends, show fullscreen video
          setTimeout(() => {
            showFullscreenVideo();
          }, 800);
        }, 500);
      }, 100);
    }

    function showFullscreenVideo() {
      fullscreenContainer.style.display = 'block';
      fullscreenContainer.classList.add('fullscreen-active');
      
      // Load and play the video
      if (fullscreenVideo) {
        fullscreenVideo.load();
        fullscreenVideo.play().catch(err => {
          console.log('Autoplay prevented:', err);
          // If autoplay is blocked, user can click play
        });
      }
      
      // Wait a moment for video to load, then try fullscreen
      setTimeout(() => {
        // Try to enter fullscreen
        if (fullscreenContainer.requestFullscreen) {
          fullscreenContainer.requestFullscreen().catch(err => {
            console.log('Fullscreen not available:', err);
          });
        } else if (fullscreenContainer.webkitRequestFullscreen) {
          fullscreenContainer.webkitRequestFullscreen();
        } else if (fullscreenContainer.mozRequestFullScreen) {
          fullscreenContainer.mozRequestFullScreen();
        } else if (fullscreenContainer.msRequestFullscreen) {
          fullscreenContainer.msRequestFullscreen();
        }
      }, 500);
    }

    function closeFullscreenVideo() {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      
      // Hide containers
      fullscreenContainer.style.display = 'none';
      fullscreenContainer.classList.remove('fullscreen-active');
      if (fullscreenVideo) {
        fullscreenVideo.pause();
        fullscreenVideo.currentTime = 0;
      }
      
      // Reset Scorpion
      setTimeout(() => {
        scorpionContainer.style.display = 'none';
        scorpionCharacter.classList.remove('scorpion-enter');
        scorpionSpear.classList.remove('spear-throw');
        scorpionText.style.opacity = '0';
      }, 300);
    }
  })();
});