// Importa el pool de conexión a PostgreSQL
import { pool } from "../db.js";

// Controlador para buscar usuarios con filtros dinámicos
export const buscarUsuario = async (req, res) => {
  try {
    // Se extraen los posibles filtros enviados por query params
    const { numeroidentificador, tipo, nombrearea, creado_en } = req.query;

    // Consulta base
    // WHERE 1=1 se usa para poder concatenar filtros fácilmente con AND
    let baseQuery = `
      SELECT 
        id, 
        nombre, 
        apellidop, 
        apellidom, 
        tipopersona, 
        nombrearea, 
        creado_en,
        tipoidentificador, 
        numeroidentificador
      FROM usuarios
      WHERE 1=1
    `;

    // Arreglo que almacenará los valores de los filtros
    const values = [];

    // Contador para los parámetros dinámicos ($1, $2, $3...)
    let contador = 1;

    // 🔍 Buscar por número identificador (Número de Control o Matrícula)
    if (numeroidentificador) {
      baseQuery += ` AND numeroidentificador = $${contador}`;
      values.push(numeroidentificador);
      contador++;
    }

    // 🔍 Filtrar por tipo de identificador ("control", "matricula", etc.)
    if (tipo) {
      baseQuery += ` AND tipoidentificador = $${contador}`;
      values.push(tipo);
      contador++;
    }

    // 🔍 Filtrar por área (carrera, departamento, etc.)
    if (nombrearea) {
      baseQuery += ` AND nombrearea = $${contador}`;
      values.push(nombrearea);
      contador++;
    }

    // 🔍 Filtrar por fecha de creación (solo compara la fecha, no la hora)
    if (creado_en) {
      baseQuery += ` AND DATE(creado_en) = $${contador}`;
      values.push(creado_en);
      contador++;
    }

    // Ejecuta la consulta con los filtros construidos dinámicamente
    const result = await pool.query(baseQuery, values);

    // Devuelve los usuarios encontrados
    res.json(result.rows);

  } catch (error) {
    // Manejo de errores del servidor
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
