import db from "../config/db.js";

export const addToOrder = async (req, res) => {
    // 1. CCTV: Lihat data apa yang dikirim React
    console.log("--- MENERIMA REQUEST TAMBAH ORDER ---");
    console.log("Data dari React:", req.body); 

    const { menu_id, quantity, order_id } = req.body;

    // 2. Cek Validasi
    if (!menu_id) {
        console.log("ERROR: Menu ID Kosong!");
        return res.status(400).json({ success: false, message: 'Menu ID wajib ada' });
    }

    try {
        let currentOrderId = order_id;

        // 3. Cek apakah menu ada di DB
        console.log(`Mengecek menu dengan ID: ${menu_id}...`);
        const [menuRows] = await db.query('SELECT * FROM table_menu WHERE id = ?', [menu_id]);
        
        if (menuRows.length === 0) {
            console.log("ERROR: Menu tidak ditemukan di database!");
            return res.status(404).json({ success: false, message: 'Menu tidak ditemukan di database' });
        }

        const price = parseFloat(menuRows[0].price || menuRows[0].harga); // Cek kolom price/harga
        const subtotal = price * quantity;
        console.log(`Harga Menu: ${price}, Subtotal: ${subtotal}`);

        // 4. Buat Order Baru (Header) jika belum ada order_id
        if (!currentOrderId) {
            console.log("Membuat Order ID baru...");
            const [newOrder] = await db.query(
                'INSERT INTO orders (total_amount, status) VALUES (?, ?)', 
                [0, 'PENDING']
            );
            currentOrderId = newOrder.insertId;
            console.log("Order ID Baru Terbuat:", currentOrderId);
        } else {
            console.log("Menggunakan Order ID lama:", currentOrderId);
        }

        // 5. Masukkan Item ke Order
        // Cek dulu apakah item sudah ada
        const [existingItem] = await db.query(
            'SELECT id FROM order_items WHERE order_id = ? AND menu_id = ?',
            [currentOrderId, menu_id]
        );

        if (existingItem.length > 0) {
            console.log("Item sudah ada, update quantity...");
            await db.query(
                'UPDATE order_items SET quantity = ?, subtotal = ? WHERE id = ?',
                [quantity, subtotal, existingItem[0].id]
            );
        } else {
            console.log("Item baru, insert ke database...");
            await db.query(
                'INSERT INTO order_items (order_id, menu_id, quantity, price_at_order, subtotal) VALUES (?, ?, ?, ?, ?)',
                [currentOrderId, menu_id, quantity, price, subtotal]
            );
        }

        // 6. Update Total Akhir
        console.log("Update total harga order...");
        const [totalResult] = await db.query(
            'SELECT SUM(subtotal) as total FROM order_items WHERE order_id = ?',
            [currentOrderId]
        );
        const newTotal = totalResult[0].total || 0;
        await db.query('UPDATE orders SET total_amount = ? WHERE id = ?', [newTotal, currentOrderId]);

        console.log("--- SUKSES! DATA MASUK ---");
        
        res.json({
            success: true,
            message: 'Berhasil update keranjang',
            order_id: currentOrderId,
            total_amount: newTotal
        });

    } catch (error) {
        // Ini akan menangkap Error SQL (misal nama kolom salah)
        console.error("!!! ERROR FATAL DI BACKEND !!!");
        console.error(error); 
        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    }
};