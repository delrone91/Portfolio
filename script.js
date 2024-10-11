
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

    // Appliquer la couleur de texte dynamique aux sections
    document.querySelectorAll('h1, h2').forEach(title => {
        title.style.color = color; // Change la couleur des titres
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

// Fonction pour appliquer un dégradé à tous les éléments (header, footer, sections)
function applyGradientToAllElements(gradientColors) {
    const gradient = `linear-gradient(90deg, ${gradientColors.join(', ')})`;
    const elements = document.querySelectorAll('section, header, footer');

    elements.forEach(element => {
        element.style.backgroundImage = gradient;
    });
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
setInterval(updateGradients, 15000);

// Fonction pour suivre la souris et ajuster la position du dégradé
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth * 100; // Récupère la position X normalisée en %
    const y = e.clientY / window.innerHeight * 100; // Récupère la position Y normalisée en %

    document.querySelectorAll('section, header, footer').forEach(section => {
        section.style.backgroundSize = '250% 250%'; // Assurez-vous que le background est suffisamment grand pour voir le mouvement
        section.style.backgroundPosition = `${x}% ${y}%`; // Met à jour la position du dégradé
    });
});


// Appliquer les gradients dès le chargement de la page
window.addEventListener("DOMContentLoaded", applyRandomGradients);
