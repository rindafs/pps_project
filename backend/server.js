// server.js
const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const db = require('./db/connection');
const path = require('path'); 
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:3000',  // Ganti dengan URL frontend Anda jika berbeda
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Menambahkan middleware untuk mengakses folder 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use('/users', userRoutes); // Gunakan route user
app.use('/products', productRoutes); // Gunakan route product
app.use('/review', reviewRoutes);
app.use('/transaksi', transaksiRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
