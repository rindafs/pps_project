// controllers/reviewController.js
const Review = require("../models/reviewModel");

// Ambil semua data review
exports.getAllReviews = (req, res) => {
  Review.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
};

// Ambil data review berdasarkan ID produk
exports.getReviewsByProduct = (req, res) => {
  const { product_id } = req.params;
  Review.getByProductId(product_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }
    res.json(results);
  });
};

exports.getReviewsByProductAndUser = (req, res) => {
  const { product_id, user_id } = req.params;

  // Validasi input
  if (!product_id || !user_id) {
    return res
      .status(400)
      .json({ message: "Product ID dan User ID diperlukan" });
  }

  // Memanggil model
  Review.getByProductIdAndUserId(product_id, user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }
    res.json(results);
  });
};

exports.getReviewsByUserId = (req, res) => {
  const { user_id } = req.params; // Mengambil user_id dari URL parameter
  Review.getByUserId(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message }); // Menangani error
    }
    if (results.message) {
      return res.status(404).json({ message: results.message }); // Menangani jika tidak ada review
    }
    res.json(results); // Menampilkan hasil review dalam format JSON
  });
};

// Tambah review baru
exports.createReview = (req, res) => {
  const { user_id, product_id, rating, comment } = req.body;

  // Validasi input
  if (!user_id || !product_id || !rating || !comment) {
    return res.status(400).json({
      message: "user_id, product_id, rating, dan comment harus diisi",
    });
  }

  const data = { user_id, product_id, rating, comment };

  // Simpan data ke database
  Review.create(data, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ id: result.insertId, ...data });
  });
};

// Update data review
exports.updateReview = (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating dan comment harus diisi" });
  }

  const data = { rating, comment };

  Review.update(id, data, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }
    res.json({ id, ...data });
  });
};

exports.updateReviewByUser = (req, res) => {
  const { user_id } = req.params; // Ambil user_id dari parameter URL
  const { rating, comment } = req.body; // Ambil data yang akan diperbarui

  // Validasi input
  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating dan comment wajib diisi" });
  }

  // Cari review berdasarkan user_id
  Review.findByUserId(user_id, (err, review) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan saat mencari review" });
    }
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review tidak ditemukan untuk user ini" });
    }

    // Update review
    const data = { rating, comment };
    Review.updateByUserId(user_id, data, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Terjadi kesalahan saat mengupdate review" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Review tidak ditemukan atau tidak dapat diperbarui",
        });
      }
      res.json({
        id: review.id,
        user_id,
        rating,
        comment,
        created_at: review.created_at, // Tetap gunakan waktu pembuatan asli
      });
    });
  });
};

// Hapus review
exports.deleteReviewByUserIdAndProductId = (req, res) => {
  const { user_id, product_id } = req.params; // Mengambil user_id dan product_id dari URL params

  // Menghapus review berdasarkan user_id dan product_id
  Review.deleteByUserIdAndProductId(user_id, product_id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Review tidak ditemukan untuk user dan produk ini" });
    }
    res.json({ message: "Review berhasil dihapus" });
  });
};

// Menghitung rata-rata rating untuk sebuah produk
exports.getAverageRating = (req, res) => {
  const { product_id } = req.params;

  Review.getAverageRating(product_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length === 0 || results[0].averageRating === null) {
      return res
        .status(404)
        .json({ message: "Produk tidak ditemukan atau belum ada rating" });
    }
    res.json({
      product_id,
      averageRating: results[0].averageRating,
    });
  });
};
