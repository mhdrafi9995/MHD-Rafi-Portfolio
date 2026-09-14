/* ==========================================================================
   Muhammed Rafi - Portfolio Interactive Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic (Default: Dark Mode)
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

  // Set default to 'dark' mode as requested
  const initialTheme = localStorage.getItem('theme') || 'dark';
  setTheme(initialTheme);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

  // Mobile Navigation Toggle
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

  window.addEventListener('scroll', highlightNav);
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

