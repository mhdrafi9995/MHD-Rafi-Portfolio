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

// Download Resume Action
function downloadResume() {
  const resumeContent = `
==================================================
MUHAMMED RAFI — DIGITAL MARKETING PROFESSIONAL
Location: India | Phone: +91 9747710360 | Email: rafi.mhd@gmail.com
==================================================

CORE SKILLS:
- Meta Ads (Facebook & Instagram Campaigns & ROAS Optimization)
- Google Ads (Search, Display & Performance Max)
- Search Engine Optimization (On-Page, Off-Page & Technical SEO)
- Social Media Strategy & Organic Growth
- Content Strategy & Creative Copywriting

EXPERIENCE:
1. Digital Marketing Executive — DOT Jeans Company (2022 — Present)
   - Scaled e-commerce store revenue with targeted Meta & Google Ads campaigns.
2. Social Media & Content Creator — Freelance (2021 — 2022)
   - Built high engagement brand campaigns for local & regional clients.
3. Intern - Digital Marketing — Local Business (2020 — 2021)
==================================================
`;
  
  const blob = new Blob([resumeContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Muhammed_Rafi_Resume.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
