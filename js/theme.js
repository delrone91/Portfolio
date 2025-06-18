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