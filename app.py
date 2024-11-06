from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Initialize an empty cart
cart = []

# Sample menu data
menu_items = [
    {"id": 1, "name": "Cheese Pizza", "description": "Classic cheese pizza with a delicious crust.", "price": 8.99},
    {"id": 2, "name": "Burger", "description": "Juicy beef burger with lettuce, tomato, and cheese.", "price": 7.99},
    {"id": 3, "name": "Caesar Salad", "description": "Fresh romaine lettuce with Caesar dressing and croutons.", "price": 5.99}
]

@app.route('/')
def index():
    return render_template('index.html')

# API route to serve menu items
@app.route('/api/menu')
def get_menu():
    return jsonify(menu_items)

# API route to get the current cart state
@app.route('/api/cart', methods=['GET'])
def get_cart():
    return jsonify(cart)

# API route to add an item to the cart or update its quantity
@app.route('/api/cart', methods=['POST'])
def add_to_cart():
    item_id = request.json.get('id')
    quantity = request.json.get('quantity', 1)  # Default to 1 if not provided
    
    # Find the item in the menu
    item = next((item for item in menu_items if item['id'] == item_id), None)
    
    if item:
        # Check if item is already in the cart
        existing_item = next((cart_item for cart_item in cart if cart_item['id'] == item_id), None)
        
        if existing_item:
            # If item is in the cart, increment its quantity by 1
            existing_item['quantity'] += 1  # Add 1 to the quantity
        else:
            # If item is not in the cart, add it with quantity 1
            item['quantity'] = 1
            cart.append(item)
    
    return jsonify(cart)

# API route to remove an item from the cart
@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    item_id = request.json.get('id')
    global cart
    # Remove item from cart if it exists
    cart = [item for item in cart if item['id'] != item_id]
    return jsonify(cart)

@app.route('/checkout')
def checkout_page():
    return render_template('checkout.html')


if __name__ == '__main__':
    app.run(debug=True)
