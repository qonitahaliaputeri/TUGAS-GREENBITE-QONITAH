// const cart_model = require('../models/cart_model');

// // Mendapatkan semua item di cart
// async function get_all_cart_items() {
//     return await cart_model.get_all();
// }

// // Menambahkan item baru ke cart
// async function add_cart_item(item) {
//     return await cart_model.add(item);
// }

// // Memperbarui jumlah (quantity) item di cart
// async function update_cart_item_quantity(id, quantity) {
//     return await cart_model.update_quantity(id, quantity);
// }

// // Menghapus item dari cart berdasarkan ID
// async function delete_cart_item(id) {
//     return await cart_model.delete(id);
// }

// // Menghitung total harga dari semua item di cart
// async function calculate_cart_total() {
//     return await cart_model.calculate_total();
// }

// module.exports = {
//     get_all_cart_items,
//     add_cart_item,
//     update_cart_item_quantity,
//     delete_cart_item,
//     calculate_cart_total,
// };

const cart_model = require('../models/cart_model');

// Mendapatkan semua item di cart
async function get_all_cart_items() {
  return await cart_model.get_all();
}

// Menambahkan item baru ke cart
async function add_cart_item(item) {
  return await cart_model.add(item);
}

// Memperbarui jumlah (quantity) item di cart
async function update_cart_item_quantity(id, quantity) {
  return await cart_model.update_quantity(id, quantity);
}

// Menghapus item dari cart berdasarkan ID
async function delete_cart_item(id) {
    return await cart_model.delete(id);
}

// Menghitung total harga dari semua item di cart
async function calculate_cart_total() {
  return await cart_model.calculate_total();
}

module.exports = {
  get_all_cart_items,
  add_cart_item,
  update_cart_item_quantity,
  delete_cart_item,
  calculate_cart_total,
};