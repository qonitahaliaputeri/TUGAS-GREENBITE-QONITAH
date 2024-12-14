const connection = require('../config/db'); // Pastikan Anda sudah mengonfigurasi database

// Model untuk mengambil semua pesanan
const getAllOrders = (callback) => {
  const query = `
    SELECT o.id, o.metode_pembayaran, o.total_pembayaran, o.status_pesanan, oi.item_id, oi.quantity
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id;
  `;
  connection.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Model untuk mengambil pesanan berdasarkan ID
const getOrderById = (orderId, callback) => {
  const query = `
    SELECT o.id, o.metode_pembayaran, o.total_pembayaran, o.status_pesanan, oi.item_id, oi.quantity
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = ?;
  `;
  connection.query(query, [orderId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Model untuk menambah pesanan
const createOrder = (metode_pembayaran, total_pembayaran, status_pesanan, orderItems, callback) => {
  const query = 'INSERT INTO orders (metode_pembayaran, total_pembayaran, status_pesanan) VALUES (?, ?, ?)';
  connection.query(query, [metode_pembayaran, total_pembayaran, status_pesanan], (err, results) => {
    if (err) return callback(err);

    const orderId = results.insertId; // Ambil ID pesanan yang baru dimasukkan

    // Menambah item ke pesanan
    const insertItemsQuery = 'INSERT INTO order_items (order_id, item_id, quantity) VALUES ?';
    const values = orderItems.map(item => [orderId, item.item_id, item.quantity]);

    connection.query(insertItemsQuery, [values], (err) => {
      if (err) return callback(err);
      callback(null, { orderId, message: 'Order created successfully' });
    });
  });
};

// Model untuk memperbarui pesanan
const updateOrder = (orderId, metode_pembayaran, total_pembayaran, status_pesanan, callback) => {
  const query = 'UPDATE orders SET metode_pembayaran = ?, total_pembayaran = ?, status_pesanan = ? WHERE id = ?';
  connection.query(query, [metode_pembayaran, total_pembayaran, status_pesanan, orderId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Model untuk menghapus pesanan
const deleteOrder = (orderId, callback) => {
  const query = 'DELETE FROM orders WHERE id = ?';
  connection.query(query, [orderId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
