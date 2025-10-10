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
  setTimeout(() => {
    loading.classList.add('hidden');
  }, 1500);
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

// Portfolio Filter Functionality
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterValue = btn.getAttribute('data-filter-btn');
    
    // Update active filter button
    filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter project items with animation
    projectItems.forEach((item, index) => {
      const itemCategory = item.getAttribute('data-category');
      
      if (filterValue === 'all' || itemCategory === filterValue) {
        setTimeout(() => {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.6s ease forwards';
        }, index * 100);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Interactive Terminal System
class Terminal {
  constructor() {
    this.terminalBody = document.getElementById('terminal-body');
    this.currentLine = null;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.isTyping = false;
    
    this.commands = {
      'help': () => this.showHelp(),
      'about': () => this.showAbout(),
      'projects': () => this.showProjects(),
      'skills': () => this.showSkills(),
      'contact': () => this.showContact(),
      'clear': () => this.clearTerminal(),
      'github': () => this.openGitHub(),
      'linkedin': () => this.openLinkedIn(),
      'whoami': () => this.showWhoami(),
      'ls': () => this.showList(),
      'cat': () => this.showCat(),
      'git': () => this.showGit(),
      'pwd': () => this.showPwd(),
      'date': () => this.showDate(),
      'echo': (args) => this.showEcho(args)
    };
    
    this.init();
  }
  
  init() {
    if (!this.terminalBody) {
      console.error('Terminal body not found');
      return;
    }
    
    // Make terminal focusable
    this.terminalBody.setAttribute('tabindex', '0');
    this.terminalBody.style.outline = 'none';
    
    // Add event listeners
    this.terminalBody.addEventListener('click', () => this.focusTerminal());
    this.terminalBody.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // Initial typing animation
    setTimeout(() => this.typeInitialCommands(), 1000);
  }
  
  focusTerminal() {
    this.terminalBody.focus();
  }
  
  handleKeyPress(e) {
    if (this.isTyping) return;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      this.executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autoComplete();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      this.interruptCommand();
    }
  }
  
  createNewLine() {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="terminal-prompt">edison@portfolio:~$</span>
      <span class="terminal-command" contenteditable="true" data-command=""></span>
      <span class="terminal-cursor"></span>
    `;
    
    this.terminalBody.appendChild(line);
    this.currentLine = line;
    
    // Focus on the command input
    const commandInput = line.querySelector('.terminal-command');
    commandInput.focus();
    
    // Add event listener for typing
    commandInput.addEventListener('input', (e) => {
      this.updateCursor();
    });
    
    return line;
  }
  
  executeCommand() {
    const commandInput = this.currentLine.querySelector('.terminal-command');
    const command = commandInput.textContent.trim();
    
    if (!command) {
      this.createNewLine();
      return;
    }
    
    // Add to history
    this.commandHistory.unshift(command);
    this.historyIndex = -1;
    
    // Remove contenteditable and cursor
    commandInput.removeAttribute('contenteditable');
    commandInput.style.borderRight = 'none';
    this.currentLine.querySelector('.terminal-cursor').remove();
    
    // Execute command
    const [cmd, ...args] = command.split(' ');
    const output = this.runCommand(cmd, args);
    
    // Show output
    if (output) {
      const outputDiv = document.createElement('div');
      outputDiv.className = 'terminal-output';
      outputDiv.innerHTML = output;
      this.terminalBody.appendChild(outputDiv);
    }
    
    // Create new line
    setTimeout(() => this.createNewLine(), 100);
  }
  
  runCommand(cmd, args = []) {
    if (this.commands[cmd]) {
      return this.commands[cmd](args);
    } else {
      return `Command not found: ${cmd}. Type 'help' for available commands.`;
    }
  }
  
  showHelp() {
    return `Available commands:<br>
• help - Show this help message<br>
• about - About me<br>
• projects - List my projects<br>
• skills - Show my skills<br>
• contact - Contact information<br>
• clear - Clear terminal<br>
• github - Open GitHub profile<br>
• linkedin - Open LinkedIn profile<br>
• whoami - Show who I am<br>
• ls - List files<br>
• cat [file] - Display file contents<br>
• git [command] - Git commands<br>
• pwd - Print working directory<br>
• date - Show current date<br>
• echo [text] - Display text`;
  }
  
  showAbout() {
    return `I'm Edison Uwamungu, a Computer Science and Cybersecurity student at Oklahoma Christian University.<br>
I'm passionate about technology, cybersecurity, and artificial intelligence.<br>
Currently working on eagleAI, an innovative AI platform, while developing solutions that protect digital systems.`;
  }
  
  showProjects() {
    return `My Projects:<br>
🦅 eagleAI - AI-powered platform (Currently Working)<br>
🛒 Amazon Clone - E-commerce platform<br>
🕷️ AI Web Scraper - Python automation<br>
🌟 Bright Futures Hub - Educational platform<br>
📊 Bulk Report Generator - Python automation<br>
💼 Portfolio Website - Modern web design<br><br>
Visit: <a href="https://github.com/iamedisonu" target="_blank" style="color: #58a6ff;">https://github.com/iamedisonu</a>`;
  }
  
  showSkills() {
    return `Technical Skills:<br>
🐍 Python | JavaScript | C++ | Java<br>
⚛️ React | Node.js | HTML/CSS<br>
🤖 AI/ML | Machine Learning<br>
🔒 Cybersecurity | Network Security<br>
☁️ Cloud Computing | AWS<br>
📊 Data Analysis | SQL<br>
🛠️ Git | Docker | Linux`;
  }
  
  showContact() {
    return `Contact Information:<br>
📧 Email: edison.u@eagles.oc.edu<br>
💼 LinkedIn: <a href="https://www.linkedin.com/in/iamedisonu/" target="_blank" style="color: #58a6ff;">linkedin.com/in/iamedisonu</a><br>
🐙 GitHub: <a href="https://github.com/iamedisonu" target="_blank" style="color: #58a6ff;">github.com/iamedisonu</a><br>
🐦 Twitter: @edisonuwamungu<br><br>
Feel free to reach out for opportunities or collaboration!`;
  }
  
  clearTerminal() {
    this.terminalBody.innerHTML = '';
    this.createNewLine();
    return null;
  }
  
  openGitHub() {
    window.open('https://github.com/iamedisonu', '_blank');
    return 'Opening GitHub profile...';
  }
  
  openLinkedIn() {
    window.open('https://www.linkedin.com/in/iamedisonu/', '_blank');
    return 'Opening LinkedIn profile...';
  }
  
  showWhoami() {
    return 'Computer Science Student | Cybersecurity Enthusiast | AI Developer';
  }
  
  showList() {
    return `projects/  skills.txt  resume.pdf  README.md<br>
eagleAI/  amazon-clone/  ai-web-scraper/  bright-futures-hub/  bulk-report/`;
  }
  
  showCat() {
    return `Python | JavaScript | C++ | Java | React | Node.js | AI/ML | Cybersecurity`;
  }
  
  showGit() {
    return `On branch main<br>Your branch is up to date with 'origin/main'<br>nothing to commit, working tree clean`;
  }
  
  showPwd() {
    return '/home/edison/portfolio';
  }
  
  showDate() {
    return new Date().toString();
  }
  
  showEcho(args) {
    return args.join(' ');
  }
  
  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;
    
    this.historyIndex += direction;
    
    if (this.historyIndex < 0) this.historyIndex = 0;
    if (this.historyIndex >= this.commandHistory.length) this.historyIndex = this.commandHistory.length - 1;
    
    const commandInput = this.currentLine.querySelector('.terminal-command');
    commandInput.textContent = this.commandHistory[this.historyIndex] || '';
  }
  
  autoComplete() {
    const commandInput = this.currentLine.querySelector('.terminal-command');
    const currentText = commandInput.textContent.toLowerCase();
    
    const matches = Object.keys(this.commands).filter(cmd => 
      cmd.startsWith(currentText)
    );
    
    if (matches.length === 1) {
      commandInput.textContent = matches[0];
    } else if (matches.length > 1) {
      this.addOutput(`Possible completions: ${matches.join(' ')}`);
    }
  }
  
  interruptCommand() {
    this.addOutput('^C');
    this.createNewLine();
  }
  
  addOutput(text) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'terminal-output';
    outputDiv.innerHTML = text;
    this.terminalBody.appendChild(outputDiv);
  }
  
  updateCursor() {
    // Cursor animation is handled by CSS
  }
  
  typeInitialCommands() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    let delay = 0;
    
    terminalLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
        
        // Add typing effect to commands
        const command = line.querySelector('.terminal-command');
        if (command && command.textContent !== '_') {
          const text = command.textContent;
          command.textContent = '';
          command.style.borderRight = '2px solid #7c3aed';
          
          let i = 0;
          const typeInterval = setInterval(() => {
            command.textContent += text[i];
            i++;
            if (i >= text.length) {
              clearInterval(typeInterval);
              command.style.borderRight = 'none';
              
              // Show output after command
              setTimeout(() => {
                const output = line.nextElementSibling;
                if (output && output.classList.contains('terminal-output')) {
                  output.style.opacity = '1';
                  output.style.transform = 'translateY(0)';
                }
              }, 500);
            }
          }, 100);
        }
      }, delay);
      
      delay += 1000;
    });
    
    // After initial animation, make terminal interactive
    setTimeout(() => {
      this.isTyping = false;
      this.createNewLine();
    }, delay + 1000);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initResumeTabs();
  initMobileMenu();
  
  // Initialize terminal after a short delay to ensure DOM is ready
  setTimeout(() => {
    new Terminal();
  }, 500);
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
  const mainContent = document.querySelector('.main-content');
  
  if (mobileMenuBtn && sidebar && mainContent) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
      mainContent.classList.toggle('sidebar-open');
      
      // Update button icon
      const icon = mobileMenuBtn.querySelector('ion-icon');
      if (sidebar.classList.contains('sidebar-open')) {
        icon.name = 'close-outline';
      } else {
        icon.name = 'menu-outline';
      }
    });
    
    // Close mobile menu when clicking on a link
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('sidebar-open');
        mainContent.classList.remove('sidebar-open');
        const icon = mobileMenuBtn.querySelector('ion-icon');
        icon.name = 'menu-outline';
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('sidebar-open');
        mainContent.classList.remove('sidebar-open');
        const icon = mobileMenuBtn.querySelector('ion-icon');
        icon.name = 'menu-outline';
      }
    });
  }
}

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
  const revealElements = document.querySelectorAll('.service-item, .project-item, .skills-item, .timeline-item');
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