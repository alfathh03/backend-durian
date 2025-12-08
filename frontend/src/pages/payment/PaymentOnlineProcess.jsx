import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentOnlineProcess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const method = state?.method;
  const cart = state?.cart || [];
  const note = state?.note || "";

  const [status, setStatus] = useState("pending");

  const labels = {
    gopay: "GoPay",
    dana: "Dana",
    ovo: "OVO",
    shopeepay: "ShopeePay",
    bca: "BCA Mobile",
    bri: "BRImo",
    qris: "QRIS Resmi",
  };

  const logo = {
    gopay:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/GoPay_logo.svg/512px-GoPay_logo.svg.png",
    dana: "https://seeklogo.com/images/D/dana-logo-473B90C876-seeklogo.com.png",
    ovo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Logo_ovo_purple.svg/512px-Logo_ovo_purple.svg.png",
    shopeepay:
      "https://seeklogo.com/images/S/shopee-pay-logo-7A603F1D88-seeklogo.com.png",

    bca: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/BCA_logo.svg/512px-BCA_logo.svg.png",
    bri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/BRI_logo.svg/512px-BRI_logo.svg.png",

    // LOGO QRIS RESMI (PNG TRANSPARENT)
    qris: "https://upload.wikimedia.org/wikipedia/commons/0/0a/QRIS_logo.svg",
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // SIMULASI PEMBAYARAN
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("success");
      navigate("/payment-online-success", {
        state: { cart, note, method, totalPrice },
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <div className="bg-white p-5 w-80 rounded-xl shadow text-center">
        <h3 className="text-lg font-bold">Memproses Pembayaran...</h3>

        <p className="text-amber-700 mt-2">
          Metode: <b>{labels[method]}</b>
        </p>

        {/* LOGO METODE */}
        <img
          src={logo[method]}
          className="w-20 h-20 object-contain mx-auto mt-3"
          alt="payment-logo"
        />

        {/* KHUSUS QRIS → tampilkan QR CODE resmi */}
        {method === "qris" && (
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=QRIS-DUMMY"
            className="mx-auto mt-4 rounded-lg border"
            alt="QRIS QR Code"
          />
        )}

        <p className="mt-4 text-sm text-gray-600">Mohon tunggu sebentar...</p>

        {/* LOADING SPINNER */}
        <div className="mt-4 animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default PaymentOnlineProcess;
