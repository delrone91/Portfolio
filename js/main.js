// ====================================================
// INITIALISATION DE TOUTES LES FONCTIONNALITÉS - MIS À JOUR
// ====================================================

/**
 * Fonction principale d'initialisation du portfolio
 * Coordonne l'initialisation de tous les modules
 */
function initializePortfolio() {
    // Vérification initiale de la structure du document
    checkDocumentStructure();
    
    // Force le défilement dès le début
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Initialise le chargement de la page
    pageLoadManager.init();
    
    // Initialise le gestionnaire de curseur
    cursorManager.init();
    
    // Initialise le gestionnaire de fond
    backgroundManager.init();
    
    // Initialise le gestionnaire d'animations au défilement
    scrollAnimationManager.init();
    
    // Initialise le gestionnaire de modales
    modalManager.init();
    
    // Initialise le gestionnaire de formulaire
    contactFormManager.init();
    
    // Initialise le gestionnaire de thème
    themeManager.init();
    
    // Initialise le gestionnaire d'effet parallaxe
    parallaxManager.init();
    
    // Initialise la navigation fluide
    initSmoothNavigation();
    
    // Vérification supplémentaire après un court délai
    setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }, 500);
    
    // Log de confirmation pour le développement
    console.log('Portfolio initialisé avec succès!');
}

/**
 * Initialise la navigation fluide vers les sections
 */
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Exécute l'initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Fallback au cas où DOMContentLoaded a déjà été déclenché
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}