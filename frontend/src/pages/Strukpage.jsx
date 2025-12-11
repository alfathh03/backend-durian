import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StrukPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ambil Order ID yang dikirim dari halaman Detail
  const orderId = location.state?.orderId;

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil Data Struk Terbaru dari Backend
  useEffect(() => {
    if (!orderId) return;

    const fetchStruk = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/order/${orderId}`);
        const data = await res.json();
        
        if (data.success) {
          setOrderData(data.data); // Simpan data order & items
        }
      } catch (error) {
        console.error("Gagal ambil struk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStruk();
  }, [orderId]);

  // Kalau tidak ada Order ID (User tembak link langsung)
  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Tidak ada data pesanan. Silakan pesan dari awal.</p>
        <button onClick={() => navigate("/")} className="ml-4 text-blue-500">Kembali</button>
      </div>
    );
  }

  if (loading) return <div className="p-10 text-center">Memuat Struk...</div>;

  return (
    <div className="min-h-screen bg-gray-500/50 flex items-center justify-center p-4">
      {/* KARTU STRUK */}
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header Struk */}
        <div className="bg-orange-500 p-6 text-center text-white">
          <h1 className="text-xl font-bold">Struk Pembayaran</h1>
          <p className="text-sm opacity-90">Cafe MyDurian</p>
        </div>

        {/* Isi Struk */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">Nomor Antrian</p>
            <h2 className="text-4xl font-bold text-orange-500 mt-1">{orderData.id}</h2>
          </div>

          {/* Info Metode Bayar */}
          <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3 mb-6">
            <div className="text-3xl">🛒</div> {/* Ikon Keranjang */}
            <div>
              <p className="font-bold text-gray-800 uppercase">{orderData.payment_method}</p>
              <p className="text-xs text-gray-500">
                {new Date(orderData.updated_at).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* List Menu */}
          <div className="border-t border-gray-200 py-4 space-y-2">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                   {item.menu_name} <span className="text-xs">x {item.quantity}</span>
                </span>
                <span className="font-medium">Rp {item.subtotal}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
            <span className="font-bold text-lg text-orange-500">Total</span>
            <span className="font-bold text-xl text-orange-600">Rp {orderData.total_amount}</span>
          </div>

          {/* Tombol Tutup */}
          <button
            onClick={() => {
                // Bersihkan history supaya user gak bisa 'Back' ke halaman bayar
                navigate("/", { replace: true });
            }}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl active:scale-95 transition"
          >
            Tutup / Pesan Lagi
          </button>

        </div>
      </div>
    </div>
  );
};

export default StrukPage;