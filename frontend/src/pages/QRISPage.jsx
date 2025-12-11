import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// --- 1. IMPORT GAMBAR DI SINI ---
// Pastikan nama filenya sama dengan yang kamu simpan di folder assets
import qrisImage from "../assets/qris.jpeg"; 
// --------------------------------

const QRISPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, totalAmount, note } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data tidak ditemukan. <button onClick={() => navigate("/")} className="text-blue-500">Kembali</button></p>
      </div>
    );
  }

  const handleSimulasiBayar = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/order/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            order_id: orderId,
            payment_method: "QRIS",
            notes: note || "-"
        })
      });

      const data = await res.json();

      if (data.success) {
        setTimeout(() => {
            alert("Pembayaran QRIS Berhasil!");
            navigate("/struk", { state: { orderId: orderId } });
        }, 1500);
      } else {
        alert("Gagal: " + data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error QRIS:", error);
      alert("Gagal menghubungkan ke server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">QRIS Payment</h1>
          <p className="text-gray-500 text-sm">Scan QR code di bawah ini</p>
        </div>

        {/* --- 2. TAMPILKAN GAMBAR ASLI --- */}
        <div className="border-2 border-gray-200 rounded-lg p-2 inline-block mb-4">
          <img 
            src={qrisImage} // <--- Pakai variabel import tadi
            alt="Scan QRIS Kami" 
            className="w-full max-w-[250px] h-auto object-contain"
          />
        </div>
        {/* -------------------------------- */}

        <div className="mb-6 bg-amber-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Total Pembayaran</p>
            <h2 className="text-2xl font-bold text-orange-600">Rp {totalAmount}</h2>
        </div>

        <div className="space-y-3">
            <button
                onClick={handleSimulasiBayar}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow active:scale-95 disabled:bg-gray-400 transition"
            >
                {loading ? "Memproses..." : "✅ Saya Sudah Bayar"}
            </button>

            <button
                onClick={() => navigate(-1)}
                disabled={loading}
                className="w-full text-gray-500 text-sm hover:underline"
            >
                Batal
            </button>
        </div>
      </div>

    </div>
  );
};

export default QRISPage;