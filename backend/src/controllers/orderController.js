import db from "../config/db.js";

// --- 1. FUNGSI TAMBAH ORDER (Masuk Keranjang) ---
export const addToOrder = async (req, res) => {
    // Debugging
    console.log("📥 Request Masuk (Add):", req.body);
    const { menu_id, quantity, order_id } = req.body;

    if (!menu_id || !quantity) {
        return res.status(400).json({ success: false, message: 'Data menu_id atau quantity kosong!' });
    }

    try {
        let currentOrderId = order_id;

        // Ambil data menu (Pastikan nama tabel 'menu' sesuai DB kamu)
        const [menuRows] = await db.query('SELECT * FROM menu WHERE id = ?', [menu_id]);
        
        if (menuRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Menu tidak ditemukan' });
        }
        
        // Deteksi Harga (Smart detection: price vs harga)
        const item = menuRows[0];
        const price = parseFloat(item.price || item.harga || 0);
        const subtotal = price * quantity;

        // Buat Order Baru (Header) kalau belum punya ID
        if (!currentOrderId) {
            const [newOrder] = await db.query(
                'INSERT INTO orders (total_amount, status) VALUES (?, ?)', 
                [0, 'PENDING']
            );
            currentOrderId = newOrder.insertId;
        }

        // Cek Item di database
        const [existingItem] = await db.query(
            'SELECT id FROM order_items WHERE order_id = ? AND menu_id = ?',
            [currentOrderId, menu_id]
        );

        if (existingItem.length > 0) {
            // Update quantity
            await db.query(
                'UPDATE order_items SET quantity = ?, subtotal = ? WHERE id = ?',
                [quantity, subtotal, existingItem[0].id]
            );
        } else {
            // Insert baru
            await db.query(
                'INSERT INTO order_items (order_id, menu_id, quantity, price_at_order, subtotal) VALUES (?, ?, ?, ?, ?)',
                [currentOrderId, menu_id, quantity, price, subtotal]
            );
        }

        // Hitung Total Ulang
        const [totalResult] = await db.query(
            'SELECT SUM(subtotal) as total FROM order_items WHERE order_id = ?',
            [currentOrderId]
        );
        const newTotal = totalResult[0].total || 0;

        await db.query('UPDATE orders SET total_amount = ? WHERE id = ?', [newTotal, currentOrderId]);

        res.json({
            success: true,
            message: 'Berhasil update keranjang',
            order_id: currentOrderId,
            total_amount: newTotal
        });

    } catch (error) {
        console.error("🔥 ERROR DATABASE (Add) 🔥", error); 
        res.status(500).json({ success: false, message: 'Database Error: ' + error.message });
    }
};

// --- 2. FUNGSI CHECKOUT / KONFIRMASI PEMBAYARAN (Baru!) ---
export const checkoutOrder = async (req, res) => {
    console.log("💰 Request Checkout:", req.body);
    const { order_id, payment_method, notes } = req.body;

    if (!order_id || !payment_method) {
        return res.status(400).json({ success: false, message: 'Order ID dan Metode Pembayaran wajib ada' });
    }

    try {
        // Update Status jadi PAID/COD, simpan Notes, update Waktu
        const [result] = await db.query(
            'UPDATE orders SET status = ?, payment_method = ?, notes = ?, updated_at = NOW() WHERE id = ?',
            ['PAID', payment_method, notes, order_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order ID tidak ditemukan' });
        }

        console.log(`✅ Order ${order_id} Sukses Checkout`);

        res.json({
            success: true,
            message: 'Checkout berhasil',
            order_id: order_id
        });

    } catch (error) {
        console.error("🔥 Error Checkout:", error);
        res.status(500).json({ success: false, message: 'Gagal Checkout: ' + error.message });
    }
};

// --- 3. FUNGSI LIHAT DETAIL / STRUK (GET) ---
export const getOrderDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const [orderRows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
        
        if (orderRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
        }

        const order = orderRows[0];

        // Join dengan tabel 'menu'
        const [items] = await db.query(`
            SELECT 
                oi.id, 
                oi.quantity, 
                oi.subtotal, 
                tm.id as menu_id,
                tm.* FROM order_items oi
            JOIN menu tm ON oi.menu_id = tm.id  
            WHERE oi.order_id = ?
        `, [id]);

        const formattedItems = items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            subtotal: item.subtotal,
            menu_name: item.name || item.nama_menu || item.nama || "Tanpa Nama",
            price_per_item: item.price || item.harga || 0,
            gambar: item.gambar || item.image || item.img
        }));

        res.json({
            success: true,
            data: {
                ...order,
                items: formattedItems
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};