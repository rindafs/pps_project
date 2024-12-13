// controllers/transaksiController.js
const Transaction = require("../models/transaksiModel");

// Ambil semua data transaksi
exports.getAllTransactions = (req, res) => {
  Transaction.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
};

// Ambil data transaksi berdasarkan ID
exports.getTransactionById = (req, res) => {
  const { id } = req.params;
  Transaction.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    res.json(results[0]);
  });
};

exports.getTransactionByUserId = (req, res) => {
  const { user_id } = req.params; // Ambil user_id dari parameter URL
  Transaction.getByUserId(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message }); // Tangani error
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaksi tidak ditemukan untuk user_id ini" }); // Jika data tidak ditemukan
    }
    res.json(results); // Kirim semua data transaksi
  });
};

// Tambah transaksi baru
exports.createTransaction = async (req, res) => {
  const { user_id, product_id, jumlah, keterangan } = req.body;

  // Validasi input
  if (!user_id || !product_id || !jumlah) {
    return res
      .status(400)
      .json({ message: "User ID, Product ID, dan Jumlah harus diisi" });
  }

  try {
    // Cek apakah pasangan user_id dan product_id sudah ada
    Transaction.getAll((err, transactions) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Gagal memeriksa transaksi", error: err });
      }

      const existingTransaction = transactions.find(
        (t) =>
          t.user_id === parseInt(user_id) &&
          t.product_id === parseInt(product_id)
      );

      if (existingTransaction) {
        return res.status(400).json({
          message: `Product ini sudah ditambahkan`,
        });
      }

      // Jika pasangan belum ada, buat transaksi baru
      const transactionData = {
        user_id,
        product_id,
        jumlah,
        keterangan: !!keterangan, // Konversi ke boolean
      };

      Transaction.create(transactionData, (createErr, result) => {
        if (createErr) {
          return res
            .status(500)
            .json({ message: "Gagal menambahkan transaksi", error: createErr });
        }

        return res.status(201).json({
          message: "Transaksi berhasil ditambahkan",
          id: result.insertId,
          ...transactionData,
        });
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update transaksi berdasarkan ID
exports.updateTransaction = (req, res) => {
  const { id } = req.params;
  const { user_id, product_id, jumlah, keterangan } = req.body;

  // Validasi input
  if (!user_id || !product_id || !jumlah) {
    return res
      .status(400)
      .json({ message: "User ID, Product ID, dan Jumlah harus diisi" });
  }

  const transactionData = {
    user_id,
    product_id,
    jumlah,
    keterangan: keterangan ? true : false, // Menentukan true/false berdasarkan input
  };

  // Update transaksi di database
  Transaction.update(id, transactionData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    res.json({
      message: "Transaksi berhasil diperbarui",
      id,
      ...transactionData,
    });
  });
};

// Hapus transaksi berdasarkan ID
exports.deleteTransaction = (req, res) => {
  const { id } = req.params;
  Transaction.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    res.json({ message: "Transaksi berhasil dihapus" });
  });
};
