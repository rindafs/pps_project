// models/userModel.js
const db = require('../db/connection');
const bcrypt = require('bcrypt');

// Query untuk membuat tabel users
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
  )
`;

// Membuat tabel users jika belum ada
db.query(createTableQuery, (err) => {
  if (err) {
    console.error('Gagal membuat tabel users:', err);
  } else {
    console.log('Tabel users sudah siap atau sudah ada.');
    // Panggil fungsi untuk membuat admin default
    createAdminAccount();
  }
});

// Fungsi untuk membuat akun admin default jika belum ada
const createAdminAccount = () => {
  const defaultAdmin = {
    nama: 'admin',
    email: 'admin@gmail.com',
    password: 'admin123', // Password tidak di-hash
    role: 'admin'
  };

  // Cek apakah sudah ada admin
  db.query('SELECT * FROM users WHERE email = ?', [defaultAdmin.email], (err, results) => {
    if (err) {
      console.error('Gagal memeriksa admin default:', err);
    } else if (results.length === 0) {
      // Buat admin default jika belum ada
      db.query(
        'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
        [defaultAdmin.nama, defaultAdmin.email, defaultAdmin.password, defaultAdmin.role],
        (err) => {
          if (err) {
            console.error('Gagal membuat admin default:', err);
          } else {
            console.log('Admin default berhasil dibuat.');
          }
        }
      );
    } else {
      console.log('Admin default sudah ada.');
    }
  });
};


const User = {};

// Ambil semua data pengguna
User.getAll = (callback) => {
  db.query('SELECT * FROM users', callback);
};

// Ambil data pengguna berdasarkan ID
User.getById = (id, callback) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], callback);
};

// Ambil data pengguna berdasarkan email
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (err) {
        reject(err);  // Jika terjadi error, reject dengan pesan error
      } else {
        resolve(result[0]);  // Mengembalikan data pengguna pertama yang ditemukan
      }
    });
  });
};

// Tambah pengguna baru
User.create = (data, callback) => {
  const { nama, email, password, role } = data;
  db.query(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, password, role],
      callback
  );
};


// Update data pengguna
User.update = (id, data, callback) => {
  const { nama, email, password, role } = data;

  if (password) {
    // Jika password ingin di-update, simpan langsung tanpa hashing
    db.query(
      'UPDATE users SET nama = ?, email = ?, password = ?, role = ? WHERE id = ?',
      [nama, email, password, role, id],
      callback
    );
  } else {
    // Jika password tidak ingin di-update
    db.query(
      'UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?',
      [nama, email, role, id],
      callback
    );
  }
};

// Hapus pengguna
User.delete = (id, callback) => {
  // Mulai transaksi untuk memastikan semua operasi berjalan dengan aman
  db.beginTransaction((err) => {
    if (err) return callback(err);

    // Langkah 1: Update user_id menjadi NULL di tabel reviews
    db.query('UPDATE reviews SET user_id = NULL WHERE user_id = ?', [id], (err) => {
      if (err) return db.rollback(() => callback(err));

      // Langkah 2: Update user_id menjadi NULL di tabel transactions
      db.query('UPDATE transactions SET user_id = NULL WHERE user_id = ?', [id], (err) => {
        if (err) return db.rollback(() => callback(err));

        // Langkah 3: Hapus user dari tabel users
        db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
          if (err) return db.rollback(() => callback(err));

          // Commit transaksi jika semua operasi berhasil
          db.commit((err) => {
            if (err) return db.rollback(() => callback(err));
            callback(null, result);
          });
        });
      });
    });
  });
};


module.exports = User;
