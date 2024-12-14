import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useParams,
  useNavigate,
  useSearchParams,
  data,
} from "react-router-dom";
import "../style/OrderConfirmation.css";
import Swal from "sweetalert2";

import update from "../asset/update.svg";

const OrderConfirmation = () => {
  const { order_id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const totalPayment = searchParams.get("total");

  const [cartItems, setCartItems] = useState([]);
  const apiBaseUrl = "http://localhost:3005/cart";
  const [paymentMethod, setPaymentMethod] = useState();

  // Fungsi untuk mendapatkan data dari API
  const fetchData = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
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

  const handleProceedToPaymentOrder = async () => {
    try {
      // Validasi apakah paymentMethod sudah diisi
      if (!paymentMethod) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please enter a payment method before proceeding.",
        });
        return;
      }

      const dataToSend = {
        totalPayment: parseFloat(totalPayment),
        paymentMethod: paymentMethod,
        status: "Pending", // Set default status
      };

      console.log(dataToSend);

      const response = await axios.post(
        "http://localhost:3005/orders",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from server:", response.data);

      // Tampilkan SweetAlert setelah berhasil
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payment has been processed successfully!",
      }).then(() => {
        // Reset data pada Order Details dan Order Items
        setPaymentMethod(""); // Reset input payment method
        setCartItems([]); // Hapus semua item di cart
        setOrder(null); // Reset data order jika diperlukan
        navigate("/"); // Redirect ke halaman lain jika diperlukan
      });
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to process payment. Please try again.",
        });
      } else if (error.request) {
        console.error("No response received:", error.request);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No response from server. Please check your connection.",
        });
      } else {
        console.error("Error setting up request:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!totalPayment) {
    return <div>Loading...</div>;
  }

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

      <div className="container">
        <h1 className="text-center mb-4 text-secondary">Order Confirmation</h1>

        {/* Order Details */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title mb-0">Order Details</h5>
          </div>
          <div className="card-body bg-light ">
            <p>
              <strong>Total Payment :</strong> Rp{" "}
              {new Intl.NumberFormat("id-ID").format(totalPayment)}
            </p>
            <div className="d-flex align-items-center">
              <label className="form-label">
                <strong>Payment Method :</strong>
              </label>
              <input
                className="form-control ms-2 d-inline w-auto"
                type="text"
                name="paymentMethod"
                id="paymentMethod"
                value={paymentMethod || ""} // Mengatur nilai berdasarkan state
                onChange={(e) => setPaymentMethod(e.target.value)} // Menangani perubahan input
                placeholder="input payment method"
                required
              />
            </div>
            <p>
              <strong>Status :</strong> Pending
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Order Items</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
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
                              type="text"
                              name="quantity"
                              readOnly
                              defaultValue={item.quantity}
                              min="1"
                              className="form-control d-inline w-50"
                              required
                            />
                          </form>
                        </td>
                        <td>{item.harga}</td>
                        <td>{item.quantity * item.harga}</td>
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
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <button
            className="btn btn-success"
            onClick={handleProceedToPaymentOrder}
          >
            Payment
          </button>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
