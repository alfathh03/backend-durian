import express from "express";
// Import semua fungsi dari controller
import { addToOrder, getOrderDetail, checkoutOrder } from "../controllers/orderController.js"; 

const router = express.Router();

// 1. Tambah item ke keranjang
router.post('/add', addToOrder);

// 2. Checkout / Bayar (URL INI YANG DIPANGGIL TOMBOL BAYAR)
router.post('/checkout', checkoutOrder); 

// 3. Ambil detail pesanan / Struk
router.get('/:id', getOrderDetail);

export default router;