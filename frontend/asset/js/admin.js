document.getElementById('add-dish-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const dishName = document.getElementById('dish-name').value;
    const dishDescription = document.getElementById('dish-description').value;
    const dishPrice = document.getElementById('dish-price').value;
    const dishImage = document.getElementById('dish-image').files[0];

    const formData = new FormData();
    formData.append('name', dishName);
    formData.append('description', dishDescription);
    formData.append('price', dishPrice);
    formData.append('image', dishImage);

    fetch('/api/dishes', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Plat ajouté:', data);
        // Optionnel : Réinitialiser le formulaire ou mettre à jour la liste des plats
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}); 