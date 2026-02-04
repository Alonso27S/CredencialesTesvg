import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET
 * http://localhost:5000/api/importacion
 *  Lista todos los importados
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM importacion_estudiantes ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error obtener importados:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

/**
 * GET
 * http://localhost:5000/api/importacion/:id
 * 👉 Obtener un registro para enviarlo a Registro
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM importacion_estudiantes WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error obtener importado:", error);
    res.status(500).json({ error: "Error" });
  }
});

export default router;
