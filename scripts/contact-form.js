// === Amélioration du formulaire de contact ===
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitBtn = this.form?.querySelector('.submit-btn');
    this.btnText = this.form?.querySelector('.btn-text');
    this.btnLoading = this.form?.querySelector('.btn-loading');
    
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
    this.setupValidation();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Animation des labels flottants
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => this.handleFocus(input));
      input.addEventListener('blur', () => this.handleBlur(input));
    });
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateField(input));
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  handleFocus(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('focused');
  }

  handleBlur(input) {
    const formGroup = input.closest('.form-group');
    if (!input.value.trim()) {
      formGroup.classList.remove('focused');
    }
  }

  validateField(field) {
    const formGroup = field.closest('.form-group');
    let isValid = true;
    let errorMessage = '';

    // Supprimer les erreurs précédentes
    this.clearFieldError(formGroup);

    // Validation selon le type de champ
    switch (field.type) {
      case 'email':
        isValid = this.validateEmail(field.value);
        errorMessage = 'Veuillez entrer une adresse e-mail valide';
        break;
      case 'text':
        isValid = field.value.trim().length >= 2;
        errorMessage = 'Ce champ doit contenir au moins 2 caractères';
        break;
      default:
        if (field.tagName === 'TEXTAREA') {
          isValid = field.value.trim().length >= 10;
          errorMessage = 'Le message doit contenir au moins 10 caractères';
        } else if (field.tagName === 'SELECT') {
          isValid = field.value !== '';
          errorMessage = 'Veuillez sélectionner un sujet';
        }
    }

    if (!isValid && field.value.trim() !== '') {
      this.showFieldError(formGroup, errorMessage);
    } else if (isValid) {
      this.showFieldSuccess(formGroup);
    }

    return isValid;
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearFieldError(formGroup) {
    formGroup.classList.remove('error', 'success');
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
  }

  showFieldSuccess(formGroup) {
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Valider tous les champs
    const fields = this.form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      ToastNotification.show('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }

    // Afficher l'état de chargement
    this.setLoadingState(true);

    try {
      const formData = new FormData(this.form);
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        this.handleSuccess();
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading) {
    if (loading) {
      this.submitBtn.disabled = true;
      this.btnText.style.display = 'none';
      this.btnLoading.style.display = 'inline-flex';
    } else {
      this.submitBtn.disabled = false;
      this.btnText.style.display = 'inline';
      this.btnLoading.style.display = 'none';
    }
  }

  handleSuccess() {
    ToastNotification.show('Message envoyé avec succès ! Je vous répondrai rapidement.', 'success', 5000);
    this.form.reset();
    
    // Réinitialiser les états des champs
    const formGroups = this.form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      group.classList.remove('focused', 'error', 'success');
    });

    // Animation de succès
    this.form.classList.add('success-animation');
    setTimeout(() => {
      this.form.classList.remove('success-animation');
    }, 2000);
  }

  handleError(error) {
    console.error('Erreur:', error);
    ToastNotification.show('Erreur lors de l\'envoi du message. Veuillez réessayer.', 'error');
  }
}

// === Système de copie rapide pour les informations de contact ===
class ContactInfo {
  static init() {
    // Ajouter des boutons de copie aux informations de contact
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
      const link = item.querySelector('a');
      if (link && (link.href.startsWith('mailto:') || link.href.startsWith('https:'))) {
        this.addCopyButton(item, link);
      }
    });
  }

  static addCopyButton(item, link) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'contact-copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = 'Copier';
    
    copyBtn.onclick = (e) => {
      e.preventDefault();
      let textToCopy = link.textContent;
      
      if (link.href.startsWith('mailto:')) {
        textToCopy = link.href.replace('mailto:', '');
      } else if (link.href.startsWith('https:')) {
        textToCopy = link.href;
      }
      
      this.copyToClipboard(textToCopy, copyBtn);
    };
    
    item.appendChild(copyBtn);
  }

  static async copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.classList.add('copied');
      ToastNotification.show('Copié dans le presse-papiers !', 'success', 2000);
      
      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      ToastNotification.show('Erreur lors de la copie', 'error');
    }
  }
}

// === Initialisation ===
document.addEventListener('DOMContentLoaded', () => {
  new ContactForm();
  ContactInfo.init();
});