/* file ini hanya untuk testing data menu sebelum menggunakan data menu dari database */

const BASE_URL = "http://localhost:5000";

let menus = [
  { id: 1, name: "Durian Montong", price: 50000, category: "Durian", image: `${BASE_URL}/uploads/durian-medan.jpg` },
  { id: 2, name: "Durian Medan", price: 40000, category: "Durian", image: `${BASE_URL}/uploads/durian-medan.jpg` },
  { id: 3, name: "Pancake Durian", price: 30000, category: "Durian", image: `${BASE_URL}/uploads/durian-medan.jpg` },
  { id: 4, name: "Robusta Dampit 1kg", price: 120000, category: "Kopi", image: `${BASE_URL}/uploads/durian-medan.jpg` },
  { id: 5, name: "Gula Aren 1L", price: 25000, category: "Gula", image: `${BASE_URL}/uploads/durian-medan.jpg` }
];

export const getAllMenus = () => menus;

export const addMenus = (newMenu) => {
    menus.push(newMenu);
    return newMenu;
}

export const deleteMenus = (id) => {
    menus = menus.filter((menu) => menu.id !== id)
    return menus
}

export const updateMenus = (id, update) => {
    menus = menus.map((menu) =>
        menu.id === id ? { ...menu, ...update } : menu
    );
    return menus.find((menu) => menu.id === id);
}


