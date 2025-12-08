import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/HomePages.jsx";
import MenuPages from "./pages/MenuPages.jsx";
import DetailPages from "./pages/DetailPages.jsx";
import PaymentCODPages from "./pages/payment/PaymentCODPages.jsx";
import PaymentOnlinePages from "./pages/payment/PaymentMethodPages.jsx";
import PaymentOnlineProcess from "./pages/payment/PaymentOnlineProcess.jsx";
import PaymentOnlineSuccess from "./pages/payment/PaymentOnlineSucces.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<MenuPages />} />
        <Route path="/detail" element={<DetailPages />} />
        <Route path="/payment-cod" element={<PaymentCODPages />} />
        <Route path="/payment-online" element={<PaymentOnlinePages />} />
        <Route path="/payment-online-process" element={<PaymentOnlineProcess />} />
        <Route path="/payment-online-success" element={<PaymentOnlineSuccess />} />
      </Routes>
    </BrowserRouter>
);
