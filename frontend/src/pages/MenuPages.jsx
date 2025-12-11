// pages/MenuPages.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardMenu from "../components/CardMenu";
import Button from "../components/Button";

const MenuPages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [menus, setMenu] = useState([]);

  // --- TAMBAHAN BARU: State untuk menyimpan ID Pesanan dari database ---
  const [orderId, setOrderId] = useState(null); 

  useEffect(() => {
    if (location.state?.cart) setCart(location.state.cart);
    if (location.state?.note) setNote(location.state.note);
    // Jika kembali dari halaman detail, mungkin kita perlu bawa orderId juga (opsional nanti)
  }, [location.state]);

  const categories = ["All", "Durian", "Kopi", "Gula"];

  // 1. FETCH DATA MENU (Sudah benar)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu");
        const data = await res.json();
        
        // Pengecekan agar tidak error jika format beda
        const menuArray = data.data || data; 
        setMenu(Array.isArray(menuArray) ? menuArray : []);
        
        setLoading(false);
      } catch (error) {
        console.error("Gagal fetching data, error: ", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // --- FUNGSI SINKRONISASI KE BACKEND ---
  const syncToDatabase = async (menuId, newQuantity, currentOrderId) => {
    try {
        const res = await fetch("http://localhost:5000/api/order/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                menu_id: menuId,
                quantity: newQuantity, 
                order_id: currentOrderId // Kirim ID order yang sedang aktif
            })
        });
        const data = await res.json();
        if(data.success) {
            console.log("Database Updated! Order ID:", data.order_id);
            return data.order_id; // Kembalikan ID baru jika ada
        }
    } catch(err) {
        console.error("Gagal simpan ke DB:", err);
    }
    return currentOrderId;
  };

  // 2. LOGIKA TAMBAH (Dimodifikasi: Update UI + Update DB)
  const handleAddToCart = async (product) => {
    let newQuantity = 1;

    // A. Update Tampilan Dulu (Biar aplikasi terasa cepat/nggak lemot)
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      newQuantity = existing.quantity + 1;
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // B. Kirim Data ke Backend (Di belakang layar)
    const updatedOrderId = await syncToDatabase(product.id, newQuantity, orderId);
    if (updatedOrderId) setOrderId(updatedOrderId);
  };

  // 3. LOGIKA KURANG (Dimodifikasi: Update UI + Update DB)
  const handleSubtractFromCart = async (id) => {
    const existing = cart.find((item) => item.id === id);
    if (!existing) return;

    const newQuantity = existing.quantity - 1;

    // A. Update UI
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );

    // B. Update DB
    // Catatan: Jika quantity 0, idealnya kita panggil API delete. 
    // Tapi untuk sekarang update ke 0 pun tidak masalah (tergantung backend).
    if (newQuantity >= 0) {
        await syncToDatabase(id, newQuantity, orderId);
    }
  };

  const filteredMenus = menus.filter(
    (menu) =>
      (activeCategory === "All" || menu.category === activeCategory) &&
      (menu.name || menu.nama_menu || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">

      {/* Search + Cart */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Cari menu..."
          className="flex-1 p-3 rounded-xl border border-amber-300 shadow-sm focus:ring-2 focus:ring-amber-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          className="relative ml-2 p-3 bg-amber-500 text-white rounded-full shadow active:scale-95"
          // Saat pindah ke detail, kita bawa orderId juga
          onClick={() => navigate("/detail", { state: { cart, note, orderId } })}
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-amber-500 text-white shadow"
                : "bg-white border border-amber-300 text-amber-700"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3 pb-28">
        {loading
          ? Array(10)
              .fill(0)
              .map((_, i) => <CardMenu key={i} loading cart={[]} />)
          : filteredMenus.map((item) => (
              <CardMenu
                key={item.id}
                {...item}
                // Pastikan CardMenu menggunakan props ini dengan benar
                addToCart={() => handleAddToCart(item)}
                subtractFromCart={() => handleSubtractFromCart(item.id)}
                cart={cart}
              />
            ))}
      </div>

      {/* Button Back */}
      <Button
        color="orange"
        text="Kembali ke awal"
        onClick={() => setShowConfirm(true)}
      />

      {/* Popup */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-80 p-5 rounded-xl shadow-lg text-center">

            <p className="text-gray-800 mb-4 font-medium">
              Jika anda kembali ke halaman utama, semua pesanan akan hilang.
              <br /> Ingin lanjut?
            </p>

            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-orange-400 rounded-lg text-gray-800 font-semibold active:scale-95"
                onClick={() => setShowConfirm(false)}
              >
                Batal
              </button>

              <button
                className="px-4 py-2 bg-yellow-500 rounded-lg text-white font-semibold active:scale-95"
                onClick={() => navigate("/")} 
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuPages;