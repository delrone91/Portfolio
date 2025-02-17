// Création d'un curseur personnalisé
const cursor = document.createElement('div');
cursor.id = 'custom-cursor'; // ID pour le curseur
document.body.appendChild(cursor); // Ajoute le curseur au corps de la page

// Événement de mouvement de la souris
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px'; // Positionne le curseur horizontalement
    cursor.style.top = e.clientY + 'px'; // Positionne le curseur verticalement

    // Calculer la couleur en fonction de la position de la souris
    const x = e.clientX / window.innerWidth * 255; // Récupère la position X normalisée
    const y = e.clientY / window.innerHeight * 255; // Récupère la position Y normalisée
    const color = `rgb(${Math.round(x)}, ${Math.round(y)}, ${Math.round(255 - x)})`; // Crée une couleur dynamique

    // Changer la couleur du texte des liens en fonction de la souris
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.style.color = color; // Applique la couleur calculée à chaque lien
    });
});

// Quand l'utilisateur clique, rétrécir le curseur
document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.7)'; // Réduit la taille du curseur
});

// Quand l'utilisateur relâche le clic, restaurer la taille d'origine du curseur
document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)'; // Restaure la taille originale du curseur
});

// Tableau de couleurs
const colors = ['#ff5733', '#33ff57', '#3357ff', '#f1c40f', '#9b59b6', '#e74c3c', '#1abc9c'];

// Fonction pour générer un dégradé aléatoire avec 3 couleurs
function generateGradient() {
    const randomColors = [];
    for (let i = 0; i < 3; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        randomColors.push(randomColor);
    }
    return randomColors;
}

// Fonction pour générer un dégradé mis à jour en supprimant la première couleur et en ajoutant une nouvelle à la fin
function generateUpdatedGradient(currentColors) {
    // Retirer la première couleur (celle de gauche)
    currentColors.shift();

    // Ajouter une nouvelle couleur aléatoire à la fin
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    currentColors.push(newColor);

    // Reconstruire le dégradé
    return currentColors;
}

function applyGradientToAllElements(gradientColors) {
    const gradient = `linear-gradient(90deg, ${gradientColors.join(', ')})`;
    const overlay = document.querySelector('#background-overlay');

    if (overlay) {
        overlay.style.backgroundImage = gradient;
    }
}

// Initialisation du premier dégradé et application
let currentGradientColors = generateGradient();
applyGradientToAllElements(currentGradientColors);

// Fonction pour mettre à jour le dégradé toutes les 15 secondes
function updateGradients() {
    currentGradientColors = generateUpdatedGradient(currentGradientColors);
    applyGradientToAllElements(currentGradientColors);
}

// Mettre à jour les couleurs toutes les 15 secondes
setInterval(updateGradients, 10000);

// Fonction pour suivre la souris et ajuster la position du dégradé sur #background-overlay
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100; // Récupère la position X normalisée en %
    const y = (e.clientY / window.innerHeight) * 100; // Récupère la position Y normalisée en %

    // Cibler uniquement #background-overlay pour le déplacement du dégradé
    const backgroundOverlay = document.querySelector('#background-overlay');
    if (backgroundOverlay) {
        backgroundOverlay.style.backgroundSize = '250% 250%'; // Taille du background pour l'effet
        backgroundOverlay.style.backgroundPosition = `${x}% ${y}%`; // Met à jour la position du dégradé en fonction de la souris
    }
});

// Fonction pour gérer l'ouverture et la fermeture des modales
function handleModals() {
    const modalButtons = document.querySelectorAll('.voir-projet');
    const closeButtons = document.querySelectorAll('.close-button');

    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.projet;
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.style.display = 'none';
        });
    });

    // Fermer la modale si l'utilisateur clique en dehors
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Fonction pour gérer la soumission du formulaire de contact
function handleContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Réinitialiser le formulaire
                form.reset();
                formMessage.textContent = 'Message envoyé avec succès !';
                formMessage.className = 'success';
            } else {
                formMessage.textContent = 'Une erreur est survenue lors de l\'envoi du message.';
                formMessage.className = 'error';
            }
        } catch (error) {
            formMessage.textContent = 'Une erreur est survenue lors de l\'envoi du message.';
            formMessage.className = 'error';
        }
    });
}

// Appliquer les gradients et gérer les modales dès le chargement de la page
window.addEventListener("DOMContentLoaded", () => {
    applyGradientToAllElements(currentGradientColors);
    handleModals();
    // handleContactForm(); // Décommentez cette ligne si vous avez un backend pour traiter le formulaire
});
