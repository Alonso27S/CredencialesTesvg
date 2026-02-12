import { pool } from "../db.js";

/* ======================================
   🔹 OBTENER GESTORES (ROL 1 Y 2)
   ====================================== */
export const getGestores = async (req, res) => {
  try {
    const { nombre = "" } = req.query;

    const result = await pool.query(
      `
      SELECT 
        id,
        CONCAT(nombre, ' ', apellidop, ' ', apellidom) AS nombre,
        puesto,
        id_rol,
        creado_en
      FROM usuarios
      WHERE id_rol IN (1, 2)
        AND CONCAT(nombre, ' ', apellidop, ' ', apellidom) ILIKE $1
      ORDER BY creado_en DESC
      `,
      [`%${nombre}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(" Error al obtener gestores:", error);
    res.status(500).json([]);
  }
};

/* ======================================
   🔹 EDITAR ROL (ADMIN ⇄ GESTOR)
   ====================================== */
export const updateRolGestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_rol } = req.body;

    // 🔒 Validar roles permitidos
    if (![1, 2].includes(id_rol)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Rol inválido",
      });
    }

    const result = await pool.query(
      `
      UPDATE usuarios
      SET id_rol = $1
      WHERE id = $2 AND id_rol IN (1, 2)
      `,
      [id_rol, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Gestor no encontrado",
      });
    }

    res.json({
      ok: true,
      mensaje: "Rol actualizado correctamente",
    });

  } catch (error) {
    console.error(" Error al actualizar rol:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar rol",
    });
  }
};

/* ======================================
   🔹 ELIMINAR GESTOR (SOLO ADMIN)
   ====================================== */
export const deleteGestor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 AND id_rol IN (1, 2)",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Gestor no encontrado",
      });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error(" Error al eliminar gestor:", error);
    res.status(500).json({ message: "Error al eliminar gestor" });
  }
};
