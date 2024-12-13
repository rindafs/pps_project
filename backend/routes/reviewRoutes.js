// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Endpoint untuk mendapatkan rata-rata rating dari produk berdasarkan ID produk
router.get("/average-rating/:product_id", reviewController.getAverageRating);

// Endpoint untuk menambahkan ulasan dan rating baru
router.post("/", reviewController.createReview); // Pastikan createReview ada di controller

// Endpoint untuk mendapatkan semua ulasan untuk produk tertentu
router.get("/:product_id", reviewController.getReviewsByProduct); // Pastikan getReviewsByProduct ada di controller

// Endpoint untuk mengupdate ulasan berdasarkan ID ulasan
router.put("/:id", reviewController.updateReview); // Pastikan updateReview ada di controller

// Endpoint untuk menghapus ulasan berdasarkan ID ulasan
router.delete(
  "/:user_id/:product_id",
  reviewController.deleteReviewByUserIdAndProductId
);

// Endpoint untuk mengambil semua review
router.get("/", reviewController.getAllReviews); // GET untuk mengambil semua review

router.get("/user/:user_id", reviewController.getReviewsByUserId);

router.put("/user/:user_id", reviewController.updateReviewByUser);

router.get(
  "/:product_id/:user_id",
  reviewController.getReviewsByProductAndUser
);

module.exports = router;
