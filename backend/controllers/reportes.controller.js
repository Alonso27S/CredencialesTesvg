import { pool } from "../db.js";

export const getReportes = async (req, res) => {
  try {
    const { tipoPersonal, area, estado, fechaInicio, fechaFin } = req.query;

    let query = `
      SELECT 
        u.id,
        CONCAT(u.nombre, ' ', u.apellidop, ' ', u.apellidom) AS nombre_completo,
        u.area,
        u.estado,
        to_char(r.fecharegistro, 'DD/MM/YYYY') AS fecha,
        to_char(r.fecharegistro, 'HH24:MI') AS hora
      FROM usuarios u
      LEFT JOIN registro r ON u.id = r.id_usuarios
      WHERE 1=1
    `;

    const params = [];

    if (tipoPersonal) {
      params.push(tipoPersonal);
      query += ` AND u.tipo = $${params.length}`;
    }

    if (area) {
      params.push(area);
      query += ` AND u.area = $${params.length}`;
    }

    if (estado) {
      params.push(estado);
      query += ` AND u.estado = $${params.length}`;
    }

    if (fechaInicio && fechaFin) {
      params.push(fechaInicio, fechaFin);
      query += ` AND r.fecharegistro BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    query += ` ORDER BY r.fecharegistro DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);

  } catch (error) {
    console.error("❌ Error en getReportes:", error);
    res.status(500).json({ message: "Error al generar los reportes" });
  }
};
