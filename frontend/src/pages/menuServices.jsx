import { useEffect, useState } from "react";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenu(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading menu...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Menu</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {menu.map((item) => (
          <div
            key={item.id}
            style={{
              width: "200px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <h3>{item.name}</h3>
            <p>Kategori: {item.category}</p>
            <p>Harga: Rp {item.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
