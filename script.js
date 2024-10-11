/* Réinitialisation des styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    display: flex;
    flex-direction: column;
    cursor: none; /* Cache le curseur par défaut */
}

/* Empêche le curseur par défaut d'apparaître sur les liens, boutons, inputs, textareas et labels */
a, button, input, textarea, label {
    cursor: none; /* Curseur personnalisé toujours actif */
}

/* Style des sections */

                                                            /* Section Contact */
#contact {
    display: flex;
    flex-direction: column; /* Les éléments sont empilés verticalement */
    transition: background-position 0.1s ease; /* Transition pour l'effet visuel */
    justify-content: space-evenly; /* Espacement égal entre les éléments */
    align-items: center; /* Centrer horizontalement */
    min-height: 100vh;
    text-align: center; /* Texte centré */
    padding: 20px;
}

#contact form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
}

#contact form input, 

#contact form textarea {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
}

#contact form label {
    margin-bottom: 5px;
}

#contact form button {
    padding: 10px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
}

                                                            /* Section Projets */
#projets {
    display: flex;
    flex-direction: column; /* Les éléments sont disposés horizontalement, mais inversés */
    transition: background-position 0.1s ease; /* Transition pour l'effet visuel */
    justify-content: space-between; /* Espacer uniformément avec espace entre les éléments */
    align-items: center; /* Alignement en haut */
    min-height: 100vh;
    text-align: center; /* Texte centré */
    padding: 20px;
}

#projets .projet {
    max-width: 800px;
    margin-bottom: 20px;
}

                                                            /* Section À propos */
#a-propos {
    display: flex;
    flex-direction: column; /* Les éléments sont disposés verticalement */
    transition: background-position 0.1s ease; /* Transition pour l'effet visuel */
    justify-content: center; /* Centrer verticalement */
    align-items: center; /* Les éléments sont alignés à gauche */
    min-height: 100vh;
    padding: 20px;
}

#a-propos h3 {
    margin-top: 20px;
}

                                                            /* Section Accueil */
#accueil {
    display: flex;
    flex-direction: column; /* Les éléments sont disposés horizontalement */
    transition: background-position 0.1s ease; /* Transition pour l'effet visuel */
    justify-content: center; /* Les éléments sont espacés uniformément */
    align-items: center; /* Centrer verticalement */
    min-height: 100vh;
    text-align: center; /* Texte aligné à gauche */
    padding: 50px 0;
}

#accueil h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
}

#accueil p {
    font-size: 1.2rem;
    max-width: 600px;
}
                                                            /* Section header */
header {
    transition: background-position 0.1s ease; /* Transition pour l'effet visuel */
    height: 6vh; /* Prend toute la hauteur de la fenêtre */
    display: flex; /* Pour centrer le contenu */
    align-items: center; /* Centre verticalement */
    justify-content: center; /* Centre horizontalement */
    text-align: center; /* Centre le texte */
    position: fixed; /* Rend le header fixe en haut de la page */
    width: 100%; /* S'étend sur toute la largeur */
    z-index: 1; /* S'assurer que le contenu est visible */
    padding: 10px 20px;
}

                                                            /* Style pour les box individuelles */
.projet, form {
    backdrop-filter: blur(10px); /* Applique un flou */
    padding: 20px;
    border-radius: 10px; /* Bordures arrondies */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombre légère */
    background-color: rgba(255, 255, 255, 0.465); /* Très léger fond semi-transparent */
    backdrop-filter: blur(50px); /* Appliquer un flou très fort sur l'arrière-plan */
    z-index: 2; /* S'assurer que le contenu est visible */
}

nav ul {
    list-style: none; /* Retire les puces de la liste */
    padding: 0;
    display: flex; /* Affiche les éléments de navigation en ligne */
    justify-content: space-around;
    gap: 20px; /* Espacement entre les liens */
}

nav ul li {
    display: inline; /* Les éléments de la liste sont en ligne */
}

nav ul li a {
    color: #fff; /* Couleur des liens blanche */
    text-decoration: none; /* Pas de soulignement */
    font-weight: bold;
    font-size: 1.2rem; /* Taille des liens augmentée */
    padding: 10px 20px; /* Ajout de padding pour rendre les liens plus cliquables */
    transition: background-color 0.2s ease, color 0.2s ease; /* Transition pour l'effet de hover */
}

nav ul li a:hover {
    background-color: rgba(255, 255, 255, 0.2); /* Légère opacité sur survol */
    color: #ff0000; /* Couleur changeante sur hover */
    border-radius: 5px; /* Bords arrondis */
}

#custom-cursor {
    width: 25px; /* Agrandir le curseur */
    height: 25px; /* Agrandir le curseur */
    border-radius: 50%;
    background: linear-gradient(45deg,#0000ff, #ff0000, #00ff00, #0000ff, #ff0000); /* Gradient */
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite; /* Animation de gradient */
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
}


/* Animation pour le gradient */
@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* Styles pour les sections avec transition */
section h1, section h2 {
    color: #fff; /* Couleur de texte blanche pour les titres */
}

/* Couleurs pour les boutons */
button {
    background-color: rgba(74, 74, 74, 0.8); /* Couleur plus claire pour plus de visibilité */
    color: #fff;
    padding: 0.75rem 1.5rem; /* Agrandir le padding du bouton */
    border: none;
    margin-top: 1rem;
    transition: background-color 0.3s ease; /* Transition pour l'effet de survol */
}

button:hover {
    background-color: rgba(51, 51, 51, 0.8); /* Légèrement plus foncé lors du survol */
}

footer {
    transition: background-position 0.1s ease; /* Transition pour l'effet visuel */
    height: 3vh; /* Prend toute la hauteur de la fenêtre */
    display: flex; /* Pour centrer le contenu */
    align-items: center; /* Centre verticalement */
    justify-content: center; /* Centre horizontalement */
    text-align: center; /* Centre le texte */
    position: relative; /* Permet la fusion entre header et accueil */
}
