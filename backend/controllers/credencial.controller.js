// controllers/credencial.controller.js

// Módulo nativo de Node para generar hashes criptográficos
import crypto from "crypto";
import { pool } from "../db.js";
// Función personalizada para encriptar los datos del QR
import { encryptQRData } from "../utils/cryptoUtils.js";

/**
 * FUNCIÓN: crearCredencial
 * -----------------------
 * Crea una credencial digital con:
 * - Datos del usuario
 * - QR encriptado
 * - Hash de verificación
 *
 * Se ejecuta normalmente dentro de una transacción
 * usando el mismo `client` de PostgreSQL.
 *
 * @param {object} client        Cliente de PostgreSQL (transacción activa)
 * @param {number} idRegistro    ID del registro asociado al usuario
 * @param {object} datosUsuario  Datos básicos del usuario
 */
export const crearCredencial = async (client, idRegistro, datosUsuario) => {
  try {
    /* =========================
       1️ OBTENER DATOS DEL USUARIO
    ========================= */
    // Se extraen únicamente los datos necesarios
    const {
      nombre,
      apellidop,
      apellidom,
      numeroidentificador,
    } = datosUsuario;

    /* =========================
       2️ DATOS A ENCRIPTAR EN QR
    ========================= */
    // Objeto que contendrá la información del QR
    // El timestamp evita que se generen QRs duplicados
    const datosQR = {
      nombre,
      apellidoPaterno: apellidop,
      apellidoMaterno: apellidom,
      numeroControl: numeroidentificador,
      timestamp: Date.now(),
    };

    /* =========================
       3️ ENCRIPTAR DATOS DEL QR
    ========================= */
    // Se encripta el objeto completo para que el QR
    // no muestre información legible directamente
    const qrEncriptado = encryptQRData(datosQR);

    /* =========================
       4️ INSERTAR CREDENCIAL
    ========================= */
    // Se guarda el QR encriptado junto con el registro
    // fechaemision se genera automáticamente en la BD
    const result = await client.query(
      `
      INSERT INTO credencial (qr, id_registro, fechaemision, fechavigencia, activo)
      VALUES ($1, $2, NOW(), NOW() + INTERVAL '6months', true)
      RETURNING id
      `,
      [qrEncriptado, idRegistro]
    );

    /* =========================
       5️ HASH DE VERIFICACIÓN
    ========================= */
    // Se genera un hash SHA-256 de los datos originales
    // Esto sirve para validar integridad o detectar alteraciones
    const hashVerificacion = crypto
      .createHash("sha256")
      .update(JSON.stringify(datosQR))
      .digest("hex");

    /* =========================
       6️ GUARDAR HASH (OPCIONAL)
    ========================= */
    // Solo aplica si tu tabla credencial tiene la columna
    // `hash_verificacion`
    await client.query(
      `UPDATE credencial SET hash_verificacion = $1 WHERE id = $2`,
      [hashVerificacion, result.rows[0].id]
    );

    /* =========================
       7️ RESPUESTA
    ========================= */
    // Se devuelven datos útiles para el flujo principal
    return {
      idCredencial: result.rows[0].id,
      qrEncriptado,
      datosOriginales: datosQR,
    };

  } catch (error) {
    // Error general al crear la credencial
    console.error("Error al crear credencial:", error);
    throw error; // Se relanza para que la transacción haga rollback
  }
};
// FUNCION PARA RENOVAR CREDENCIAL

export const renovarCredencial = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`
      UPDATE credencial
      SET 
      fechavigencia = CURRENT_TIMESTAMP + INTERVAL '6 months',
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

    res.json ({ message: "credencial renovada correctamente"});

  } catch (error) {
    res.status(500).json({message:"Error al renovar credencial"});

  }
};

// FUNCION PARA ACTIVAR/INACTIVAR CREDENCIAL
export const cambiarEstadoCredencial = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    //  Verificar usuario y rol
    const verificacion = await client.query(`
      SELECT id_rol 
      FROM usuarios 
      WHERE id = $1
    `, [id]);

    if (verificacion.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (verificacion.rows[0].id_rol !== 3) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Solo se puede cambiar estado a usuarios" });
    }

    //  Cambiar estado en credencial
    await client.query(`
      UPDATE credencial
      SET activo = NOT activo
      WHERE id_registro = (
        SELECT r.id
        FROM registro r
        WHERE r.id_usuarios = $1
        ORDER BY r.id DESC
        LIMIT 1
      )
    `, [id]);

    //  Cambiar estado en usuarios
    await client.query(`
      UPDATE usuarios
      SET activo = NOT activo
      WHERE id = $1
    `, [id]);

    await client.query("COMMIT");

    res.json({ message: "Estado del usuario actualizado correctamente" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Error al cambiar estado" });
  } finally {
    client.release();
  }
};


    
