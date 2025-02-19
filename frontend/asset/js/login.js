document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    console.log(form); // Vérifiez si cela affiche l'élément ou null

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Empêche le rechargement de la page

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Connexion réussie !');
                    window.location.href = 'index.html'; // Remplacez par votre page d'accueil
                } else {
                    alert('Identifiants incorrects. Veuillez réessayer.');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
        });
    } else {
        console.error('L\'élément avec l\'ID "login-form" n\'a pas été trouvé.');
    }
}); 