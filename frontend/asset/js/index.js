// script.js
function navigateTo(section) {
    const content = document.getElementById('content');
    switch (section) {
        case 'home':
            content.innerHTML = '<h1>Home</h1><p>Welcome to the home page!</p>';
            break;
        case 'menu':
            content.innerHTML = '<h1>Menu</h1><p>Here is the menu!</p>';
            break;
        case 'orders':
            content.innerHTML = '<h1>Orders</h1><p>View your orders here!</p>';
            break;
        case 'dashboard':
            content.innerHTML = '<h1>Dashboard</h1><p>Dashboard overview!</p>';
            break;
        case 'contact':
            content.innerHTML = '<h1>Contact</h1><p>Contact us here!</p>';
            break;
        default:
            content.innerHTML = '<h1>Welcome to Fika</h1><p>Select a menu item to get started.</p>';
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// script.js
let currentIndex = 0;

function moveCarousel(direction) {
    const items = document.querySelectorAll('.promo-item');
    const totalItems = items.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalItems - 1; // Loop to last item
    } else if (currentIndex >= totalItems) {
        currentIndex = 0; // Loop to first item
    }

    const carouselInner = document.querySelector('.carousel-inner');
    const offset = -currentIndex * 100; // Calculate offset
    carouselInner.style.transform = `translateX(${offset}%)`;
}