// Portfolio Filter System
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Initialize filter system
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects with animation
      filterProjects(filter);
      
      // Show toast notification
      if (window.showToast) {
        const categoryName = button.querySelector('span').textContent;
        window.showToast(`Filtrage par: ${categoryName}`, 'info');
      }
    });
  });

  function filterProjects(filter) {
    projectCards.forEach((card, index) => {
      const categories = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || categories.includes(filter);
      
      if (shouldShow) {
        // Show with staggered animation
        setTimeout(() => {
          card.classList.remove('hidden');
          card.classList.add('visible');
          card.style.display = 'block';
        }, index * 100);
      } else {
        // Hide immediately
        card.classList.add('hidden');
        card.classList.remove('visible');
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  // Project card interactions
  projectCards.forEach(card => {
    // Add hover sound effect (optional)
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });

    // Add click analytics (you can integrate with your analytics)
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        const projectTitle = card.querySelector('h3').textContent;
        console.log(`Project viewed: ${projectTitle}`);
        
        // Optional: Show project details modal
        // showProjectModal(card);
      }
    });
  });

  // Project links with confirmation
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const projectTitle = link.closest('.project-card').querySelector('h3').textContent;
      
      // If link is placeholder (#), show coming soon message
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        if (window.showToast) {
          window.showToast(`${projectTitle} - Lien bientôt disponible!`, 'info');
        }
      }
    });
  });

  // GitHub links with confirmation
  document.querySelectorAll('.github-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const projectTitle = link.closest('.project-card').querySelector('h3').textContent;
      
      // If link is placeholder (#), show coming soon message
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        if (window.showToast) {
          window.showToast(`Code source de "${projectTitle}" bientôt disponible!`, 'info');
        }
      }
    });
  });

  // Search functionality (bonus feature)
  function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Rechercher un projet...';
    searchInput.className = 'project-search';
    searchInput.style.cssText = `
      width: 100%;
      max-width: 400px;
      padding: 12px 20px;
      margin: 20px auto;
      display: block;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 25px;
      color: white;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      outline: none;
      transition: all 0.3s ease;
    `;

    // Insert search before filters
    const filtersSection = document.querySelector('.filters-section');
    if (filtersSection) {
      filtersSection.insertBefore(searchInput, filtersSection.firstChild);
      
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        projectCards.forEach(card => {
          const title = card.querySelector('h3').textContent.toLowerCase();
          const description = card.querySelector('p').textContent.toLowerCase();
          const techs = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
          
          const matches = title.includes(searchTerm) || 
                         description.includes(searchTerm) || 
                         techs.includes(searchTerm);
          
          if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.classList.remove('hidden');
            card.classList.add('visible');
          } else {
            card.style.display = 'none';
            card.classList.add('hidden');
            card.classList.remove('visible');
          }
        });
      });
    }
  }

  // Uncomment to enable search functionality
  // addSearchFunctionality();

  // Initialize all projects as visible
  projectCards.forEach(card => {
    card.classList.add('visible');
  });
});

// Project Modal System (optional advanced feature)
function showProjectModal(projectCard) {
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content glass">
        <button class="modal-close">&times;</button>
        <div class="modal-body">
          ${projectCard.innerHTML}
          <div class="modal-actions">
            <button class="btn-primary">Voir le projet</button>
            <button class="btn-secondary">Code source</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal functionality
  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) {
      modal.remove();
    }
  });
}

// Export functions for global use
window.portfolioFilters = {
  filterProjects: (filter) => {
    const event = new CustomEvent('filterChange', { detail: { filter } });
    document.dispatchEvent(event);
  }
};