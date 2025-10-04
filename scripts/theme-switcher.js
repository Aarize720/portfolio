// === Système de thème sombre/clair ===
class ThemeSwitcher {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.createThemeToggle();
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  createThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
      <i class="fas fa-sun sun-icon"></i>
      <i class="fas fa-moon moon-icon"></i>
    `;
    themeToggle.setAttribute('aria-label', 'Changer de thème');
    
    // Ajouter le bouton à la navigation
    const nav = document.querySelector('nav');
    if (nav) {
      nav.appendChild(themeToggle);
    }
  }

  bindEvents() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.classList.toggle('light-mode', theme === 'light');
    }
  }
}

// === Système de notifications toast ===
class ToastNotification {
  static show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas ${this.getIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Créer le conteneur s'il n'existe pas
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    container.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto-suppression
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  static getIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  }
}

// === Système de scroll progressif ===
class ScrollProgress {
  constructor() {
    this.createProgressBar();
    this.updateProgress();
    window.addEventListener('scroll', () => this.updateProgress());
  }

  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
  }

  updateProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${scrollPercent}%`;
    }
  }
}

// === Système de copie rapide ===
class CopyToClipboard {
  static init() {
    // Ajouter des boutons de copie aux éléments code
    document.querySelectorAll('code').forEach(codeElement => {
      if (codeElement.textContent.length > 10) {
        this.addCopyButton(codeElement);
      }
    });
  }

  static addCopyButton(element) {
    const wrapper = document.createElement('div');
    wrapper.className = 'code-wrapper';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.onclick = () => this.copyText(element.textContent, copyBtn);
    
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    wrapper.appendChild(copyBtn);
  }

  static async copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.classList.add('copied');
      ToastNotification.show('Texte copié !', 'success', 2000);
      
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      ToastNotification.show('Erreur lors de la copie', 'error');
    }
  }
}

// === Système de retour en haut ===
class BackToTop {
  constructor() {
    this.createButton();
    this.bindEvents();
  }

  createButton() {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(button);
  }

  bindEvents() {
    const button = document.getElementById('back-to-top');
    
    // Afficher/masquer selon le scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    });

    // Action de clic
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// === Initialisation ===
document.addEventListener('DOMContentLoaded', () => {
  new ThemeSwitcher();
  new ScrollProgress();
  new BackToTop();
  CopyToClipboard.init();
});

// Export pour utilisation globale
window.ToastNotification = ToastNotification;