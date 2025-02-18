document.querySelectorAll('.dropbtn').forEach(button => {
    button.addEventListener('click', function(event) {
        // Empêche la propagation de l'événement pour éviter la fermeture immédiate
        event.stopPropagation();
        
        const dropdownContent = this.nextElementSibling;
        // Toggle the display of the dropdown content
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });
});

// Close dropdowns if clicked outside
window.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
    });
}); 