import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Cart.css";
import update from "../asset/update.svg";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const apiBaseUrl = "http://localhost:3005/cart";
  const navigate = useNavigate();

  // Fungsi untuk mendapatkan data dari API
  const fetchData = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Fungsi untuk mengirim permintaan ke API (PUT, DELETE)
  const sendRequest = async (url, method, data = null) => {
    try {
      const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error sending request:", error);
      return null;
    }
  };

  // Handle update quantity
  const handleUpdateQuantity = async (id, quantity, nama_item, harga) => {
    await sendRequest(`${apiBaseUrl}/${id}`, "PUT", {
      nama_item,
      quantity,
      harga,
    });
    fetchData(); // Refresh cart items
  };

  // Handle delete item
  const handleDeleteItem = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      try {
        // Kirim permintaan DELETE ke API
        await axios.delete(`${apiBaseUrl}/${id}`);

        // Perbarui state cartItems setelah berhasil menghapus
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting item from cart:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  const totalPayment = cartItems.reduce(
    (total, item) => total + item.quantity * item.harga,
    0
  );

  const handleProceedToPayment = async () => {
    try {
      const response2 = await axios.get(apiBaseUrl);

      if (!Array.isArray(response2.data)) {
        console.error("response2.data is not an array:", response2.data);
        return;
      }

      const dataToSend = response2.data.map((item) => ({
        id: item.id,
        nama_item: item.nama_item,
        quantity: parseInt(item.quantity, 10), // Pastikan quantity angka
        harga: parseFloat(item.harga), // Pastikan harga angka
      }));

      console.log("Data to send:", dataToSend);

      const response = await axios.post(
        "http://localhost:3005/orders_items",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from server:", response.data);
      navigate(`/order-confirmation?total=${totalPayment}`);
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="#">
            GreenBite
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <h1 className="text-center text-secondary">Cart</h1>
        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nama_item}</td>
                      <td>
                        <form
                          className="d-inline"
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateQuantity(
                              item.id,
                              e.target.quantity.value,
                              item.nama_item,
                              item.harga
                            );
                          }}
                        >
                          <input type="hidden" name="id" value={item.id} />
                          <input
                            type="hidden"
                            name="nama_item"
                            value={item.nama_item}
                          />
                          <input
                            type="hidden"
                            name="harga"
                            value={item.harga}
                          />
                          <input
                            type="number"
                            name="quantity"
                            defaultValue={item.quantity}
                            min="1"
                            className="form-control d-inline w-50"
                            required
                          />
                          <button
                            type="submit"
                            className="btn btn-update btn-sm"
                            title="Update"
                          >
                            <img src={update} alt="Update" />
                          </button>
                        </form>
                      </td>
                      <td>{item.harga}</td>
                      <td>{item.quantity * item.harga}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="btn-delete"
                          title="Delete"
                        >
                          &#128465;
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Footer Row for Total */}
                  <tr>
                    <td colSpan="4" className="text-end fw-bold">
                      Total:
                    </td>
                    <td colSpan="2" className="fw-bold">
                      {totalPayment}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="6">No items in the cart.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Proceed to Payment */}
        <div className="d-flex justify-content-end">
          <button
            onClick={handleProceedToPayment}
            className="btn btn-warning btn-lg"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
