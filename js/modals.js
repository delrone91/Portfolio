// ====================================================
// GESTIONNAIRE DE MODALES
// ====================================================
const modalManager = {
    modals: null,
    modalButtons: null,
    closeButtons: null,
    previousOverflow: null,
    
    /**
     * Initialise le gestionnaire de modales
     */
    init: function() {
        this.modals = document.querySelectorAll('.modal');
        this.modalButtons = document.querySelectorAll('.voir-projet');
        this.closeButtons = document.querySelectorAll('.close-button');
        
        this.initEvents();
    },
    
    /**
     * Initialise les écouteurs d'événements pour les modales
     */
    initEvents: function() {
        // Gestion des boutons d'ouverture
        this.modalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.dataset.projet;
                const modal = document.getElementById(modalId);
                
                if (modal) {
                    this.openModal(modal);
                }
            });
        });
        
        // Gestion des boutons de fermeture
        this.closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Fermeture en cliquant en dehors
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.closeModal(event.target);
            }
        });
        
        // Fermeture avec la touche Echap
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    },
    
    /**
     * Ouvre une modale avec animation
     * @param {HTMLElement} modal - Élément modale à ouvrir
     */
    openModal: function(modal) {
        // Garde une référence au comportement de défilement précédent
        this.previousOverflow = document.body.style.overflow;
        
        // Empêche le défilement du corps seulement pour la modale
        document.body.style.overflow = 'hidden';
        
        // Affiche la modale
        modal.style.display = 'block';
        
        // Ajoute l'animation après un court délai
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    },
    
    /**
     * Ferme une modale avec animation
     * @param {HTMLElement} modal - Élément modale à fermer
     */
    closeModal: function(modal) {
        // Retire la classe d'animation
        modal.classList.remove('show');
        
        // Masque la modale après la fin de l'animation
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Restaure le comportement de défilement précédent
            document.body.style.overflow = this.previousOverflow || 'auto';
        }, 300); // Durée de l'animation
    }
};