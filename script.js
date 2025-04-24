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

// ====================================================
// GESTIONNAIRE DE FORMULAIRE DE CONTACT
// ====================================================
const contactFormManager = {
    form: null,
    formMessage: null,
    
    /**
     * Initialise le gestionnaire de formulaire
     */
    init: function() {
        this.form = document.getElementById('contact-form');
        this.formMessage = document.getElementById('form-message');
        
        if (this.form) {
            this.initEvents();
        }
    },
    
    /**
     * Initialise les écouteurs d'événements pour le formulaire
     */
    initEvents: function() {
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Affiche un message de chargement
            this.showMessage('Envoi en cours...', 'info');
            
            // Simule une requête asynchrone
            try {
                // Simulation d'un envoi de formulaire (à remplacer par le vrai code d'envoi)
                await this.simulateFormSubmission();
                
                // Réinitialise le formulaire
                this.form.reset();
                this.showMessage('Message envoyé avec succès!', 'success');
                
                // Animation de succès sur les boutons
                const submitButton = this.form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.classList.add('success-animation');
                    setTimeout(() => {
                        submitButton.classList.remove('success-animation');
                    }, 2000);
                }
                
            } catch (error) {
                this.showMessage('Une erreur est survenue lors de l\'envoi du message.', 'error');
            }
        });
        
        // Validation en temps réel
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    },
    
    /**
     * Valide un champ de formulaire
     * @param {HTMLElement} input - Champ à valider
     */
    validateInput: function(input) {
        const isValid = input.checkValidity();
        
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }
    },
    
    /**
     * Affiche un message de statut du formulaire
     * @param {string} text - Texte du message
     * @param {string} type - Type de message (success, error, info)
     */
    showMessage: function(text, type) {
        if (!this.formMessage) return;
        
        this.formMessage.textContent = text;
        this.formMessage.className = type;
        
        // Ajoute une animation
        this.formMessage.classList.add('animate');
        setTimeout(() => {
            this.formMessage.classList.remove('animate');
        }, 500);
    },
    
    /**
     * Simule l'envoi du formulaire (à remplacer par le vrai code d'envoi)
     * @returns {Promise} - Promise résolue après la simulation
     */
    simulateFormSubmission: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2000); // Simule un délai de 2 secondes
        });
    }
};

// ====================================================
// GESTIONNAIRE DE THÈME (CLAIR/SOMBRE)
// ====================================================
const themeManager = {
    darkModeButton: null,
    
    /**
     * Initialise le gestionnaire de thème
     */
    init: function() {
        // Crée le bouton de basculement du mode sombre
        this.createThemeToggleButton();
        
        // Vérifie si le mode sombre est déjà activé (localStorage)
        this.checkDarkModePreference();
        
        // Écouteur pour le changement de préférence au niveau du système
        this.initSystemPreferenceListener();
    },
    
    /**
     * Crée le bouton de basculement du mode sombre/clair
     */
    createThemeToggleButton: function() {
        // Crée le conteneur du bouton
        const themeToggle = document.createElement('div');
        themeToggle.id = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Basculer le mode sombre/clair');
        themeToggle.setAttribute('role', 'button');
        themeToggle.setAttribute('tabindex', '0');
        
        // Crée les icônes pour le soleil et la lune
        const sunIcon = document.createElement('div');
        sunIcon.className = 'sun-icon';
        sunIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        
        const moonIcon = document.createElement('div');
        moonIcon.className = 'moon-icon';
        moonIcon.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
        
        // Ajoute les icônes au bouton
        themeToggle.appendChild(sunIcon);
        themeToggle.appendChild(moonIcon);
        
        // Ajoute le bouton au document
        document.body.appendChild(themeToggle);
        
        // Gère le clic sur le bouton
        themeToggle.addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        // Gère la navigation au clavier
        themeToggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.toggleDarkMode();
            }
        });
        
        this.darkModeButton = themeToggle;
    },
    
    /**
     * Vérifie si l'utilisateur a déjà une préférence pour le mode sombre
     */
    checkDarkModePreference: function() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        } else if (savedTheme === 'light') {
            this.disableDarkMode();
        } else {
            // Vérifie la préférence du système
            const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (prefersDarkMode) {
                this.enableDarkMode();
            }
        }
    },
    
    /**
     * Initialise l'écouteur pour les changements de préférence du système
     */
    initSystemPreferenceListener: function() {
        if (window.matchMedia) {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Écoute les changements de préférence
            if (darkModeMediaQuery.addEventListener) {
                darkModeMediaQuery.addEventListener('change', (e) => {
                    // Seulement si l'utilisateur n'a pas défini manuellement sa préférence
                    if (!localStorage.getItem('theme')) {
                        if (e.matches) {
                            this.enableDarkMode(false); // Sans sauvegarder la préférence
                        } else {
                            this.disableDarkMode(false); // Sans sauvegarder la préférence
                        }
                    }
                });
            }
        }
    },
    
    /**
     * Bascule entre les modes sombre et clair
     */
    toggleDarkMode: function() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    },
    
    /**
     * Active le mode sombre
     * @param {boolean} savePreference - Indique si la préférence doit être sauvegardée
     */
    enableDarkMode: function(savePreference = true) {
        document.body.classList.add('dark-mode');
        if (this.darkModeButton) {
            this.darkModeButton.classList.add('dark');
        }
        
        if (savePreference) {
            localStorage.setItem('theme', 'dark');
        }
    },
    
    /**
     * Désactive le mode sombre
     * @param {boolean} savePreference - Indique si la préférence doit être sauvegardée
     */
    disableDarkMode: function(savePreference = true) {
        document.body.classList.remove('dark-mode');
        if (this.darkModeButton) {
            this.darkModeButton.classList.remove('dark');
        }
        
        if (savePreference) {
            localStorage.setItem('theme', 'light');
        }
    }
};

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

// ====================================================
// INITIALISATION DE TOUTES LES FONCTIONNALITÉS
// ====================================================
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
    
    // Vérification supplémentaire après un court délai
    setTimeout(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }, 500);
}

// Exécute l'initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initializePortfolio);
