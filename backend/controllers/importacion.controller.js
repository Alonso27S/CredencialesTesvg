import { pool } from "../db.js";

export const obtenerImportados = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM importacion_estudiantes WHERE estado = 'pendiente' ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener datos" });
  }
};

export const eliminarImportado = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM importacion_estudiantes WHERE id=$1", [id]);
  res.json({ ok: true });
};
