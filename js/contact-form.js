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