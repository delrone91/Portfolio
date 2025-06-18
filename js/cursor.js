// ====================================================
// GESTIONNAIRE DE CURSEUR PERSONNALISÉ AMÉLIORÉ
// ====================================================
const cursorManager = {
    cursor: null,
    follower: null,
    links: null,
    buttons: null,
    inputs: null,
    pageLoaded: false,
    hoveredElement: null,

    /**
     * Initialise le curseur personnalisé
     */
    init: function() {
        // Vérifie si l'appareil utilise probablement un écran tactile
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Sur les appareils tactiles, ne pas initialiser le curseur personnalisé
        if (isTouchDevice) {
            document.body.style.cursor = 'auto';
            return;
        }
        
        // Création du curseur principal
        this.cursor = document.createElement('div');
        this.cursor.id = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Création du suiveur de curseur (effet de traînée)
        this.follower = document.createElement('div');
        this.follower.id = 'cursor-follower';
        document.body.appendChild(this.follower);

        // Récupération des éléments interactifs
        this.links = document.querySelectorAll('a, nav ul li a');
        this.buttons = document.querySelectorAll('button, .voir-projet, input[type="submit"]');
        this.inputs = document.querySelectorAll('input, textarea');

        // Initialisation des événements
        this.initEvents();
    },

    /**
     * Initialise les écouteurs d'événements pour le curseur
     */
    initEvents: function() {
        // Événement de mouvement de souris optimisé
        document.addEventListener('mousemove', eventManager.throttle((e) => {
            // Animation fluide avec requestAnimationFrame
            requestAnimationFrame(() => {
                if (!this.cursor || !this.follower) return;
                
                // Positionnement du curseur principal
                this.cursor.style.left = `${e.clientX}px`;
                this.cursor.style.top = `${e.clientY}px`;
                
                // Le follower suit avec un léger délai (effet de traînée)
                this.follower.style.left = `${e.clientX}px`;
                this.follower.style.top = `${e.clientY}px`;
            });

            // Modification de la couleur des liens de navigation
            this.updateLinkColors(e);
        }, 10)); // Throttle de 10ms pour des performances optimales

        // Gestion des clics souris
        document.addEventListener('mousedown', () => {
            if (!this.cursor || !this.follower) return;
            this.cursor.classList.add('clicked');
            this.follower.classList.add('clicked');
        });

        document.addEventListener('mouseup', () => {
            if (!this.cursor || !this.follower) return;
            this.cursor.classList.remove('clicked');
            this.follower.classList.remove('clicked');
        });

        // Gestion des éléments survolés
        this.handleHoverEffects();

        // Afficher le curseur seulement quand la page est chargée
        window.addEventListener('load', () => {
            this.pageLoaded = true;
            if (this.cursor) this.cursor.classList.add('loaded');
            if (this.follower) this.follower.classList.add('loaded');
        });
    },

    /**
     * Met à jour la couleur des liens en fonction de la position de la souris
     * @param {MouseEvent} e - Événement de mouvement de souris
     */
    updateLinkColors: function(e) {
        const x = (e.clientX / window.innerWidth) * 255;
        const y = (e.clientY / window.innerHeight) * 255;
        const color = `rgb(${Math.round(x)}, ${Math.round(y)}, ${Math.round(255 - x)})`;

        document.querySelectorAll('nav ul li a').forEach(link => {
            link.style.color = color;
        });
    },

    /**
     * Gère les effets de survol sur les éléments interactifs
     */
    handleHoverEffects: function() {
        if (!this.cursor || !this.follower) return;
        
        // Effet sur les liens
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.classList.add('link-hover');
                this.follower.classList.add('link-hover');
                this.hoveredElement = link;
            });

            link.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('link-hover');
                this.follower.classList.remove('link-hover');
                this.hoveredElement = null;
            });
        });

        // Effet sur les boutons
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.cursor.classList.add('button-hover');
                this.follower.classList.add('button-hover');
                this.hoveredElement = button;
            });

            button.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('button-hover');
                this.follower.classList.remove('button-hover');
                this.hoveredElement = null;
            });
        });

        // Effet sur les champs de formulaire
        this.inputs.forEach(input => {
            input.addEventListener('mouseenter', () => {
                this.cursor.classList.add('input-hover');
                this.follower.classList.add('input-hover');
                this.hoveredElement = input;
            });

            input.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('input-hover');
                this.follower.classList.remove('input-hover');
                this.hoveredElement = null;
            });
        });
    }
};