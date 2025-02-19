document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    console.log(form); // Vérifiez si cela affiche l'élément ou null

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche le rechargement de la page

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Vérifiez si l'utilisateur existe dans le localStorage
            const storedPassword = localStorage.getItem(email);

            if (storedPassword && storedPassword === password) {
                alert('Connexion réussie !');
                // Redirigez vers la page d'accueil ou une autre page
                window.location.href = 'index.html'; // Remplacez par votre page d'accueil
            } else {
                alert('Identifiants incorrects. Veuillez réessayer.');
            }
        });
    } else {
        console.error('L\'élément avec l\'ID "login-form" n\'a pas été trouvé.');
    }
}); 