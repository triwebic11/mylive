import React, { useState } from "react";

const products = [
    {
        id: 1,
        name: "oil",
        price: 800,
        image: "https://via.placeholder.com/100"
    },
    {
        id: 2,
        name: "Food",
        price: 300,
        image: "https://via.placeholder.com/100"
    },
    {
        id: 3,
        name: "test",
        price: 200,
        image: "https://via.placeholder.com/100"
    },

    {
        id: 4,
        name: "look",
        price: 500,
        image: "https://via.placeholder.com/100"
    }
];

const CashOnDelivery = () => {
    const [cartItems, setCartItems] = useState([]);
    const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });

    const handleProductToggle = (product) => {
        const exists = cartItems.find(item => item.id === product.id);
        if (exists) {
            setCartItems(cartItems.filter(item => item.id !== product.id));
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, qty) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: Number(qty) } : item
        ));
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Please select at least one product.");
            return;
        }
        alert("Order placed successfully via Cash on Delivery!");
        console.log({ cartItems, ...form });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Place Your Order (Cash on Delivery)</h2>

            <div className="mb-4">
                <label className="block mb-2 font-medium">Select Products</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map(product => {
                        const selected = cartItems.find(item => item.id === product.id);
                        return (
                            <div key={product.id} className={`border p-3 rounded cursor-pointer ${selected ? 'bg-green-100' : 'bg-white'}`} onClick={() => handleProductToggle(product)}>
                                <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded mb-2" />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p>Tk {product.price}</p>
                                {selected && (
                                    <input
                                        type="number"
                                        value={selected.quantity}
                                        min={1}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => updateQuantity(product.id, e.target.value)}
                                        className="mt-2 w-20 border rounded p-1"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <input name="name" onChange={handleChange} value={form.name} className="w-full p-2 border rounded" placeholder="Full Name" required />
                <input name="phone" onChange={handleChange} value={form.phone} className="w-full p-2 border rounded" placeholder="Mobile Number" required />
                <textarea name="address" onChange={handleChange} value={form.address} className="w-full p-2 border rounded" placeholder="Full Delivery Address" required />
                <input name="city" onChange={handleChange} value={form.city} className="w-full p-2 border rounded" placeholder="City / Area" required />

                <div className="bg-gray-100 p-3 rounded">
                    <p><strong>Total:</strong> Tk {totalPrice}</p>
                    <p><strong>Payment Method:</strong> Cash on Delivery</p>
                </div>

                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full">
                    Place Order
                </button>
            </form>
        </div>
    );
}


export default CashOnDelivery;