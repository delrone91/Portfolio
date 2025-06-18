// ====================================================
// CONFIGURATION GÉNÉRALE
// ====================================================
const CONFIG = {
    cursorSize: 30,
    cursorBorderSize: 2,
    gradientUpdateInterval: 10000, // 10 secondes
    colors: ['#ff5733', '#33ff57', '#3357ff', '#f1c40f', '#9b59b6', '#e74c3c', '#1abc9c', '#8e44ad', '#16a085', '#d35400'],
    animationThreshold: 100, // Distance en pixels pour déclencher les animations
    scrollThreshold: 20, // Seuil pour le défilement
};

// ====================================================
// VÉRIFICATION DE STRUCTURE DU DOCUMENT
// ====================================================
function checkDocumentStructure() {
    // S'assure que l'overlay n'est pas mal positionné
    const overlay = document.getElementById('background-overlay');
    const main = document.querySelector('main');
    
    if (overlay && main && overlay.contains(main)) {
        console.warn("Problème détecté: l'overlay contient le contenu principal!");
        
        // Correction automatique de la structure
        document.body.appendChild(main);
        if (overlay.parentNode) {
            overlay.parentNode.insertBefore(overlay, overlay.parentNode.firstChild);
        }
    }

    // Force le défilement au démarrage
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
}

// ====================================================
// GESTIONNAIRE D'ÉVÉNEMENTS OPTIMISÉ
// ====================================================
const eventManager = {
    /**
     * Applique un throttle aux événements pour limiter leur fréquence d'exécution
     * @param {Function} callback - Fonction à exécuter 
     * @param {number} delay - Délai entre les exécutions
     * @returns {Function} - Fonction avec throttle
     */
    throttle: function(callback, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback.apply(this, args);
            }
        };
    },

    /**
     * Applique un debounce aux événements pour retarder leur exécution
     * @param {Function} callback - Fonction à exécuter
     * @param {number} delay - Délai avant exécution
     * @returns {Function} - Fonction avec debounce
     */
    debounce: function(callback, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => callback.apply(this, args), delay);
        };
    }
};