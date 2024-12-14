const pool = require('../config/db');

// Mendapatkan semua item di cart
async function get_all() {
    const [rows] = await pool.query('SELECT * FROM cart');
    return rows;
}

// Menambahkan item baru ke cart
async function add(item) {
    const { nama_item, quantity, harga } = item;
    const [result] = await pool.query(
        'INSERT INTO cart (nama_item, quantity, harga) VALUES (?, ?, ?)',
        [nama_item, quantity, harga]
    );
    return { id: result.insertId, nama_item, quantity, harga };
}

// Memperbarui quantity berdasarkan id
async function update_quantity(id, quantity) {
    const [result] = await pool.query(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [quantity, id]
    );
    return result.affectedRows > 0;
}

// Menghapus item berdasarkan id
async function delete_item(id) {
    const [result] = await pool.query('DELETE FROM cart WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

// Menghitung total harga
async function calculate_total() {
    const [rows] = await pool.query('SELECT SUM(quantity * harga) AS total_harga FROM cart');
    return rows[0].total_harga || 0;
}

module.exports = {
    get_all,
    add,
    update_quantity,
    delete: delete_item,
    calculate_total,
};


// const db = require('../config/db.js');

// // Mendapatkan semua item di cart
// async function get_all() {
//   const [rows] = await db.query('SELECT * FROM cart');
//   return rows;
// }

// // Menambahkan item baru ke cart
// async function add(item) {
//   const { nama_item, quantity, harga } = item;
//   const [result] = await db.query(
//     'INSERT INTO cart (nama_item, quantity, harga) VALUES (?, ?, ?)',
//     [nama_item, quantity, harga]
//   );
//   return { id: result.insertId, nama_item, quantity, harga };
// }

// // Memperbarui quantity berdasarkan id
// async function update_quantity(id, quantity) {
//   const [result] = await db.query(
//     'UPDATE cart SET quantity = ? WHERE id = ?',
//     [quantity, id]
//   );
//   return result.affectedRows > 0;
// }

// // Menghapus item berdasarkan id
// async function delete_item(id) {
//   const [result] = await db.query('DELETE FROM cart WHERE id = ?', [id]);
//   return result.affectedRows > 0;
// }

// // Menghitung total harga
// async function calculate_total() {
//   const [rows] = await db.query('SELECT SUM(quantity * harga) AS total_harga FROM cart');
//   return rows[0].total_harga || 0;
// }

// module.exports = {
//   get_all,
//   add,
//   update_quantity,
//   delete: delete_item,
//   calculate_total,
// };