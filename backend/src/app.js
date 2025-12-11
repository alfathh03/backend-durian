import { BrowserRouter, Routes, Route } from "react-router-dom";

// ... Import halaman lain ...
import MenuPages from "./pages/MenuPages";
import DetailPage from "./pages/DetailPage";
import StrukPage from "./pages/StrukPage"; // <--- IMPORT INI

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MenuPages />} />
        
        {/* ... route lainnya ... */}
        
        <Route path="/detail" element={<DetailPage />} />
        
        {/* TAMBAHKAN ROUTE INI */}
        <Route path="/struk" element={<StrukPage />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default App;