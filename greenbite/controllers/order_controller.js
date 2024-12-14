const express = require('express');
const router = express.Router();
const orderModel = require('../models/order_model');

// Endpoint untuk mendapatkan semua pesanan (GET)
router.get('/orders', (req, res) => {
  orderModel.getAllOrders((err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(orders);
  });
});

// Endpoint untuk mendapatkan pesanan berdasarkan ID (GET)
router.get('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  orderModel.getOrderById(orderId, (err, order) => {
    if (err) {
      console.error('Error fetching order:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (order.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  });
});

// Endpoint untuk membuat pesanan baru (POST)
router.post('/orders', (req, res) => {
  const { metode_pembayaran, total_pembayaran, status_pesanan, orderItems } = req.body;

  orderModel.createOrder(metode_pembayaran, total_pembayaran, status_pesanan, orderItems, (err, result) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'Order created successfully', orderId: result.orderId });
  });
});

// Endpoint untuk memperbarui pesanan (PUT)
router.put('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  const { metode_pembayaran, total_pembayaran, status_pesanan } = req.body;

  orderModel.updateOrder(orderId, metode_pembayaran, total_pembayaran, status_pesanan, (err, result) => {
    if (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully' });
  });
});

// Endpoint untuk menghapus pesanan (DELETE)
router.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;

  orderModel.deleteOrder(orderId, (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  });
});

module.exports = router;
