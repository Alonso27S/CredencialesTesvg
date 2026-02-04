import { pool } from "../db.js";

export const getCounts = async (req, res) => {
  try {
    const query = `
      SELECT 
        CASE
          WHEN tipopersona = 'Alumno' THEN 'Alumno'
          WHEN tipopersona = 'Docente' THEN 'Docente'
          WHEN tipopersona ILIKE '%Administrativo%' THEN 'Administrativo'
          ELSE 'Otro'
        END AS tipo_normalizado,
        COUNT(*) AS total
      FROM usuarios
      GROUP BY tipo_normalizado;
    `;

    const result = await pool.query(query);

    const counts = {};

    result.rows.forEach(row => {
      counts[row.tipo_normalizado] = parseInt(row.total);
    });

    res.json(counts);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los totales" });
  }
};

export const getAlumnos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE tipopersona = 'Alumno'"
    );
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener alumnos" });
  }
};

export const getDocentes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE tipopersona = 'Docente'"
    );
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener docentes" });
  }
};

export const getAdministrativos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE tipopersona ILIKE '%Administrativo%'"
    );
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener administrativos" });
  }
};
