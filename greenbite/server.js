const express = require("express");
const mysql = require("mysql2"); // Mengimpor mysql2
const app = express();
const cors = require("cors");
const port = 3005;

// Mengimpor Controller untuk Cart dan Order
const cartController = require("./controllers/cart_controller");
const orderController = require("./controllers/order_controller");
const orderItemsController = require("./controllers/orders_items_controller");

// Middleware untuk parsing JSON request
app.use(express.json());

// Gunakan middleware CORS
app.use(cors()); // Izinkan semua origin untuk akses ke API

// Koneksi ke database MySQL
const connection = mysql.createConnection({
  host: "localhost", // Host MySQL Anda
  user: "root", // Username MySQL Anda
  password: "", // Password MySQL Anda, kosong jika tidak ada password
  database: "greenbite", // Nama database Anda
});

// Memastikan koneksi berhasil
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

// Endpoint untuk mendapatkan semua item dari cart (GET)
app.get("/cart", (req, res) => {
  connection.query("SELECT * FROM cart", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json(results); // Kirim hasil sebagai JSON
  });
});

// Endpoint untuk mendapatkan item spesifik dari cart berdasarkan id (GET)
app.get("/cart/:id", (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM cart WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).send("Server error");
    }
    if (results.length === 0) {
      return res.status(404).send("Item not found");
    }
    res.status(200).json(results[0]); // Kirim item spesifik sebagai JSON
  });
});

// Endpoint untuk menambah item ke cart (POST)
app.post("/cart", (req, res) => {
  const { nama_item, quantity, harga } = req.body;
  const query =
    "INSERT INTO cart (nama_item, quantity, harga) VALUES (?, ?, ?)";
  connection.query(query, [nama_item, quantity, harga], (err, results) => {
    if (err) {
      console.error("Error adding item to cart:", err);
      return res.status(500).send("Server error");
    }
    res.status(201).json({
      message: "Item added to cart",
      itemId: results.insertId, // Mengirimkan ID item yang baru ditambahkan
    });
  });
});

// Endpoint untuk memperbarui item di cart berdasarkan id (PUT)
app.put("/cart/:id", (req, res) => {
  const { id } = req.params;
  const { nama_item, quantity, harga } = req.body;
  const query =
    "UPDATE cart SET nama_item = ?, quantity = ?, harga = ? WHERE id = ?";
  connection.query(query, [nama_item, quantity, harga, id], (err, results) => {
    if (err) {
      console.error("Error updating item:", err);
      return res.status(500).send("Server error");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Item not found");
    }
    res.status(200).json({
      message: "Item updated successfully",
      updatedRows: results.affectedRows,
    });
  });
});

// Endpoint untuk menghapus item dari cart berdasarkan id (DELETE)
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM cart WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting item:", err);
      return res.status(500).send("Server error");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Item not found");
    }
    res.status(200).json({
      message: "Item deleted successfully",
      deletedRows: results.affectedRows,
    });
  });
});

// 1. Endpoint untuk mendapatkan semua orders (GET)
app.get("/orders", (req, res) => {
  connection.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json(results); // Menampilkan semua order dalam bentuk JSON
  });
});

// 2. Endpoint untuk mendapatkan order berdasarkan ID (GET)
app.get("/orders/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM orders WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching order:", err);
        return res.status(500).send("Server error");
      }
      if (results.length === 0) {
        return res.status(404).send("Order not found");
      }
      res.status(200).json(results[0]); // Menampilkan order berdasarkan ID dalam bentuk JSON
    }
  );
});

// 3. Endpoint untuk menambahkan order baru (POST)
app.post("/orders", async (req, res) => {
  console.log(req.body);

  // Validasi data: Pastikan body request tidak kosong
  const { totalPayment, paymentMethod, status } = req.body;

  if (!totalPayment || !paymentMethod || !status) {
    return res.status(400).json({ message: "Missing or invalid data" });
  }

  try {
    // Query untuk menyisipkan data ke tabel orders
    const query =
      "INSERT INTO orders (metode_pembayaran, total_pembayaran, status_pesanan) VALUES (?, ?, ?)";

    connection.query(
      query,
      [paymentMethod, totalPayment, status],
      (err, results) => {
        if (err) {
          console.error("Error inserting order:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        // Kirim respons sukses dengan ID pesanan yang baru saja dibuat
        res.status(201).json({
          message: "Order added successfully",
          orderId: results.insertId, // Ambil ID pesanan dari hasil query
        });
      }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 4. Endpoint untuk mengupdate order berdasarkan ID (PUT)
app.put("/orders/:id", (req, res) => {
  const { id } = req.params;
  const { metode_pembayaran, total_pembayaran, status_pesanan } = req.body;

  const query =
    "UPDATE orders SET metode_pembayaran = ?, total_pembayaran = ?, status_pesanan = ? WHERE id = ?";
  connection.query(
    query,
    [metode_pembayaran, total_pembayaran, status_pesanan, id],
    (err, results) => {
      if (err) {
        console.error("Error updating order:", err);
        return res.status(500).send("Server error");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Order not found");
      }
      res.status(200).json({
        message: "Order updated successfully",
        updatedRows: results.affectedRows, // Menampilkan jumlah baris yang terupdate
      });
    }
  );
});

// Endpoint untuk mendapatkan semua items dari orders_items (GET)
app.get("/orders_items", (req, res) => {
  connection.query("SELECT * FROM orders_items", (err, results) => {
    if (err) {
      console.error("Error fetching orders_items:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).json(results); // Menampilkan semua items dalam bentuk JSON
  });
});

// Endpoint untuk mendapatkan item dari orders_items berdasarkan ID (GET)
app.get("/orders_items/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM orders_items WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching orders_items:", err);
        return res.status(500).send("Server error");
      }
      if (results.length === 0) {
        return res.status(404).send("Item not found");
      }
      res.status(200).json(results[0]); // Menampilkan item dalam bentuk JSON
    }
  );
});

// Endpoint untuk menambahkan item ke orders_items (POST)
app.post("/orders_items", async (req, res) => {
  if (!req.body || !Array.isArray(req.body)) {
    return res.status(400).json({ message: "Missing or invalid data" });
  }

  console.log(req.body);

  try {
    const insertPromises = req.body.map((item) => {
      const { id, nama_item, quantity, harga } = item;

      return new Promise((resolve, reject) => {
        const query =
          "INSERT INTO orders_items (cart_id, nama_item, quantity, harga) VALUES (?, ?, ?, ?)";
        connection.query(query, [id, nama_item, quantity, harga], (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });

    await Promise.all(insertPromises);

    res.status(201).json({ message: "Items added successfully" });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint untuk memperbarui item di orders_items berdasarkan ID (PUT)
app.put("/orders_items/:id", (req, res) => {
  const { id } = req.params;
  const { cart_id, nama_item, quantity, harga } = req.body;
  const query =
    "UPDATE orders_items SET cart_id = ?, nama_item = ?, quantity = ?, harga = ? WHERE id = ?";
  connection.query(
    query,
    [cart_id, nama_item, quantity, harga, id],
    (err, results) => {
      if (err) {
        console.error("Error updating item in orders_items:", err);
        return res.status(500).send("Server error");
      }
      if (results.affectedRows === 0) {
        return res.status(404).send("Item not found");
      }
      res.status(200).json({
        message: "Item updated successfully",
        updatedRows: results.affectedRows, // Menampilkan jumlah baris yang terupdate
      });
    }
  );
});

// Endpoint untuk menghapus item dari orders_items berdasarkan ID (DELETE)
app.delete("/orders_items/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM orders_items WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting item from orders_items:", err);
      return res.status(500).send("Server error");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Item not found");
    }
    res.status(200).json({
      message: "Item deleted successfully",
      deletedRows: results.affectedRows, // Menampilkan jumlah baris yang dihapus
    });
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
