import express from "express";
import { getMenus, createMenu, removeMenu, editMenu } from "../controllers/menuControllers.js";

const router = express.Router();

router.get("/", getMenus);
router.post("/", createMenu);
router.delete("/:id", removeMenu);
router.put("/:id", editMenu);

export default router;