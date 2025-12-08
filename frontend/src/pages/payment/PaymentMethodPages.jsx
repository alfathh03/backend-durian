import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentMethodPages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];
  const note = location.state?.note || "";
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const categories = [
    {
      id: "ewallet",
      label: "E-Wallet",
      color: "bg-white border",
      items: [
        {
          id: "dana",
          label: "Dana",
          logo: "https://seeklogo.com/images/D/dana-logo-473B90C876-seeklogo.com.png",
        },
        {
          id: "ovo",
          label: "OVO",
          logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Logo_ovo_purple.svg",
        },
        {
          id: "gopay",
          label: "GoPay",
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/GoPay_logo.svg",
        },
        {
          id: "shopeepay",
          label: "ShopeePay",
          logo: "https://seeklogo.com/images/S/shopee-pay-logo-7A603F1D88-seeklogo.com.png",
        },
      ],
    },

    {
      id: "bank",
      label: "Bank Transfer (Mobile Banking)",
      color: "bg-white border",
      items: [
        {
          id: "bca",
          label: "BCA Mobile",
          logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/BCA_logo.svg",
        },
        {
          id: "bri",
          label: "BRImo",
          logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/BRI_logo.svg",
        },
      ],
    },

    {
      id: "qris",
      label: "QRIS",
      color: "bg-white border",
      items: [
        {
          id: "qris",
          label: "QRIS",
          // LOGO QRIS RESMI
          logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/QRIS_logo.png",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <h2 className="text-xl font-bold text-amber-700 mb-4 text-center">
        Pilih Metode Pembayaran
      </h2>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow border">
            
            {/* HEADER CATEGORY */}
            <button
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex justify-between items-center p-4"
            >
              <span className="font-semibold text-gray-800 text-lg">
                {cat.label}
              </span>

              {/* ARROW ICON */}
              {openCategory === cat.id ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-700 rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {/* LIST ITEMS */}
            {openCategory === cat.id && (
              <div className="grid grid-cols-2 gap-4 p-4 border-t">
                {cat.items.map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      navigate("/payment-online-process", {
                        state: { method: m.id, cart, note },
                      })
                    }
                    className={`${cat.color} p-4 rounded-xl shadow active:scale-95 flex flex-col items-center`}
                  >
                    <img
                      src={m.logo}
                      alt={m.label}
                      className="w-14 h-14 object-contain mb-2"
                    />
                    <span className="font-semibold text-gray-700 text-sm">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/detail-pesanan", {state:{cart, note}})} className="">← Kembali ke Detail Pesanan</button>
    </div>
  );
};

export default PaymentMethodPages;
