// controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

// Ambil semua data pengguna
exports.getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
};

// Ambil data pengguna berdasarkan ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  User.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    res.json(results[0]);
  });
};

// Tambah pengguna baru
exports.createUser = (req, res) => {
  const { nama, email, password, role } = req.body;

  // Validasi input
  if (!nama || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password harus diisi' });
  }

  // Tentukan role default jika tidak ada dalam request body
  const userRole = role && (role === 'admin' || role === 'user') ? role : 'user';

  const data = {
      nama,
      email,
      password, // Tidak di-hash
      role: userRole, // Gunakan role default jika tidak ada
  };

  // Simpan data ke database
  User.create(data, (err, result) => {
      if (err) {
          return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ id: result.insertId, ...data });
  });
};

// Update data pengguna
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, password, role } = req.body;

    // Validasi role jika di-update
    if (role && role !== 'admin' && role !== 'user') {
      return res.status(400).json({ message: 'Role harus berupa "admin" atau "user"' });
    }

    let data = { nama, email, role };

    // Jika password ingin di-update
    if (password) {
      // Simpan password langsung tanpa hashing
      data.password = password;
    }

    User.update(id, data, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
      }
      res.json({ id, ...data });
    });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui pengguna' });
  }
};


// Hapus pengguna
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  User.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({ message: 'User berhasil dihapus' });
  });
};




// Fungsi login pengguna
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  // Query ke database untuk mencari user berdasarkan email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Terjadi kesalahan saat mengambil data pengguna:', err);
      return res.status(500).json({ message: 'Gagal mengambil data pengguna' });
    }

    // Jika user tidak ditemukan
    if (result.length === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    const user = result[0];

    // Verifikasi password yang dimasukkan dengan password di database (tanpa hashing)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // Buat JWT token jika login berhasil
    const payload = {
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: user.role,
    };

    const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });

    // Kirimkan token, id_user, dan data pengguna dalam respons
    return res.json({
      message: 'Login berhasil',
      token,
      user_id: user.id,  // Menambahkan id_user ke dalam response
      nama: user.nama,    // Pastikan kolom 'nama' ada di database
      email: user.email,
      role: user.role,
    });
  });
};


