/* ==========================================================================
   Muhammed Rafi - Portfolio Interactive Script & Smooth Animations
   Features:
   1. Theme Toggle & Persistent Preference
   2. Smooth Preloader & Hero Reveal Controller
   3. Scroll-Triggered Fade-In & Slide-Up (IntersectionObserver)
   4. Animated Circular Skill Progress Indicators
   5. Interactive 3D Tilt & Specular Highlights (Desktop)
   6. Subtle Parallax Scrolling Effects (60 FPS)
   7. Glowing Custom Cursor Follower (Desktop)
   8. Smooth Navigation & Section Anchor Scrolling
   9. Mobile Navigation Drawer
   10. Project Modal & Projects Grid Toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ==========================================================================
  // 1. THEME TOGGLE LOGIC (Default: Dark Mode)
  // ==========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');

  const updateThemeIcons = (theme) => {
    const iconClass = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    [themeToggle, mobileThemeToggle].forEach(btn => {
      if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.className = iconClass;
      }
    });
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons(theme);
  };

  const initialTheme = localStorage.getItem('theme') || 'dark';
  setTheme(initialTheme);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

  // ==========================================================================
  // 2. SMOOTH PRELOADER & HERO REVEAL TRIGGER
  // ==========================================================================
  const preloader = document.getElementById('sitePreloader');
  const preloaderBar = document.getElementById('preloaderBar');

  if (preloaderBar) {
    preloaderBar.style.width = '70%';
  }

  const completePreloader = () => {
    if (preloaderBar) preloaderBar.style.width = '100%';
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
      }
      document.body.classList.add('page-loaded');
    }, prefersReducedMotion ? 0 : 250);
  };

  if (document.readyState === 'complete') {
    completePreloader();
  } else {
    window.addEventListener('load', completePreloader);
    // Safety fallback timeout
    setTimeout(completePreloader, 600);
  }

  // ==========================================================================
  // 3. SCROLL-TRIGGERED FADE-IN & SLIDE-UP ANIMATIONS
  // ==========================================================================
  const revealSelectors = [
    '.section-label',
    '.section-title',
    '.section-desc',
    '.about-content',
    '.info-card',
    '.skill-card',
    '.service-card',
    '.project-card',
    '.exp-timeline-item',
    '.testimonial-card',
    '.graphic-art-card',
    '.footer-brand',
    '.footer-methods'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(', '));

  // Add stagger classes to grid containers
  const gridContainers = document.querySelectorAll('.skills-grid, .services-grid, .projects-grid');
  gridContainers.forEach(grid => {
    const children = grid.children;
    for (let i = 0; i < children.length; i++) {
      children[i].classList.add(`stagger-${(i % 8) + 1}`);
    }
  });

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal-on-scroll');
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ==========================================================================
  // 4. ANIMATED CIRCULAR SKILL PROGRESS INDICATORS
  // ==========================================================================
  const skillCards = document.querySelectorAll('.skill-card');

  const animateCounter = (element, targetValue, duration = 1200) => {
    let startTime = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
      element.textContent = `${currentValue}%`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = `${targetValue}%`;
      }
    };

    window.requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const targetValue = parseInt(card.getAttribute('data-progress'), 10) || 90;
          const progressBar = card.querySelector('.progress-ring-bar');
          const progressText = card.querySelector('.skill-progress-text');

          if (progressBar) {
            // Circumference of r=17 is 2 * PI * 17 = 106.81
            const circumference = 106.8;
            const offset = circumference - (targetValue / 100) * circumference;
            progressBar.style.strokeDashoffset = offset;
          }

          if (progressText) {
            animateCounter(progressText, targetValue);
          }

          observer.unobserve(card);
        }
      });
    }, { threshold: 0.2 });

    skillCards.forEach(card => skillObserver.observe(card));
  } else {
    // Fallback for reduced motion or non-supporting browsers
    skillCards.forEach(card => {
      const targetValue = parseInt(card.getAttribute('data-progress'), 10) || 90;
      const progressBar = card.querySelector('.progress-ring-bar');
      const progressText = card.querySelector('.skill-progress-text');
      if (progressBar) {
        const circumference = 106.8;
        progressBar.style.strokeDashoffset = circumference - (targetValue / 100) * circumference;
      }
      if (progressText) {
        progressText.textContent = `${targetValue}%`;
      }
    });
  }

  // ==========================================================================
  // 5. INTERACTIVE 3D TILT EFFECT ON CARDS (Desktop Only)
  // ==========================================================================
  if (isFinePointer && !prefersReducedMotion && window.innerWidth > 992) {
    const tiltCards = document.querySelectorAll('.project-card, .skill-card, .service-card, .exp-card');

    tiltCards.forEach(card => {
      // Create dynamic specular glare overlay
      if (!card.querySelector('.card-specular-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-specular-glare';
        card.appendChild(glare);
      }

      let tiltRAF = null;

      card.addEventListener('mousemove', (e) => {
        if (tiltRAF) cancelAnimationFrame(tiltRAF);

        tiltRAF = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Subtle tilt angle: max 7 degrees
          const rotateX = -((y - centerY) / centerY) * 7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
          card.style.setProperty('--mouse-x', `${((x / rect.width) * 100).toFixed(1)}%`);
          card.style.setProperty('--mouse-y', `${((y / rect.height) * 100).toFixed(1)}%`);
        });
      });

      card.addEventListener('mouseleave', () => {
        if (tiltRAF) cancelAnimationFrame(tiltRAF);
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ==========================================================================
  // 6. SUBTLE PARALLAX SCROLLING EFFECTS (60 FPS)
  // ==========================================================================
  if (!prefersReducedMotion && window.innerWidth > 992) {
    const heroVisual = document.querySelector('.hero-visual');
    const heroBlob = document.querySelector('.hero-blob-bg');
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    const orb3 = document.querySelector('.orb-3');

    let isTicking = false;

    const renderParallax = () => {
      const scrollY = window.pageYOffset;
      const vh = window.innerHeight;

      if (scrollY < vh * 1.5) {
        if (heroVisual) {
          heroVisual.style.transform = `translate3d(0, ${(scrollY * 0.06).toFixed(2)}px, 0)`;
        }
        if (heroBlob) {
          heroBlob.style.transform = `rotate(-3deg) translate3d(0, ${(scrollY * 0.1).toFixed(2)}px, 0)`;
        }
      }

      if (orb1) orb1.style.transform = `translate3d(0, ${(scrollY * -0.05).toFixed(2)}px, 0)`;
      if (orb2) orb2.style.transform = `translate3d(0, ${(scrollY * -0.03).toFixed(2)}px, 0)`;
      if (orb3) orb3.style.transform = `translate3d(0, ${(scrollY * -0.04).toFixed(2)}px, 0)`;

      isTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!isTicking) {
        window.requestAnimationFrame(renderParallax);
        isTicking = true;
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 7. SUBTLE GLOWING CUSTOM CURSOR FOR DESKTOP
  // ==========================================================================
  const cursorFollower = document.getElementById('cursorFollower');
  const cursorDot = document.getElementById('cursorDot');

  if (isFinePointer && !prefersReducedMotion && window.innerWidth > 992 && cursorFollower && cursorDot) {
    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isCursorVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorVisible) {
        cursorFollower.classList.add('cursor-active');
        cursorDot.classList.add('cursor-active');
        followerX = mouseX;
        followerY = mouseY;
        isCursorVisible = true;
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    document.addEventListener('mouseleave', () => {
      cursorFollower.classList.remove('cursor-active');
      cursorDot.classList.remove('cursor-active');
      isCursorVisible = false;
    });

    // Lerp loop for follower circle
    const animateCursor = () => {
      if (isCursorVisible) {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        cursorFollower.style.left = `${followerX.toFixed(2)}px`;
        cursorFollower.style.top = `${followerY.toFixed(2)}px`;
      }
      window.requestAnimationFrame(animateCursor);
    };
    window.requestAnimationFrame(animateCursor);

    // Interactive element hover state
    const interactiveElements = document.querySelectorAll(
      'a, button, .project-card, .skill-card, .service-card, .exp-card, .social-icon, .theme-toggle-btn'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorFollower.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('cursor-hover'));
    });
  }

  // ==========================================================================
  // 8. SMOOTH NAVIGATION & ANCHOR SCROLLING WITH OFFSET
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const header = document.querySelector('.header');
        const headerOffset = header ? header.offsetHeight : 80;
        const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset + 5;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        closeMobileNav();
      }
    });
  });

  // Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ==========================================================================
  // 9. MOBILE NAVIGATION TOGGLE
  // ==========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (mobileNav.classList.contains('active')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });
  }
});

// Close Mobile Navigation
function closeMobileNav() {
  const mobileNav = document.getElementById('mobileNav');
  const menuToggle = document.getElementById('menuToggle');
  if (mobileNav) mobileNav.classList.remove('active');
  if (menuToggle) {
    const icon = menuToggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  }
}

// Project Modal Logic
function openProjectModal(title, category, description) {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');

  if (modal && modalTitle && modalCategory && modalDescription) {
    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDescription.textContent = description;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close Modal when clicking outside card
document.addEventListener('click', (e) => {
  const modal = document.getElementById('projectModal');
  if (e.target === modal) {
    closeProjectModal();
  }
});

// Toggle Projects Visibility
function toggleProjects() {
  const hiddenProjects = document.querySelectorAll('.hidden-project');
  const btn = document.getElementById('toggleProjectsBtn');
  let isShowingAll = false;

  hiddenProjects.forEach(project => {
    if (project.style.display === 'none' || project.style.display === '') {
      project.style.display = 'flex';
      project.style.display = '';
      isShowingAll = true;
    } else {
      project.style.display = 'none';
    }
  });

  if (isShowingAll) {
    btn.innerHTML = 'Show Less <i class="fa-solid fa-arrow-up"></i>';
  } else {
    btn.innerHTML = 'View All Projects <i class="fa-solid fa-arrow-right"></i>';
  }
}
