// Function to initialize the page
function initDashboard() {
    // Setup modal windows
    setupModals();
    
    // Setup quick action cards
    setupActionCards();
    
    // Setup style cards hover effects
    setupStyleCards();
    
    // Setup project search
    setupSearch();
}

// Setup modal windows
function setupModals() {
    const newProjectBtn = document.querySelector('.action-card.primary');
    const createBtn = document.querySelector('.hero-buttons .btn-primary');
    const ctaBtn = document.querySelector('.cta-section .btn-primary');
    
    const newProjectModal = document.getElementById('newProjectModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    const openModal = (modal) => {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent page scrolling
        }
    };
    
    const closeModal = (modal) => {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };
    
    // Add listeners to all buttons that should open the new project modal
    [newProjectBtn, createBtn, ctaBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => openModal(newProjectModal));
        }
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside its content
    window.addEventListener('click', (event) => {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
}

// Setup action cards hover effects
function setupActionCards() {
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.action-icon');
            if (icon) {
                icon.style.color = 'var(--color-primary)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.action-icon');
            if (icon) {
                icon.style.color = 'var(--color-text-secondary)';
            }
        });
    });
}

// Setup style cards hover effects
function setupStyleCards() {
    const styleCards = document.querySelectorAll('.style-card');
    
    styleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Project search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (searchInput && projectCards.length) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            projectCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || searchTerm === '') {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Handle option card selection in modal
function setupOptionCards() {
    const optionCards = document.querySelectorAll('.option-card');
    
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Highlight the selected option
            optionCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Apply visual style to selected option
            card.style.borderColor = 'var(--color-primary)';
            card.style.backgroundColor = 'var(--color-hover-bg)';
        });
    });
}

// Run after page loads
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupOptionCards();
}); 