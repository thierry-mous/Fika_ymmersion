document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-register').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        const userData = {
            email: email,
            password: password
        };

        fetch('http://localhost:3000/api/auth/inscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'inscription');
            }
            return response.json();
        })
        .then(data => {
            alert("Inscription réussie !");
            window.location.href = 'login.html'; // Rediriger vers la page de connexion
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'inscription');
        });
    });
}); 