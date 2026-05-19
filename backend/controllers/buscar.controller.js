// Importa el pool de conexión a PostgreSQL
import { pool } from "../db.js";

// Controlador para buscar usuarios con filtros dinámicos
export const buscarUsuario = async (req, res) => {
  try {
    // Se extraen los posibles filtros enviados por query params
    const { busqueda } = req.query;

    // Consulta base
    // WHERE 1=1 se usa para poder concatenar filtros fácilmente con AND
    let baseQuery = `
      SELECT 
        u.id, 
        u.nombre, 
        u.apellidop, 
        u.apellidom, 
        u.correo,
        u.numeroidentificador,
        u.tipopersona, 
        u.nombrearea, 
        c.fechavigencia,
        C.activo,
        (DATE(c.fechavigencia) < CURRENT_DATE) AS vencida
      FROM usuarios u
      LEFT JOIN registro r ON r.id_usuarios = u.id
      LEFT JOIN LATERAL (
          SELECT fechavigencia, activo
          FROM credencial
          WHERE id_registro = r.id
          ORDER BY id DESC
          LIMIT 1
    ) c ON true
     WHERE u.id_rol = 3
`;

    // Arreglo que almacenará los valores de los filtros
    const values = [];

    // Contador para los parámetros dinámicos ($1, $2, $3...)
    let contador = 1;

    // Buscar por número identificador (Número de Control o Matrícula)
    if (busqueda) {
      baseQuery += ` 
      AND numeroidentificador ILIKE $${contador}
      OR u.nombre ILIKE $${contador}
      OR u.apellidop ILIKE $${contador}
      OR u.apellidom ILIKE $${contador}
      OR CONCAT(
                u.nombre,' ',
                u.apellidop,' ',
                u.apellidom
             ) ILIKE $${contador}
      OR u.correoelectronico ILIKE $${contador}
    )
    `;
     values.push(`%${busqueda}%`);
      contador++;
    }

    baseQuery += ` ORDER BY u.nombre ASC`;
    

    const result = await pool.query(baseQuery, values);

    res.json(result.rows);

  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }

};