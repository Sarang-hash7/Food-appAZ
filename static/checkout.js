document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');

    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        // Ideally, here you would send these details to Stripe or another payment gateway
        // For security reasons, never send full card details directly to your backend

        fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Payment successful!');
                // Redirect or clear the cart after successful payment
                window.location.href = '/';
            } else {
                alert('Payment failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during payment.');
        });
    });
});
