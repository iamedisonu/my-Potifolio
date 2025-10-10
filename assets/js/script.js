/**
 * Modern Portfolio JavaScript
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
  setTimeout(() => {
    loading.classList.add('hidden');
  }, 1000);
});

// Sidebar Toggle
sidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  const isActive = sidebar.classList.contains('active');
  sidebarBtn.innerHTML = isActive 
    ? '<span>Hide Contacts</span><ion-icon name="chevron-up"></ion-icon>'
    : '<span>Show Contacts</span><ion-icon name="chevron-down"></ion-icon>';
});

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
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
      const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
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

// Portfolio Filter Functionality
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterValue = btn.getAttribute('data-filter-btn');
    
    // Update active filter button
    filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter project items
    projectItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      
      if (filterValue === 'all' || itemCategory === filterValue) {
        item.style.display = 'block';
        item.style.animation = 'scale 0.3s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

// Observe elements for scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.service-item, .project-item, .timeline-item, .skills-item');
  revealElements.forEach(element => {
    element.classList.add('scroll-reveal');
    observer.observe(element);
  });
});

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
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-primary);
    border-radius: var(--border-radius-sm);
    padding: 1rem 1.5rem;
    color: var(--text-primary);
    z-index: var(--z-tooltip);
    transform: translateX(100%);
    transition: transform 0.3s ease;
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

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Typing Animation for Hero Title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 50);
    }, 1000);
  }
});

// Add hover effects to interactive elements
document.addEventListener('DOMContentLoaded', () => {
  const interactiveElements = document.querySelectorAll('.btn, .service-item, .project-item, .skills-item');
  
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

// Add smooth transitions to all elements
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    * {
      transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
    }
  `;
  document.head.appendChild(style);
});

// Console welcome message
console.log(`
%c👋 Welcome to Edison Uwamungu's Portfolio!
%c
%cThis portfolio was built with modern web technologies:
%c• HTML5 & CSS3 with Glassmorphism design
%c• Vanilla JavaScript for smooth interactions
%c• Responsive design for all devices
%c• Optimized for performance and accessibility
%c
%cFeel free to explore the code and reach out if you have any questions!
%c
%cContact: edison.u@eagles.oc.edu
%cGitHub: https://github.com/iamedisonu
%cLinkedIn: https://www.linkedin.com/in/iamedisonu/
`,
  'color: #8B5CF6; font-size: 16px; font-weight: bold;',
  '',
  'color: #B8BCC8; font-size: 14px;',
  'color: #06B6D4; font-size: 12px;',
  'color: #06B6D4; font-size: 12px;',
  'color: #06B6D4; font-size: 12px;',
  'color: #06B6D4; font-size: 12px;',
  '',
  'color: #B8BCC8; font-size: 12px;',
  '',
  'color: #8B5CF6; font-size: 12px; font-weight: bold;',
  'color: #8B5CF6; font-size: 12px; font-weight: bold;',
  'color: #8B5CF6; font-size: 12px; font-weight: bold;'
);