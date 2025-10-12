/**
 * Modern Terminal Portfolio JavaScript
 * Interactive features for Edison Uwamungu's portfolio
 */

// DOM Elements
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
const mobileMenuBtn = document.querySelector('[data-mobile-menu]');
const navbarLinks = document.querySelectorAll('.navbar-link');
const tabBtns = document.querySelectorAll('[data-tab-btn]');
const tabContents = document.querySelectorAll('[data-tab-content]');
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const projectItems = document.querySelectorAll('[data-filter-item]');
const loading = document.getElementById('loading');

// Loading Animation
window.addEventListener('load', () => {
  // Preload critical images
  const criticalImages = [
    './assets/images/my-avatar.png',
    './assets/images/logo.svg'
  ];
  
  let loadedImages = 0;
  const totalImages = criticalImages.length;
  
  if (totalImages === 0) {
    setTimeout(() => {
      loading.classList.add('hidden');
    }, 1000);
    return;
  }
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.onload = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        setTimeout(() => {
          loading.classList.add('hidden');
        }, 500);
      }
    };
    img.onerror = () => {
      loadedImages++;
      if (loadedImages === totalImages) {
        setTimeout(() => {
          loading.classList.add('hidden');
        }, 500);
      }
    };
    img.src = src;
  });
  
  // Fallback timeout
  setTimeout(() => {
    loading.classList.add('hidden');
  }, 3000);
});

// Sidebar Toggle
if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    const isActive = sidebar.classList.contains('active');
    sidebarBtn.innerHTML = isActive 
      ? '<span>Hide Contacts</span><ion-icon name="chevron-up" aria-hidden="true"></ion-icon>'
      : '<span>Show Contacts</span><ion-icon name="chevron-down" aria-hidden="true"></ion-icon>';
    
    // Update ARIA attributes
    sidebarBtn.setAttribute('aria-expanded', isActive);
  });
}

// Mobile Menu Toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (sidebar && mobileMenuBtn && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    sidebar.classList.remove('active');
  }
});

// Smooth Scrolling for Navigation Links
navbarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    
    // Update active navbar link
    navbarLinks.forEach(navLink => navLink.classList.remove('active'));
    link.classList.add('active');
    
    // Close mobile menu
    sidebar.classList.remove('active');
  });
});

// Tab Functionality
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab-btn');
    
    // Remove active class from all tabs and contents
    tabBtns.forEach(tabBtn => tabBtn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    btn.classList.add('active');
    document.querySelector(`[data-tab-content="${tabId}"]`).classList.add('active');
  });
});

// Enhanced Portfolio Filter Functionality
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterValue = btn.getAttribute('data-filter-btn');
    
    // Add loading state to filter buttons
    filterBtns.forEach(filterBtn => {
      filterBtn.classList.remove('active');
      filterBtn.style.pointerEvents = 'none';
    });
    
    // Add active state with delay for better UX
    setTimeout(() => {
      btn.classList.add('active');
      filterBtns.forEach(filterBtn => {
        filterBtn.style.pointerEvents = 'auto';
      });
    }, 100);
    
    // Enhanced filtering with better animations
    const visibleItems = [];
    const hiddenItems = [];
    
    projectItems.forEach((item, index) => {
      const itemCategory = item.getAttribute('data-category');
      
      if (filterValue === 'all' || itemCategory === filterValue) {
        visibleItems.push({ item, index });
      } else {
        hiddenItems.push({ item, index });
      }
    });
    
    // First, hide items that should be hidden
    hiddenItems.forEach(({ item }) => {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.8)';
      setTimeout(() => {
        item.style.display = 'none';
      }, 300);
    });
    
    // Then, show items that should be visible with staggered animation
    visibleItems.forEach(({ item, index }) => {
      item.style.display = 'block';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.transition = 'all 0.4s ease';
      }, 100 + (index * 50));
    });
    
    // Add filter count indicator
    updateFilterCount(visibleItems.length);
  });
});

// Function to update filter count
function updateFilterCount(count) {
  let countElement = document.querySelector('.filter-count');
  if (!countElement) {
    countElement = document.createElement('span');
    countElement.className = 'filter-count';
    countElement.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--terminal-accent);
      color: var(--text-primary);
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    `;
    document.querySelector('.portfolio-filters').appendChild(countElement);
  }
  countElement.textContent = count;
}

// Portfolio Search Functionality
function initPortfolioSearch() {
  const searchInput = document.getElementById('portfolio-search');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active');
    const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter-btn') : 'all';
    
    projectItems.forEach((item) => {
      const title = item.querySelector('.project-title').textContent.toLowerCase();
      const category = item.querySelector('.project-category').textContent.toLowerCase();
      const itemCategory = item.getAttribute('data-category');
      
      const matchesSearch = title.includes(searchTerm) || category.includes(searchTerm);
      const matchesFilter = currentFilter === 'all' || itemCategory === currentFilter;
      
      if (matchesSearch && matchesFilter) {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
    
    // Update count for search results
    const visibleCount = Array.from(projectItems).filter(item => 
      item.style.display !== 'none' && item.style.opacity !== '0'
    ).length;
    updateFilterCount(visibleCount);
  });
}

// Terminal class removed - not implemented in HTML

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initResumeTabs();
  initMobileMenu();
  initScrollAnimations();
  initHoverEffects();
  initSmoothScrolling();
  initProgressBar();
  initScrollToTop();
  initLoadingScreen();
  initPortfolioSearch();
});

// Theme Toggle Functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  // Get saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Update icon based on current theme
  updateThemeIcon(themeIcon, savedTheme);
  
  // Add click event listener
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    updateThemeIcon(themeIcon, newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  });
}

function updateThemeIcon(icon, theme) {
  if (theme === 'dark') {
    icon.name = 'moon-outline';
    } else {
    icon.name = 'sunny-outline';
  }
}

// Resume Tabs Functionality
function initResumeTabs() {
  const tabButtons = document.querySelectorAll('.resume-tab-btn');
  const tabContents = document.querySelectorAll('.resume-tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-resume-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const targetContent = document.querySelector(`[data-resume-content="${targetTab}"]`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// Mobile Menu Functionality
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      
      // Update button icon
      const icon = mobileMenuBtn.querySelector('ion-icon');
      if (sidebar.classList.contains('active')) {
        icon.name = 'close-outline';
      } else {
        icon.name = 'menu-outline';
      }
    });
    
    // Close mobile menu when clicking on a link
    const sidebarLinks = document.querySelectorAll('.navbar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('ion-icon');
        icon.name = 'menu-outline';
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('ion-icon');
        icon.name = 'menu-outline';
      }
    });
  }
}

// Scroll Reveal Animation - Consolidated
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

// Navbar Active Link on Scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const correspondingLink = document.querySelector(`.navbar-link[href="#${sectionId}"]`);
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navbarLinks.forEach(link => link.classList.remove('active'));
      if (correspondingLink) {
        correspondingLink.classList.add('active');
      }
    }
  });
});

// Form Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link
    const mailtoLink = `mailto:edison.u@eagles.oc.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showNotification('Message prepared! Your email client should open now.', 'success');
  });
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <ion-icon name="${type === 'success' ? 'checkmark-circle' : 'information-circle'}"></ion-icon>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    z-index: var(--z-tooltip);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: var(--shadow-lg);
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

// Terminal Cursor Blink
function blinkCursor() {
  const cursor = document.querySelector('.terminal-cursor');
  if (cursor) {
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);
  }
}

// Initialize cursor blink
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(blinkCursor, 3000);
});

// ========================================
// INTERACTIVE FEATURES
// ========================================

// Scroll Animations - Consolidated
function initScrollAnimations() {
  // Observe all sections and cards except hero
  const elements = document.querySelectorAll('section:not(.hero), .service-item, .project-item, .skills-item, .timeline-item, .contact-card, .skill-category, .certification-item');
  elements.forEach(el => {
    el.classList.add('scroll-reveal');
    scrollObserver.observe(el);
  });
}

// Typing Effect
function initTypingEffect() {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--text-accent)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    setTimeout(typeWriter, 1000);
  }
}

// Parallax Effect
function initParallaxEffect() {
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      hero.style.transform = `translateY(${parallax}px)`;
    });
  }
}

// Hover Effects
function initHoverEffects() {
  // Add hover effects to cards
  const cards = document.querySelectorAll('.card, .project-item, .skill-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '';
    });
  });

  // Button click effects removed - keeping only hover effects
}

// Smooth Scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Progress Bar
function initProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--text-accent), var(--text-success));
    z-index: 1000;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Particle effect removed - not needed for current design

// Skill Bars and Project Cards animations handled by scroll reveal


// Scroll to Top Button
function initScrollToTop() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '↑';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--text-accent);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `;
  
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.style.display = 'block';
    } else {
      scrollBtn.style.display = 'none';
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Loading Screen
function initLoadingScreen() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <p>Loading...</p>
    </div>
  `;
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease;
  `;
  
  document.body.appendChild(loader);
  
  window.addEventListener('load', () => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 500);
  });
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'var(--text-success)' : type === 'error' ? 'var(--text-error)' : 'var(--text-accent)'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  
  .loader-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--bg-tertiary);
    border-top: 4px solid var(--text-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .scroll-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;
document.head.appendChild(style);

// Add hover effects to interactive elements
document.addEventListener('DOMContentLoaded', () => {
  const interactiveElements = document.querySelectorAll('.btn, .service-item, .project-item, .skills-item, .contact-item');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'translateY(-5px)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translateY(0)';
    });
  });
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    sidebar.classList.remove('active');
  }
});

// Performance Optimization: Lazy Loading for Images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));

// Console welcome message
console.log(`
%c🚀 Welcome to Edison Uwamungu's Terminal Portfolio!
%c
%cThis portfolio was built with modern web technologies:
%c• HTML5 & CSS3 with Terminal/VS Code inspired design
%c• Vanilla JavaScript for smooth interactions
%c• Responsive design for all devices
%c• Optimized for performance and accessibility
%c
%cFeel free to explore the code and reach out if you have any questions!
%c
%cContact: edison.u@eagles.oc.edu
%cGitHub: https://github.com/iamedisonu
%cLinkedIn: https://www.linkedin.com/in/iamedisonu/
%c
%cType 'help' for available commands (just kidding, this is a portfolio!)
`,
  'color: #7c3aed; font-size: 16px; font-weight: bold;',
  '',
  'color: #8b949e; font-size: 14px;',
  'color: #58a6ff; font-size: 12px;',
  'color: #58a6ff; font-size: 12px;',
  'color: #58a6ff; font-size: 12px;',
  'color: #58a6ff; font-size: 12px;',
  '',
  'color: #8b949e; font-size: 12px;',
  '',
  'color: #7c3aed; font-size: 12px; font-weight: bold;',
  'color: #7c3aed; font-size: 12px; font-weight: bold;',
  'color: #7c3aed; font-size: 12px; font-weight: bold;',
  '',
  'color: #3fb950; font-size: 12px; font-style: italic;'
);