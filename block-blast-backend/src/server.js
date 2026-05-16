import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Block Blast backend çalışıyor.",
  });
});

app.use("/api/scores", scoreRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("PostgreSQL bağlantısı başarılı.");

    app.listen(PORT, () => {
      console.log(`Backend ${PORT} portunda çalışıyor.`);
    });
  } catch (error) {
  console.error("PostgreSQL bağlantı hatası:", error);
}
};

startServer();