// ====================================================
// PARALLAXE AVANCÉ
// ====================================================
const parallaxManager = {
    elements: null,
    scrollY: 0,
    
    /**
     * Initialise le gestionnaire d'effet parallaxe
     */
    init: function() {
        // Ajoute des éléments de parallaxe au DOM
        this.createParallaxElements();
        
        // Initialise les écouteurs d'événements
        this.initEvents();
    },
    
    /**
     * Crée des éléments pour l'effet parallaxe
     */
    createParallaxElements: function() {
        // Crée un conteneur pour les éléments de parallaxe
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'parallax-container';
        
        // Crée plusieurs formes géométriques flottantes
        for (let i = 0; i < 7; i++) {
            const element = document.createElement('div');
            element.className = 'parallax-element';
            element.classList.add(`shape-${i + 1}`);
            
            // Définit une position aléatoire
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.pointerEvents = 'none'; // Assure que les éléments ne bloquent pas les interactions
            
            // Attribue un facteur de parallaxe aléatoire pour chaque élément
            const parallaxSpeed = 0.05 + Math.random() * 0.15;
            element.dataset.parallaxSpeed = parallaxSpeed;
            element.dataset.baseTop = parseInt(element.style.top);
            
            // Ajoute l'élément au conteneur
            parallaxContainer.appendChild(element);
        }
        
        // Insère le conteneur après l'overlay (important pour l'ordre du z-index)
        const overlay = document.getElementById('background-overlay');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.insertBefore(parallaxContainer, overlay.nextSibling);
        } else {
            // Fallback si l'overlay n'est pas trouvé
            document.body.insertBefore(parallaxContainer, document.body.firstChild);
        }
        
        // Stocke les éléments pour la manipulation ultérieure
        this.elements = document.querySelectorAll('.parallax-element');
    },
    
    /**
     * Initialise les écouteurs d'événements pour l'effet parallaxe
     */
    initEvents: function() {
        // Effet de parallaxe au mouvement de la souris
        document.addEventListener('mousemove', eventManager.throttle((e) => {
            this.updateParallaxPosition(e);
        }, 20));
        
        // Effet de parallaxe au défilement
        window.addEventListener('scroll', eventManager.throttle(() => {
            this.scrollY = window.scrollY;
            this.updateParallaxScroll();
        }, 10));
        
        // Position initiale
        this.updateParallaxScroll();
    },
    
    /**
     * Met à jour la position des éléments de parallaxe en fonction de la souris
     * @param {MouseEvent} e - Événement de mouvement de souris
     */
    updateParallaxPosition: function(e) {
        if (!this.elements) return;
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        this.elements.forEach((element, index) => {
            // Intensité différente selon l'élément (profondeur de l'effet)
            const intensity = 0.01 + (index % 3) * 0.01;
            
            // Calcul de la translation
            const translateX = deltaX * intensity;
            const translateY = deltaY * intensity;
            
            // Application de la transformation (combinée avec l'effet de défilement)
            const scrollOffset = this.getScrollOffset(element);
            requestAnimationFrame(() => {
                element.style.transform = `translate(${translateX}px, ${translateY + scrollOffset}px)`;
            });
        });
    },
    
    /**
     * Met à jour la position des éléments en fonction du défilement
     */
    updateParallaxScroll: function() {
        if (!this.elements) return;
        
        this.elements.forEach(element => {
            const scrollOffset = this.getScrollOffset(element);
            
            // Récupérer les valeurs actuelles de translation X (du mouvement de souris)
            let currentTransform = element.style.transform || '';
            let translateX = 0;
            
            // Extraire la valeur X du transform actuel si elle existe
            const match = currentTransform.match(/translate\(([^,]+)px,/);
            if (match && match[1]) {
                translateX = parseFloat(match[1]);
            }
            
            requestAnimationFrame(() => {
                element.style.transform = `translate(${translateX}px, ${scrollOffset}px)`;
            });
        });
    },
    
    /**
     * Calcule le décalage vertical basé sur le défilement pour un élément
     * @param {HTMLElement} element - Élément de parallaxe
     * @returns {number} - Décalage vertical en pixels
     */
    getScrollOffset: function(element) {
        const speed = parseFloat(element.dataset.parallaxSpeed) || 0.1;
        return this.scrollY * speed * -1; // Multiplication par -1 pour effet inverse au défilement
    }
};