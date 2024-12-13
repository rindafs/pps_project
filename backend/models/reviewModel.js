const db = require("../db/connection");

// Query untuk membuat tabel reviews
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NULL,
    user_id INT NULL,
    rating TINYINT NOT NULL,  -- Tidak menggunakan CHECK, bisa divalidasi di aplikasi
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )
`;

// Membuat tabel reviews jika belum ada
db.query(createTableQuery, (err) => {
  if (err) {
    console.error("Gagal membuat tabel reviews:", err);
  } else {
    console.log("Tabel reviews sudah siap atau sudah ada.");

    // Pastikan kolom product_id dapat bernilai NULL
    const alterProductIdQuery = `ALTER TABLE reviews MODIFY COLUMN product_id INT NULL;`;
    db.query(alterProductIdQuery, (alterErr) => {
      if (alterErr) {
        console.error(
          "Gagal mengubah kolom product_id menjadi NULL:",
          alterErr
        );
      } else {
        console.log(
          "Kolom product_id berhasil diubah menjadi NULL di tabel reviews."
        );
      }
    });

    // Pastikan kolom user_id dapat bernilai NULL
    const alterUserIdQuery = `ALTER TABLE reviews MODIFY COLUMN user_id INT NULL;`;
    db.query(alterUserIdQuery, (alterErr) => {
      if (alterErr) {
        console.error("Gagal mengubah kolom user_id menjadi NULL:", alterErr);
      } else {
        console.log(
          "Kolom user_id berhasil diubah menjadi NULL di tabel reviews."
        );
      }
    });
  }
});

const Review = {};

// Ambil semua ulasan
Review.getAll = (callback) => {
  db.query("SELECT * FROM reviews", callback);
};

// Ambil ulasan berdasarkan ID produk
Review.getByProductId = (product_id, callback) => {
  db.query(
    "SELECT * FROM reviews WHERE product_id = ?",
    [product_id],
    callback
  );
};

Review.getByProductIdAndUserId = (product_id, user_id, callback) => {
  db.query(
    "SELECT * FROM reviews WHERE product_id = ? AND user_id = ?",
    [product_id, user_id],
    callback
  );
};

// Ambil ulasan berdasarkan ID pengguna
Review.getByUserId = function (user_id, callback) {
  const query = "SELECT * FROM reviews WHERE user_id = ?";
  db.query(query, [user_id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Ambil ulasan berdasarkan ID
Review.getById = (id, callback) => {
  db.query("SELECT * FROM reviews WHERE id = ?", [id], callback);
};

// Tambah ulasan baru
Review.create = (data, callback) => {
  const { product_id, user_id, rating, comment } = data;
  db.query(
    "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
    [product_id, user_id, rating, comment],
    callback
  );
};

// Update ulasan
Review.update = (id, data, callback) => {
  const { rating, comment } = data;
  db.query(
    "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
    [rating, comment, id],
    callback
  );
};

// Fungsi untuk mendapatkan review berdasarkan user_id
Review.findByUserId = (user_id, callback) => {
  const query = "SELECT * FROM reviews WHERE user_id = ?";
  db.query(query, [user_id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, results.length > 0 ? results[0] : null);
  });
};

// Fungsi untuk memperbarui review berdasarkan user_id
Review.updateByUserId = (user_id, data, callback) => {
  const query = "UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ?";
  db.query(query, [data.rating, data.comment, user_id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Model Review
Review.deleteByUserIdAndProductId = (user_id, product_id, callback) => {
  const query = "DELETE FROM reviews WHERE user_id = ? AND product_id = ?";
  db.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result);
  });
};

// Menghitung rata-rata rating untuk sebuah produk
Review.getAverageRating = (product_id, callback) => {
  db.query(
    "SELECT AVG(rating) AS averageRating FROM reviews WHERE product_id = ?",
    [product_id],
    callback
  );
};

module.exports = Review;
