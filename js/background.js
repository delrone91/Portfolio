// ====================================================
// GESTIONNAIRE DE FOND ET DÉGRADÉS - AVEC CARTES DYNAMIQUES ET INTERACTIVES
// ====================================================
const backgroundManager = {
    currentGradientColors: [],
    overlay: null,
    introCards: null,

    /**
     * Initialise le gestionnaire de fond
     */
    init: function() {
        this.overlay = document.querySelector('#background-overlay');
        this.introCards = document.querySelectorAll('.intro-card');
        
        if (!this.overlay) {
            console.warn("L'élément background-overlay n'a pas été trouvé.");
            return;
        }
        
        // Assure que l'overlay a les bonnes propriétés pour éviter les problèmes de défilement
        this.overlay.style.pointerEvents = 'none';
        this.overlay.style.zIndex = '-10';
        
        this.currentGradientColors = this.generateGradient();
        this.applyGradientToOverlay();
        this.updateIntroCardsColors();
        this.initMouseTracking();
        this.initCardInteractivity();
        
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
        this.updateIntroCardsColors();
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
     * Met à jour les couleurs des cartes d'introduction
     */
    updateIntroCardsColors: function() {
        if (!this.introCards || this.introCards.length === 0) return;
        
        this.introCards.forEach((card, index) => {
            if (index < this.currentGradientColors.length) {
                const color = this.currentGradientColors[index];
                // Convertit la couleur hex en rgba avec moins d'opacité pour plus de transparence
                const rgba = this.hexToRgba(color, 0.75);
                card.style.setProperty('--card-base-color', rgba);
                card.style.backgroundColor = rgba;
                card.style.transition = 'background-color 1.5s ease-in-out';
            }
        });
    },

    /**
     * Initialise l'interactivité des cartes avec la souris
     */
    initCardInteractivity: function() {
        if (!this.introCards || this.introCards.length === 0) return;
        
        this.introCards.forEach((card, index) => {
            // Stocke la couleur de base de la carte
            let baseColor = this.currentGradientColors[index] || CONFIG.colors[0];
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calcul de l'angle et de la distance depuis le centre
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                // Effet de rotation 3D basé sur la position de la souris
                const rotateX = deltaY * -10; // Rotation sur l'axe X
                const rotateY = deltaX * 10;  // Rotation sur l'axe Y
                
                // Intensité de la couleur basée sur la distance du centre
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const intensity = Math.min(distance, 1);
                
                // Couleur plus intense au survol
                const currentColor = this.currentGradientColors[index] || baseColor;
                const hoverOpacity = 0.75 + (intensity * 0.15); // 0.75 à 0.9
                const hoverColor = this.hexToRgba(currentColor, hoverOpacity);
                
                requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                    card.style.backgroundColor = hoverColor;
                    card.style.boxShadow = `0 ${10 + intensity * 15}px ${25 + intensity * 15}px rgba(0, 0, 0, 0.2)`;
                });
            });
            
            card.addEventListener('mouseleave', () => {
                const currentColor = this.currentGradientColors[index] || baseColor;
                const baseRgba = this.hexToRgba(currentColor, 0.75);
                
                requestAnimationFrame(() => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                    card.style.backgroundColor = baseRgba;
                    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                });
            });
            
            // Mise à jour de la couleur de base quand les couleurs changent
            setInterval(() => {
                if (this.currentGradientColors[index]) {
                    baseColor = this.currentGradientColors[index];
                }
            }, CONFIG.gradientUpdateInterval);
        });
    },

    /**
     * Convertit une couleur hexadécimale en rgba
     * @param {string} hex - Couleur au format hexadécimal
     * @param {number} alpha - Valeur d'opacité
     * @returns {string} - Couleur au format rgba
     */
    hexToRgba: function(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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