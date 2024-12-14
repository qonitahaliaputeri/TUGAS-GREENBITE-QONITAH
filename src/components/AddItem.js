import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Pastikan untuk mengimpor CSS Anda

const AddItem = () => {
    const [namaItem, setNamaItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [harga, setHarga] = useState(1);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Base URL API Node.js
    const apiBaseUrl = 'http://localhost:3005/cart';

    // Fungsi untuk mengirim permintaan ke API
    const sendRequest = async (data) => {
        try {
            const response = await axios.post(apiBaseUrl, data);
            return response.data;
        } catch (error) {
            console.error('Error adding item:', error);
            return null;
        }
    };

    // Handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await sendRequest({
            nama_item: namaItem,
            quantity: quantity,
            harga: harga,
        });

        if (result) {
            setMessage('Item successfully added to the cart!');
            setIsSuccess(true);
            // Reset form
            setNamaItem('');
            setQuantity(1);
            setHarga(1);
        } else {
            setMessage('Failed to add item to the cart. Please try again.');
            setIsSuccess(false);
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <a className="navbar-brand" href="#">GreenBite</a>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card p-4">
                            <div className="card-body">
                                <h2 className="text-center mb-4 text-secondary">Add Item to Cart</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="nama_item" className="form-label">Item Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nama_item"
                                            value={namaItem}
                                            onChange={(e) => setNamaItem(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="quantity" className="form-label">Quantity:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="quantity"
                                            value={quantity}
                                            min="1"
                                            onChange={(e) => setQuantity(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="harga" className="form-label">Price:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="harga"
                                            value={harga}
                                            min="1"
                                            onChange={(e) => setHarga(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-secondary w-100">Add Item</button>
                                </form>

                                {message && (
                                    <div className={`alert mt-3 ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
                                        {message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap JS */}
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
        </div>
    );
};

export default AddItem;