import XLSX from "xlsx";
import { pool } from "../db.js";

export const importarExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió archivo" });
    }

    const workbook = XLSX.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    let insertados = 0;
    let ignorados = 0;

    for (const fila of data) {
      const result = await pool.query(
        `INSERT INTO importacion_estudiantes
        (nombre, apellido_paterno, apellido_materno, numero_control, rfc, curp, carrera, correo)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (curp) DO NOTHING`,
        [
          fila.nombre,
          fila.apellido_paterno,
          fila.apellido_materno,
          fila.numero_control,
          fila.rfc,
          fila.curp,
          fila.carrera,
          fila.correo,
        ]
      );

      // Si insertó, rowCount = 1; si fue duplicado, = 0
      if (result.rowCount === 1) {
        insertados++;
      } else {
        ignorados++;
      }
    }

    // 🔥 RESPUESTA FINAL (FUERA DEL FOR)
    res.json({
      ok: true,
      message: "Importación finalizada",
      insertados,
      ignorados,
      total: data.length,
    });

  } catch (error) {
    console.error("Error importar:", error.message);
    res.status(500).json({ error: error.message });
  }
};
