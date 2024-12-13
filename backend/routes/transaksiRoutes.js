// routes/transaksiRoutes.js
const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");

// GET semua transaksi
router.get("/", transaksiController.getAllTransactions);

// GET transaksi berdasarkan ID
router.get("/:id", transaksiController.getTransactionById);

// POST buat transaksi baru
router.post("/", transaksiController.createTransaction);

// PUT update transaksi berdasarkan ID
router.put("/:id", transaksiController.updateTransaction);

router.get("/user/:user_id", transaksiController.getTransactionByUserId);

// DELETE hapus transaksi berdasarkan ID
router.delete("/:id", transaksiController.deleteTransaction);

module.exports = router;
