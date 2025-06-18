// ====================================================
// GESTIONNAIRE D'ANIMATIONS AU DÉFILEMENT
// ====================================================
const scrollAnimationManager = {
    sections: null,
    currentSection: null,
    navLinks: null,
    
    /**
     * Initialise le gestionnaire d'animations au défilement
     */
    init: function() {
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('nav ul li a');
        
        // Ajoute les classes pour l'animation
        this.sections.forEach(section => {
            section.classList.add('animate-section');
        });
        
        // Initialise l'observateur d'intersection pour les animations au défilement
        this.initIntersectionObserver();
        
        // Ajoute l'écouteur d'événement pour la mise à jour de la navigation
        window.addEventListener('scroll', eventManager.throttle(() => {
            this.updateActiveNavLink();
        }, CONFIG.scrollThreshold));
    },
    
    /**
     * Initialise l'observateur d'intersection pour les animations
     */
    initIntersectionObserver: function() {
        if (!('IntersectionObserver' in window)) {
            // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
            this.sections.forEach(section => section.classList.add('visible'));
            document.querySelectorAll('.projet').forEach(projet => projet.classList.add('visible'));
            return;
        }
        
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Met à jour la section active
                    this.currentSection = entry.target.id;
                    this.updateActiveNavLink();
                }
            });
        }, options);
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
        
        // Observer également chaque projet individuellement pour l'animation
        document.querySelectorAll('.projet').forEach(projet => {
            observer.observe(projet);
        });
    },
    
    /**
     * Met à jour le lien de navigation actif en fonction de la section visible
     */
    updateActiveNavLink: function() {
        if (!this.navLinks || !this.currentSection) return;
        
        this.navLinks.forEach(link => {
            const sectionId = link.getAttribute('href')?.substring(1);
            
            if (sectionId === this.currentSection) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });
    }
};