import { pool } from "../db.js";

/**
 * OBTENER USUARIO POR ID
 */

export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        id,
        nombre,
        apellidop,
        apellidom,
        tipoidentificador,
        numeroidentificador,
        rfc,
        curp,
        fotourl,
        firmaurl,
        puesto,
        tipopersona,
        nombrearea,
        correo,
        numerosegurosocial AS nss,
        esusuarioinicial
      FROM usuarios
      WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(" Error SQL en getUsuarioById:", error.message);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};


/**
 * COMPLETAR PERFIL (SOLO CAMPOS ENVIADOS)
 */
export const completarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const columnas = Object.keys(datos)
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(", ");

    const valores = Object.values(datos);

    await pool.query(
      `UPDATE usuarios SET ${columnas} WHERE id = $${valores.length + 1}`,
      [...valores, id]
    );

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (error) {
    console.error(" Error SQL en completarPerfil:", error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};
