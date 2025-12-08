import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import Button from "../components/Button";

const DetailPages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [note, setNote] = useState(location.state?.note || "");
  const cart = location.state?.cart || [];

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-amber-50 p-4 flex flex-col">
      
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-center text-amber-700 mb-6">
        Detail Pesanan
      </h1>

      {/* CART EMPTY */}
      {cart.length === 0 ? (
        <p className="text-center text-amber-600 text-base">
          Keranjang masih kosong
        </p>
      ) : (
        <>
          {/* LIST PRODUK */}
          <div className="mb-5 space-y-3 overflow-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-md border border-amber-200 flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <h2 className="text-gray-900 font-semibold text-base">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>

                <p className="text-gray-900 font-semibold text-base">
                  Rp{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* CATATAN & TOTAL */}
          <div className="bg-white p-4 rounded-2xl shadow-md border border-amber-200 mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-gray-700 font-medium text-base">Total</span>
              <span className="text-amber-700 font-bold text-base">
                Rp{totalPrice}
              </span>
            </div>

            <textarea
              className="w-full p-3 mt-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              placeholder="Tambahkan catatan untuk pesanan..."
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* PAYMENT BUTTONS */}
          <div className="flex flex-col gap-4">
            <Button
              color="orange"
              text="Bayar Ditempat"
              icon={<FaMoneyBillWave />}
              onClick={() =>
                navigate("/payment-cod", {
                  state: { cart, note },
                })
              }
            />

            <Button
              color="yellow"
              text="Bayar Online"
              icon={<FaCreditCard />}
              onClick={() =>
                navigate("/payment-online", {
                  state: { cart, note },
                })
              }
            />

            <button
              onClick={() => navigate("/menu", { state: { cart, note } })}
              className="mt-2 text-sm text-amber-700 hover:underline self-center"
            >
              ← Kembali ke Menu
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPages;
