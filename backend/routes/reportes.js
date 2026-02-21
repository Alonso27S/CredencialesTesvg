// routes/reportes.js
import express from "express";
import pool from "../db.js"; // tu conexión a postgres

const router = express.Router();

// GET /api/reportes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios"); // consulta sencilla
    res.json(result.rows);
  } catch (error) {
    console.error("Error en consulta:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;