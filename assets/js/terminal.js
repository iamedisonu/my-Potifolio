class InteractiveTerminal {
  constructor() {
    this.terminalBody = document.getElementById('terminal-body');
    this.currentLine = null;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.isTyping = false;
    this.isInitialized = false;
    
    this.commands = {
      'help': () => this.showHelp(),
      'about': () => this.showAbout(),
      'projects': () => this.showProjects(),
      'skills': () => this.showSkills(),
      'contact': () => this.showContact(),
      'clear': () => this.clearTerminal(),
      'github': () => this.openGitHub(),
      'linkedin': () => this.openLinkedIn(),
      'whoami': () => this.showWhoAmI(),
      'ls': () => this.listFiles(),
      'cat': (args) => this.catFile(args),
      'git': (args) => this.gitCommand(args),
      'pwd': () => this.printWorkingDirectory(),
      'date': () => this.showDate(),
      'echo': (args) => this.echoText(args),
      'neofetch': () => this.showNeofetch(),
      'tree': () => this.showTree(),
      'find': (args) => this.findFiles(args),
      'grep': (args) => this.grepFiles(args),
      'history': () => this.showHistory(),
      'exit': () => this.exitTerminal()
    };
    
    this.init();
  }
  
  init() {
    if (!this.terminalBody) {
      console.warn('Terminal body not found');
      return;
    }
    
    // Make terminal focusable
    this.terminalBody.setAttribute('tabindex', '0');
    this.terminalBody.style.outline = 'none';
    
    // Add event listeners
    this.terminalBody.addEventListener('click', () => this.focusTerminal());
    this.terminalBody.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // Start with a new line
    this.createNewLine();
    this.isInitialized = true;
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
      this.handleCtrlC();
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
    
    // Scroll to bottom
    this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    
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
• <span class="command-highlight">help</span> - Show this help message<br>
• <span class="command-highlight">about</span> - About me<br>
• <span class="command-highlight">projects</span> - List my projects<br>
• <span class="command-highlight">skills</span> - Show my skills<br>
• <span class="command-highlight">contact</span> - Contact information<br>
• <span class="command-highlight">clear</span> - Clear terminal<br>
• <span class="command-highlight">github</span> - Open GitHub profile<br>
• <span class="command-highlight">linkedin</span> - Open LinkedIn profile<br>
• <span class="command-highlight">whoami</span> - Show who I am<br>
• <span class="command-highlight">ls</span> - List files<br>
• <span class="command-highlight">cat [file]</span> - Display file contents<br>
• <span class="command-highlight">git [command]</span> - Git commands<br>
• <span class="command-highlight">pwd</span> - Print working directory<br>
• <span class="command-highlight">date</span> - Show current date<br>
• <span class="command-highlight">echo [text]</span> - Display text<br>
• <span class="command-highlight">neofetch</span> - System information<br>
• <span class="command-highlight">tree</span> - Show directory tree<br>
• <span class="command-highlight">history</span> - Show command history`;
  }
  
  showAbout() {
    return `Hello! I'm Edison Uwamungu, a Computer Science with AI student.<br><br>
I'm passionate about artificial intelligence, machine learning, and data science. 
Currently pursuing my degree at Oklahoma Christian University, I'm working on 
exciting projects like eagleAI and constantly exploring new AI technologies 
to develop innovative solutions to real-world problems.<br><br>
I love building things that make a difference and I'm always eager to learn 
new technologies and collaborate on interesting projects!`;
  }
  
  showProjects() {
    return `My Featured Projects:<br><br>
📁 <span class="project-name">eagleAI/</span> - AI-powered platform for intelligent automation<br>
📁 <span class="project-name">amazon-clone/</span> - Full-stack e-commerce application<br>
📁 <span class="project-name">ai-web-scraper/</span> - Intelligent web scraping with AI<br>
📁 <span class="project-name">bright-futures-hub/</span> - Educational platform<br>
📁 <span class="project-name">bulk-report/</span> - Data processing and reporting tool<br><br>
Use 'cat [project-name]/README.md' to learn more about any project!`;
  }
  
  showSkills() {
    return `Technical Skills:<br><br>
<span class="skill-category">Programming Languages:</span><br>
• Python | JavaScript | C++ | Java | SQL<br><br>
<span class="skill-category">Web Technologies:</span><br>
• HTML5 | CSS3 | React | Node.js | Express<br><br>
<span class="skill-category">AI/ML & Data Science:</span><br>
• Machine Learning | Deep Learning | TensorFlow | PyTorch<br>
• Data Analysis | Pandas | NumPy | Scikit-learn<br><br>
<span class="skill-category">Tools & Technologies:</span><br>
• Git | Docker | AWS | Linux | VS Code | Jupyter`;
  }
  
  showContact() {
    return `Contact Information:<br><br>
📧 Email: edison.uwamungu@example.com<br>
📱 Phone: +1 (234) 567-8900<br>
🌐 LinkedIn: linkedin.com/in/edison-uwamungu<br>
🐙 GitHub: github.com/edison-uwamungu<br>
🐦 Twitter: @edisonuwamungu<br><br>
Feel free to reach out for opportunities or collaboration!`;
  }
  
  clearTerminal() {
    this.terminalBody.innerHTML = '';
    this.createNewLine();
    return null;
  }
  
  openGitHub() {
    window.open('https://github.com/edison-uwamungu', '_blank');
    return 'Opening GitHub profile...';
  }
  
  openLinkedIn() {
    window.open('https://linkedin.com/in/edison-uwamungu', '_blank');
    return 'Opening LinkedIn profile...';
  }
  
  showWhoAmI() {
    return 'Computer Science with AI Student | Machine Learning Enthusiast | AI Developer';
  }
  
  listFiles() {
    return `📁 projects/<br>
📁 documents/<br>
📁 images/<br>
📁 scripts/<br>
📄 resume.pdf<br>
📄 README.md<br>
📄 skills.txt<br>
📄 contact.txt`;
  }
  
  catFile(args) {
    const file = args[0];
    if (!file) return 'Usage: cat [filename]';
    
    const files = {
      'skills.txt': 'Python | JavaScript | C++ | Java | React | Node.js | AI/ML | Data Science',
      'contact.txt': 'Email: edison.uwamungu@example.com\nPhone: +1 (234) 567-8900\nLinkedIn: linkedin.com/in/edison-uwamungu',
      'README.md': '# Edison Uwamungu Portfolio\n\nComputer Science with AI student passionate about technology and innovation.',
      'resume.pdf': 'Resume file - Use browser to view or download'
    };
    
    return files[file] || `File not found: ${file}`;
  }
  
  gitCommand(args) {
    const command = args[0];
    switch(command) {
      case 'status':
        return `On branch main<br>Your branch is up to date with 'origin/main'<br>nothing to commit, working tree clean`;
      case 'log':
        return `commit fa0da14 (HEAD -> main)<br>Author: Edison Uwamungu<br>Date: Fri Oct 10 11:28:07 2025<br><br>    Make website fully responsive`;
      case 'branch':
        return `* main<br>  develop<br>  feature/ai-integration`;
      default:
        return `Git command '${command}' not implemented. Try: status, log, branch`;
    }
  }
  
  printWorkingDirectory() {
    return '/home/edison/portfolio';
  }
  
  showDate() {
    return new Date().toString();
  }
  
  echoText(args) {
    return args.join(' ');
  }
  
  showNeofetch() {
    return `                    .-/+oossssoo+/-.                edison@portfolio<br>
                \`:+ssssssssssssssssss+:\`               ------------<br>
              -+ssssssssssssssssssyyssssss+              OS: Portfolio v1.0<br>
            .ossssssssssssssssss<span class="neofetch-accent">dMMMNy</span>ssssssssso.            Kernel: Web 3.0<br>
           /sssssssssssh<span class="neofetch-accent">dMMNNh</span>ssssssssssssssssss/           Uptime: 24/7<br>
          +sssssssss<span class="neofetch-accent">hmm</span>+N<span class="neofetch-accent">MMN</span>m<span class="neofetch-accent">my</span>ssssssssssssssssss+          Shell: Interactive Terminal<br>
         /ssssssss<span class="neofetch-accent">hNMMM</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssss/         CPU: Brain 100%<br>
        .ssssssss<span class="neofetch-accent">dMMMN</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssssss.        Memory: 8GB RAM<br>
        +sssshhhy<span class="neofetch-accent">NMMN</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssssss+        GPU: Imagination RTX 4090<br>
        ossy<span class="neofetch-accent">NMMMN</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssssssss+        Disk: 1TB SSD<br>
        ossy<span class="neofetch-accent">NMMMN</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssssssss+        Terminal: Web Terminal<br>
        +sssshhhy<span class="neofetch-accent">NMMN</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssssss+        Theme: Dark Mode<br>
        .ssssssss<span class="neofetch-accent">dMMMN</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssssss.        Languages: Python, JS, C++<br>
         /ssssssss<span class="neofetch-accent">hNMMM</span>+N<span class="neofetch-accent">MMMN</span>h<span class="neofetch-accent">y</span>ssssssssssssssssssss/         AI/ML: TensorFlow, PyTorch<br>
          +sssssssss<span class="neofetch-accent">hmm</span>+N<span class="neofetch-accent">MMN</span>m<span class="neofetch-accent">my</span>ssssssssssssssssss+          Web: React, Node.js<br>
           \\sssssssssssh<span class="neofetch-accent">dMMNNh</span>ssssssssssssssssss/           Contact: edison.uwamungu@example.com<br>
            .ossssssssssssssssss<span class="neofetch-accent">dMMMNy</span>ssssssssso.            <br>
              -+ssssssssssssssssssyyssssss+               <br>
                \`:+ssssssssssssssssss+:\`               <br>
                    .-/+oossssoo+/-.`;
  }
  
  showTree() {
    return `portfolio/<br>
├── projects/<br>
│   ├── eagleAI/<br>
│   ├── amazon-clone/<br>
│   ├── ai-web-scraper/<br>
│   ├── bright-futures-hub/<br>
│   └── bulk-report/<br>
├── documents/<br>
│   ├── resume.pdf<br>
│   └── transcripts/<br>
├── images/<br>
│   ├── profile.jpg<br>
│   └── projects/<br>
├── scripts/<br>
│   ├── deploy.sh<br>
│   └── setup.py<br>
├── README.md<br>
├── skills.txt<br>
└── contact.txt`;
  }
  
  findFiles(args) {
    const pattern = args[0];
    if (!pattern) return 'Usage: find [pattern]';
    
    return `Searching for files matching "${pattern}":<br>
./projects/eagleAI/README.md<br>
./projects/amazon-clone/package.json<br>
./scripts/setup.py<br>
./README.md<br>
Found 4 files matching "${pattern}"`;
  }
  
  grepFiles(args) {
    const pattern = args[0];
    if (!pattern) return 'Usage: grep [pattern] [file]';
    
    return `Searching for "${pattern}" in files:<br>
./README.md:1:Edison Uwamungu Portfolio<br>
./skills.txt:1:Python | JavaScript | C++<br>
./contact.txt:1:edison.uwamungu@example.com<br>
Found 3 matches for "${pattern}"`;
  }
  
  showHistory() {
    if (this.commandHistory.length === 0) {
      return 'No commands in history yet.';
    }
    
    return this.commandHistory.map((cmd, index) => 
      `${index + 1}  ${cmd}`
    ).join('<br>');
  }
  
  exitTerminal() {
    return 'Terminal session ended. Refresh page to restart.';
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
  
  handleCtrlC() {
    this.addOutput('^C');
    this.createNewLine();
  }
  
  addOutput(text) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'terminal-output';
    outputDiv.innerHTML = text;
    this.terminalBody.appendChild(outputDiv);
    this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
  }
  
  updateCursor() {
    // Cursor animation is handled by CSS
  }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new InteractiveTerminal();
  }, 500);
});
