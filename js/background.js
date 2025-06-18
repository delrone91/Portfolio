// ====================================================
// GESTIONNAIRE DE FOND ET DÉGRADÉS
// ====================================================
const backgroundManager = {
    currentGradientColors: [],
    overlay: null,

    /**
     * Initialise le gestionnaire de fond
     */
    init: function() {
        this.overlay = document.querySelector('#background-overlay');
        
        if (!this.overlay) {
            console.warn("L'élément background-overlay n'a pas été trouvé.");
            return;
        }
        
        // Assure que l'overlay a les bonnes propriétés pour éviter les problèmes de défilement
        this.overlay.style.pointerEvents = 'none';
        this.overlay.style.zIndex = '-10';
        
        this.currentGradientColors = this.generateGradient();
        this.applyGradientToOverlay();
        this.initMouseTracking();
        
        // Met à jour le dégradé périodiquement
        setInterval(() => this.updateGradients(), CONFIG.gradientUpdateInterval);
    },

    /**
     * Génère un nouveau dégradé aléatoire
     * @returns {Array} Tableau de couleurs pour le dégradé
     */
    generateGradient: function() {
        const randomColors = [];
        for (let i = 0; i < 3; i++) {
            const randomColor = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
            randomColors.push(randomColor);
        }
        return randomColors;
    },

    /**
     * Met à jour le dégradé en supprimant la première couleur et en ajoutant une nouvelle
     */
    updateGradients: function() {
        if (!this.overlay) return;
        
        // Supprime la première couleur
        this.currentGradientColors.shift();
        
        // Ajoute une nouvelle couleur aléatoire à la fin
        const newColor = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
        this.currentGradientColors.push(newColor);
        
        // Applique le nouveau dégradé avec une transition douce
        this.applyGradientToOverlay(true);
    },

    /**
     * Applique le dégradé actuel à l'élément d'arrière-plan
     * @param {boolean} withTransition - Indique si une transition doit être appliquée
     */
    applyGradientToOverlay: function(withTransition = false) {
        if (!this.overlay) return;
        
        const gradient = `linear-gradient(90deg, ${this.currentGradientColors.join(', ')})`;
        
        if (withTransition) {
            this.overlay.style.transition = 'background-image 1.5s ease-in-out';
            setTimeout(() => {
                this.overlay.style.transition = '';
            }, 1500);
        }
        
        this.overlay.style.backgroundImage = gradient;
    },

    /**
     * Initialise le suivi de la souris pour l'effet parallaxe
     */
    initMouseTracking: function() {
        if (!this.overlay) return;
        
        document.addEventListener('mousemove', eventManager.throttle((e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            requestAnimationFrame(() => {
                if (this.overlay) {
                    this.overlay.style.backgroundSize = '250% 250%';
                    this.overlay.style.backgroundPosition = `${x}% ${y}%`;
                }
            });
        }, 20)); // Throttle de 20ms pour optimiser les performances
    }
};