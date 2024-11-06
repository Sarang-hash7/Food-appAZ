let cart = [];
let totalAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadMenu();
    loadCart();
});

function loadMenu() {
    fetch('/api/menu')
        .then(response => response.json())
        .then(data => {
            const menuItems = document.getElementById('menu-items');
            data.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');
                menuItem.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>Price: $${item.price}</p>
                    <button onclick="addToCart(${item.id})">Add to Cart</button>
                `;
                menuItems.appendChild(menuItem);
            });
        })
        .catch(error => console.error("Error fetching menu:", error));
}

function loadCart() {
    fetch('/api/cart')
        .then(response => response.json())
        .then(data => {
            cart = data;
            updateCart();
        });
}

function addToCart(itemId) {
    // Send the request with a quantity of 1 (since we're incrementing quantity on the backend)
    updateCartItemQuantity(itemId, 1);
}

function updateCartItemQuantity(itemId, quantity) {
    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: itemId, quantity: quantity })
    })
    .then(response => response.json())
    .then(data => {
        cart = data;
        updateCart();
    });
}

function removeFromCart(itemId) {
    fetch('/api/cart/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: itemId })
    })
    .then(response => response.json())
    .then(data => {
        cart = data;
        updateCart();
    });
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';  // Clear the cart items section
    totalAmount = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <p>${item.name} - $${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);

        totalAmount += item.price * item.quantity;
    });

    document.getElementById('total-amount').textContent = `Total: $${totalAmount.toFixed(2)}`;
}
