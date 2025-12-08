import { getAllMenus, addMenus, deleteMenus, updateMenus } from "../services/menuServices.js"; 

// GET menu
export const getMenus = (req, res) => {
    res.json({
        success: true,
        message: "List menu durian",
        data: getAllMenus()
    });
};

// POST menu
export const createMenu = (req, res) => {
    const { name, category, price, image } = req.body;

    if (!name || !category || !price || !image) {
        return res.status(400).json({
            success: false,
            message: "Semua field wajib diisi"
        });
    }

    const newMenu = {
        id: Date.now(),
        name,
        category,
        price,
        image
    };

    const addedMenu = addMenus(newMenu);

    res.status(201).json({
        success: true,
        message: "Menu berhasil ditambahkan",
        data: addedMenu
    });
};

// DELETE menu
export const removeMenu = (req, res) => {
    const { id } = req.params;
    const deletedMenu = deleteMenus(Number(id));

    res.json({
        success: true,
        message: "Menu berhasil dihapus",
        data: deletedMenu
    });
};

// PUT / Edit menu
export const editMenu = (req, res) => {
    const { id } = req.params;
    const updatedMenu = updateMenus(Number(id), req.body);

    if (!updatedMenu) {
        return res.status(404).json({
            success: false,
            message: "Menu tidak ditemukan"
        });
    }

    res.json({
        success: true,
        message: "Menu berhasil diedit",
        data: updatedMenu
    });
};
