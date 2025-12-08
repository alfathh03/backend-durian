import express from "express";
import dotenv from "dotenv";
import cors from "cors";import menuRoutes from "./src/routes/menuRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
import path from "path";

// Static folder untuk gambar
app.use("/uploads", express.static(path.join(path.resolve(), "src/uploads")));

// Register routes
app.use("/api/menu", menuRoutes);

app.use("/", (req, res) => {
    res.json({message: "API CafeMyDurian is Running..."});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di PORT ${PORT}`);
});
