import { useState, useEffect } from "react";

export default function MenuPage() {

  // 1. tempat state disimpan
  const [menu, setMenu] = useState([]);

  // 2. tempat fetch API dijalankan
  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then(response => response.json())
      .then(data => setMenu(data))
      .catch(err => console.log("Fetch error:", err));
  }, []);

  // 3. tampilkan ke UI
  return (
    <div>
      <h1>Daftar Menu</h1>

      {menu.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Rp{item.price}</p>
        </div>
      ))}
    </div>
  );
}
