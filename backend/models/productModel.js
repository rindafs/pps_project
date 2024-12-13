const db = require("../db/connection"); // Pastikan path ini sesuai dengan konfigurasi koneksi database

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    harga DECIMAL(10, 2) NOT NULL,
    deskripsi TEXT,
    gambar VARCHAR(255)
  )
`;

db.query(createTableQuery, (err) => {
  if (err) {
    console.error("Gagal membuat tabel products:", err);
  } else {
    console.log("Tabel products sudah siap atau sudah ada.");
  }
});

const Product = {};

// Ambil semua data produk
Product.getAll = (callback) => {
  db.query("SELECT * FROM products", callback);
};

// Ambil data produk berdasarkan ID
Product.getById = (id, callback) => {
  db.query("SELECT * FROM products WHERE id = ?", [id], callback);
};

// Tambah produk baru
Product.create = (data, callback) => {
  const { nama, harga, deskripsi, gambar } = data;
  db.query(
    "INSERT INTO products (nama, harga, deskripsi, gambar) VALUES (?, ?, ?, ?)",
    [nama, harga, deskripsi, gambar],
    callback
  );
};

// Update produk berdasarkan ID
Product.update = (id, data, callback) => {
  const { nama, harga, deskripsi, gambar } = data;
  const query =
    "UPDATE products SET nama = ?, harga = ?, deskripsi = ?, gambar = ? WHERE id = ?";
  db.query(query, [nama, harga, deskripsi, gambar, id], callback);
};

// Hapus produk berdasarkan ID
// Fungsi untuk menghapus produk dan mengatur product_id menjadi NULL di tabel terkait
Product.delete = (id, callback) => {
  // Mulai transaksi untuk memastikan semua operasi berjalan dengan aman
  db.beginTransaction((err) => {
    if (err) return callback(err);

    // Langkah 1: Update product_id menjadi NULL di tabel reviews
    db.query(
      "UPDATE reviews SET product_id = NULL WHERE product_id = ?",
      [id],
      (err) => {
        if (err) return db.rollback(() => callback(err));

        // Langkah 2: Update product_id menjadi NULL di tabel transactions
        db.query(
          "UPDATE transactions SET product_id = NULL WHERE product_id = ?",
          [id],
          (err) => {
            if (err) return db.rollback(() => callback(err));

            // Langkah 3: Hapus produk dari tabel products
            db.query(
              "DELETE FROM products WHERE id = ?",
              [id],
              (err, result) => {
                if (err) return db.rollback(() => callback(err));

                // Commit transaksi jika semua operasi berhasil
                db.commit((err) => {
                  if (err) return db.rollback(() => callback(err));
                  callback(null, result);
                });
              }
            );
          }
        );
      }
    );
  });
};

module.exports = Product;
