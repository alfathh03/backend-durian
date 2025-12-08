import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReceiptPopup from "../../components/ReceiptPopup";

const PaymentCODPages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];
  const note = location.state?.note || "";
  const [queueNumber, setQueueNumber] = useState(null);
  const [orderStatus, setOrderStatus] = useState("pending");

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Nomor antrian
  useEffect(() => {
    let lastQueue = localStorage.getItem("queueNumber");
    lastQueue = lastQueue ? parseInt(lastQueue) : 0;

    const nextQueue = lastQueue + 1;

    localStorage.setItem("queueNumber", nextQueue);
    setQueueNumber(nextQueue);
  }, []);

  // Dummy polling
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Cek status pesanan...");

      if (autoFinish) setOrderStatus("selesai");
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orderStatus === "selesai") {
      navigate("/payment-success", { state: { queueNumber } });
    }
  }, [orderStatus, navigate, queueNumber]);

  return (
    <div className="min-h-screen bg-amber-50 p-4">
      {/* Popup Struk */}
      <ReceiptPopup
        cart={cart}
        totalPrice={totalPrice}
        note={note}
        queueNumber={queueNumber}
        method="cod"
        onClose={() => navigate("/")}
      />
    </div>
  );
};

export default PaymentCODPages;
