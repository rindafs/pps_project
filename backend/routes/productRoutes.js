const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProduct);          // GET semua product
router.get('/:id', productController.getProductById);       // GET product berdasarkan ID
router.post('/', productController.createProduct);          // POST buat product baru
router.put('/:id', productController.updateProduct);        // PUT update product
router.delete('/:id', productController.deleteProduct);

module.exports = router;