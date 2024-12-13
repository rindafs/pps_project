// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);          // GET semua pengguna
router.get('/:id', userController.getUserById);       // GET pengguna berdasarkan ID
router.post('/', userController.createUser);          // POST buat pengguna baru
router.put('/:id', userController.updateUser);        // PUT update pengguna
router.delete('/:id', userController.deleteUser);     // DELETE hapus pengguna
router.post('/login', userController.loginUser);

module.exports = router;
