document.getElementById('add-dish-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const dishName = document.getElementById('dish-name').value;
    const dishDescription = document.getElementById('dish-description').value;
    const dishPrice = document.getElementById('dish-price').value;
    const dishCategory = document.getElementById('dish-category').value;
    const dishImage = document.getElementById('dish-image').files[0];

    const formData = new FormData();
    formData.append('name', dishName);
    formData.append('description', dishDescription);
    formData.append('price', dishPrice);
    formData.append('category', dishCategory);
    if (dishImage) {
        formData.append('image', dishImage);
    }

    fetch('/add-dish', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        console.log('Réponse brute:', response); // Ajoutez ceci pour voir la réponse
        if (!response.ok) {
            throw new Error('Erreur lors de l\'ajout du plat');
        }
        return response.json(); // Traitez la réponse comme JSON
    })
    .then(data => {
        console.log('Plat ajouté:', data);
        document.getElementById('add-dish-form').reset(); // Réinitialiser le formulaire
        fetchDishes(); // Rafraîchir la liste des plats
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
});

// Fonction pour récupérer les plats
function fetchDishes() {
    fetch('/get-dishes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des plats');
            }
            return response.json();
        })
        .then(data => {
            const dishesList = document.getElementById('dishes-list');
            dishesList.innerHTML = ''; // Vider le tableau avant de le remplir

            data.forEach(dish => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${dish.id}</td>
                    <td>${dish.nom}</td>
                    <td>${dish.description}</td>
                    <td>${dish.prix} €</td>
                    <td>${dish.categorie_id || 'Non spécifié'}</td>
                `;
                dishesList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
}

// Charger la liste des plats lorsque la page est prête
document.addEventListener('DOMContentLoaded', fetchDishes);
