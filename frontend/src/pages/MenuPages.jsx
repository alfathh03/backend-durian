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

  useEffect(() => {
    if (location.state?.cart) setCart(location.state.cart);
    if (location.state?.note) setNote(location.state.note);
  }, [location.state]);

  const categories = ["All", "Durian", "Kopi", "Gula"];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu")
        const data = await res.json();
        setMenu(data.data)
        setLoading(false);
      } catch(error) {
        console.error("Gagal fetching data, error: ", error);
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const handleAddToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleSubtractFromCart = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const filteredMenus = menus.filter(
    (menu) =>
      (activeCategory === "All" || menu.category === activeCategory) &&
      menu.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          onClick={() => navigate("/detail", { state: { cart, note } })}
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
                addToCart={handleAddToCart}
                subtractFromCart={handleSubtractFromCart}
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
                onClick={() => navigate("/home")}
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
