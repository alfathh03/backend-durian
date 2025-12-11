import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Ambil Data yang dikirim dari MenuPages
  const { cart, orderId } = location.state || { cart: [], orderId: null };

  // State untuk Catatan
  const [note, setNote] = useState("");

  // Hitung Total Harga untuk Tampilan
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- 2. FUNGSI BAYAR (COD) ---
  const handleBayar = async () => {
    if (!orderId) {
        alert("Order ID hilang! Silakan kembali ke menu dan tambah item lagi.");
        return;
    }

    try {
      console.log("Mengirim request checkout...");
      
      const res = await fetch("http://localhost:5000/api/order/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            order_id: orderId,   // Ambil ID dinamis dari state
            payment_method: "COD",
            notes: note          // Ambil catatan dari textarea
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Pesanan Berhasil!");
        // Pindah ke Halaman Struk (bawa orderId untuk ditampilkan)
        navigate("/struk", { state: { orderId: orderId } });
      } else {
        alert("Gagal: " + data.message);
      }

    } catch (error) {
      console.error("Error checkout:", error);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <div className="p-4 min-h-screen bg-amber-50">
      <h1 className="text-2xl font-bold text-center text-amber-700 mb-6">Detail Pesanan</h1>

      {/* List Item Belanja */}
      <div className="space-y-3">
        {cart.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">{item.name || item.nama_menu}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-orange-600">
              Rp {item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* Total Harga */}
      <div className="bg-white p-4 rounded-lg shadow mt-4 flex justify-between items-center">
        <h3 className="font-bold text-lg">Total</h3>
        <h3 className="font-bold text-xl text-orange-600">Rp {totalAmount}</h3>
      </div>

      {/* Input Catatan */}
      <div className="mt-4">
        <textarea
          className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          rows="3"
          placeholder="Tambahkan catatan untuk pesanan... (Contoh: Jangan pedas)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-8 space-y-3">
        {/* TOMBOL BAYAR DITEMPAT */}
        <button
          onClick={handleBayar} // <--- FUNGSI DIPANGGIL DISINI
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg shadow active:scale-95 hover:bg-orange-600 transition"
        >
          💵 Bayar Ditempat
        </button>

        <button className="w-full py-3 bg-yellow-400 text-gray-800 font-bold rounded-lg shadow active:scale-95 hover:bg-yellow-500 transition">
          💳 Bayar Online
        </button>
        
        <button 
            onClick={() => navigate(-1)}
            className="w-full py-2 text-gray-500 text-sm hover:underline"
        >
            ← Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default DetailPage;