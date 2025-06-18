// ====================================================
// CHARGEMENT DE LA PAGE ET ANIMATIONS D'ENTRÉE
// ====================================================
const pageLoadManager = {
    /**
     * Initialise le gestionnaire de chargement de page
     */
    init: function() {
        // Crée le chargeur de page
        this.createLoader();
        
        // Initialise les animations d'entrée
        this.initEntranceAnimations();
        
        // S'assure que le défilement est activé
        this.enableScrolling();
    },
    
    /**
     * S'assure que le défilement est activé
     */
    enableScrolling: function() {
        // Réactive le défilement au cas où il aurait été désactivé
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflowY = 'auto';
        
        // Vérifie après un délai pour s'assurer que le défilement est activé
        setTimeout(() => {
            if (document.body.style.overflowY !== 'auto') {
                document.body.style.overflowY = 'auto';
            }
        }, 1000);
    },
    
    /**
     * Crée et gère le chargeur de page
     */
    createLoader: function() {
        // Crée le conteneur du chargeur
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        
        // Crée les éléments d'animation
        const loaderContent = document.createElement('div');
        loaderContent.className = 'loader-content';
        loaderContent.innerHTML = `
            <div class="loader-spinner"></div>
            <div class="loader-text">Chargement...</div>
        `;
        
        // Ajoute le contenu au chargeur
        loader.appendChild(loaderContent);
        
        // Ajoute le chargeur au début du document
        document.body.prepend(loader);
        
        // Masque le chargeur une fois la page chargée
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded');
                
                // Supprime le chargeur après l'animation
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 500); // Délai minimal pour voir le chargeur
        });
    },
    
    /**
     * Initialise les animations d'entrée des éléments
     */
    initEntranceAnimations: function() {
        // Anime les éléments du header
        const header = document.querySelector('header');
        if (header) {
            header.classList.add('animate-header');
        }
        
        // Anime le curseur personnalisé
        setTimeout(() => {
            const cursor = document.getElementById('custom-cursor');
            const follower = document.getElementById('cursor-follower');
            
            if (cursor) cursor.classList.add('visible');
            if (follower) follower.classList.add('visible');
        }, 1000);
    }
};