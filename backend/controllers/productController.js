const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Konfigurasi multer untuk menangani file gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Menyimpan file di folder uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Membuat nama file unik berdasarkan waktu
  },
});

const upload = multer({ storage: storage });

// GET semua produk
exports.getAllProduct = (req, res) => {
  Product.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
};

// GET produk berdasarkan ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  Product.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json(results[0]);
  });
};

// POST buat produk baru
exports.createProduct = [
  upload.single("gambar"),
  (req, res) => {
    const { nama, harga, deskripsi } = req.body;
    const gambar = req.file ? req.file.filename : null; // Ambil nama file gambar jika ada

    // Validasi input
    if (!nama || !harga || !deskripsi) {
      return res
        .status(400)
        .json({ message: "Nama, harga, dan deskripsi harus diisi" });
    }

    const data = {
      nama,
      harga,
      deskripsi,
      gambar,
    };

    Product.create(data, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ id: result.insertId, ...data });
    });
  },
];

// PUT update produk berdasarkan ID
exports.updateProduct = [
  upload.single("gambar"), // Middleware untuk upload file
  (req, res) => {
    const { id } = req.params;
    const { nama, harga, deskripsi } = req.body;
    const gambar = req.file ? req.file.filename : null; // Ambil nama file gambar jika ada

    // Validasi input
    if (!nama || !harga || !deskripsi) {
      return res
        .status(400)
        .json({ message: "Nama, harga, dan deskripsi harus diisi" });
    }

    const data = {
      nama,
      harga,
      deskripsi,
      gambar: gambar || undefined, // Jika gambar null, maka biarkan tetap null
    };

    Product.update(id, data, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      res.json({ id, ...data });
    });
  },
];

// DELETE produk berdasarkan ID
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  Product.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    res.json({ message: "Produk berhasil dihapus" });
  });
};
