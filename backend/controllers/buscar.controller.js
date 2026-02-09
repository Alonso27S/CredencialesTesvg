// Importa el pool de conexión a PostgreSQL
import { pool } from "../db.js";

// Controlador para buscar usuarios con filtros dinámicos
export const buscarUsuario = async (req, res) => {
  try {
    // Se extraen los posibles filtros enviados por query params
    const { numeroidentificador} = req.query;

    // Consulta base
    // WHERE 1=1 se usa para poder concatenar filtros fácilmente con AND
    let baseQuery = `
      SELECT 
        u.id, 
        u.nombre, 
        u.apellidop, 
        u.apellidom, 
        u.tipopersona, 
        u.nombrearea, 
        c.fechavigencia,
        (DATE(c.fechavigencia) < CURRENT_DATE) AS vencida
      FROM usuarios u
      LEFT JOIN registro r ON r.id_usuarios = u.id
      LEFT JOIN LATERAL (
          SELECT fechavigencia
          FROM credencial
          WHERE id_registro = r.id
          ORDER BY id DESC
          LIMIT 1
    ) c ON true
     WHERE 1=1
`;

    // Arreglo que almacenará los valores de los filtros
    const values = [];

    // Contador para los parámetros dinámicos ($1, $2, $3...)
    let contador = 1;

    // Buscar por número identificador (Número de Control o Matrícula)
    if (numeroidentificador) {
      baseQuery += ` AND numeroidentificador = $${contador}`;
      values.push(numeroidentificador);
      contador++;
    }

    const result = await pool.query(baseQuery, values);

    res.json(result.rows);

  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }

};
export const renovarCredencial = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`
      UPDATE credencial
      SET fechavigencia = CURRENT_TIMESTAMP + INTERVAL '6 months',
          fechaemision = CURRENT_TIMESTAMP,
          activo = TRUE
      WHERE id_registro = (
        SELECT r.id
        FROM registro r
        WHERE r.id_usuarios = $1
        ORDER BY r.id DESC
        LIMIT 1
      )
    `, [id]);

    res.json({ message: "Credencial renovada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al renovar credencial" });
  }
};


