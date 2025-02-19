document.querySelector('.logout-button').addEventListener('click', () => {
    fetch('/logout', {
        method: 'GET' // ou POST selon ta route
    }).then(() => {
        window.location.href = '/login'; // Redirection après la déconnexion
    }).catch(err => console.error('Erreur lors de la déconnexion:', err));
});
