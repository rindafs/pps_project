const db = require('../db/connection');

// Query untuk membuat tabel transaksi dengan keterangan sebagai BOOLEAN
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    product_id INT NULL,
    jumlah INT NOT NULL,
    keterangan BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
  )
`;

// Membuat tabel transaksi jika belum ada
db.query(createTableQuery, (err) => {
  if (err) {
    console.error('Gagal membuat tabel transaksi:', err);
  } else {
    console.log('Tabel transaksi sudah siap atau sudah ada.');

    // Query ALTER TABLE untuk memastikan product_id dapat bernilai NULL di tabel transactions
    const alterTransactionsQuery = `ALTER TABLE transactions MODIFY COLUMN product_id INT NULL;`;
    db.query(alterTransactionsQuery, (alterErr) => {
      if (alterErr) {
        console.error('Gagal mengubah kolom product_id menjadi NULL di tabel transactions:', alterErr);
      } else {
        console.log('Kolom product_id berhasil diubah menjadi NULL di tabel transactions.');
      }
    });

    // Query ALTER TABLE untuk memastikan user_id dapat bernilai NULL di tabel reviews
    const alterUserIdQuery = `ALTER TABLE transactions MODIFY COLUMN user_id INT NULL;`;
    db.query(alterUserIdQuery, (alterErr) => {
      if (alterErr) {
        console.error('Gagal mengubah kolom user_id menjadi NULL di tabel reviews:', alterErr);
      } else {
        console.log('Kolom user_id berhasil diubah menjadi NULL di tabel reviews.');
      }
    });
  }
});

const Transaction = {};

// Ambil semua data transaksi
Transaction.getAll = (callback) => {
  db.query('SELECT * FROM transactions', callback);
};

// Ambil data transaksi berdasarkan ID
Transaction.getById = (id, callback) => {
  db.query('SELECT * FROM transactions WHERE id = ?', [id], callback);
};

// Tambah transaksi baru
Transaction.create = (data, callback) => {
  const { user_id, product_id, jumlah, keterangan } = data;
  db.query(
    'INSERT INTO transactions (user_id, product_id, jumlah, keterangan) VALUES (?, ?, ?, ?)',
    [user_id, product_id, jumlah, keterangan],
    callback
  );
};

// Update transaksi
Transaction.update = (id, data, callback) => {
  const { user_id, product_id, jumlah, keterangan } = data;
  db.query(
    'UPDATE transactions SET user_id = ?, product_id = ?, jumlah = ?, keterangan = ? WHERE id = ?',
    [user_id, product_id, jumlah, keterangan, id],
    callback
  );
};

// Hapus transaksi
Transaction.delete = (id, callback) => {
  db.query('DELETE FROM transactions WHERE id = ?', [id], callback);
};

module.exports = Transaction;
