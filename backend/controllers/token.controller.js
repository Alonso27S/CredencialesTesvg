// 📦 Conexión a PostgreSQL
import { pool } from "../db.js";

// 🔐 Librería para generar JWT (sesión real del sistema)
import jwt from "jsonwebtoken";

/**
 * CONTROLADOR: verificarToken
 * ---------------------------
 * Se ejecuta después del login cuando el usuario
 * ingresa el token recibido por correo (2FA).
 *
 * Flujo general:
 * 1. Validar datos recibidos
 * 2. Buscar usuario
 * 3. Validar token (existencia, expiración y coincidencia)
 * 4. Generar JWT de sesión
 * 5. Invalidar el token 2FA
 * 6. Obtener datos de credencial
 * 7. Responder al frontend
 */
export const verificarToken = async (req, res) => {
  try {
    /* =========================
       DATOS DEL FRONTEND
    ========================= */
    const { correo, token } = req.body;

    /* =========================
       VALIDACIÓN BÁSICA
    ========================= */
    if (!correo || !token) {
      return res.status(400).json({
        message: "Correo y token requeridos",
      });
    }

    /* =========================
       BUSCAR USUARIO
    ========================= */
    // 🔐 SELECT original (datos del usuario + token 2FA)
    const result = await pool.query(
      `SELECT 
        id, 
        nombre, 
        apellidop,
        apellidom,
        nombrearea,
        numeroidentificador,
        correo, 
        id_rol,
        fotourl,
        firmaurl,
        rfc,
        curp, 
        token_2fa, 
        token_expira 
       FROM usuarios 
       WHERE correo = $1`,
      [correo.trim()]
    );

    // ❌ Usuario inexistente
    if (result.rows.length === 0) {
      console.log("❌ Usuario no encontrado:", correo);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    /* =========================
       LOGS DE DEPURACIÓN
    ========================= */
    console.log("🔹 Usuario encontrado:", user.correo);
    console.log("🔹 Token DB:", user.token_2fa);
    console.log("🔹 Token expiración DB:", user.token_expira);

    /* =========================
       VALIDAR TOKEN ACTIVO
    ========================= */
    // 🛑 No existe token o ya fue usado
    if (!user.token_2fa || !user.token_expira) {
      console.log("❌ No hay token activo para:", correo);
      return res.status(401).json({ message: "No hay token activo" });
    }

    /* =========================
       VALIDAR EXPIRACIÓN
    ========================= */
    const ahora = Date.now(); // tiempo actual
    const expira = new Date(user.token_expira).getTime();

    console.log("⏱ Ahora:", ahora, "Expira:", expira);

    // ⛔ Token vencido o inválido
    if (isNaN(expira) || expira < ahora) {
      console.log("❌ Token expirado para:", correo);
      return res.status(401).json({ message: "Token expirado" });
    }

    /* =========================
       COMPARAR TOKEN
    ========================= */
    // Se convierten a string y se limpian espacios
    // para evitar errores invisibles
    const tokenBD = String(user.token_2fa).trim();
    const tokenRecibido = String(token).trim();

    console.log("🔹 Comparando token DB vs recibido:", tokenBD, tokenRecibido);

    // ❌ Token incorrecto
    if (tokenBD !== tokenRecibido) {
      console.log("❌ Token incorrecto para:", correo);
      return res.status(401).json({ message: "Token incorrecto" });
    }

    /* =========================
       TOKEN CORRECTO
    ========================= */

    /* =========================
       CREAR JWT (SESIÓN REAL)
    ========================= */
    const jwtToken = jwt.sign(
      {
        id: user.id,          // ID del usuario
        correo: user.correo,  // Correo
        rol: user.id_rol,     // Rol del sistema
      },
      process.env.JWT_SECRET, // Clave secreta
      { expiresIn: "1h" }     // Vigencia del JWT
    );

    /* =========================
       INVALIDAR TOKEN 2FA
    ========================= */
    // ⚠️ Evita reutilización del token
    await pool.query(
      "UPDATE usuarios SET token_2fa = NULL, token_expira = NULL WHERE id = $1",
      [user.id]
    );
    console.log("✅ Token eliminado de DB para:", correo);

    /* =========================
       CONSULTA DE CREDENCIAL
    ========================= */
    // 🪪 NO afecta el token, solo obtiene datos visuales
    const credencialResult = await pool.query(
      `SELECT 
         c.fechaemision,
         c.fechavigencia,
         c.qr,
         c.activo
       FROM registro r
       LEFT JOIN credencial c ON c.id_registro = r.id
       WHERE r.id_usuarios = $1
       ORDER BY c.id DESC
       LIMIT 1`,
      [user.id]
    );

    // Si no hay credencial, se devuelve objeto vacío
    const credencial = credencialResult.rows[0] || {};

    /* =========================
       RESPUESTA FINAL
    ========================= */
    return res.json({
      token: jwtToken, // JWT para el frontend

      // 👤 Datos del usuario
      id: user.id,
      nombre: user.nombre,
      apellidop: user.apellidop,
      apellidom: user.apellidom,
      puesto: user.puesto,
      nombrearea: user.nombrearea,
      numeroidentificador: user.numeroidentificador,
      rfc: user.rfc,
      curp: user.curp,
      fotourl: user.fotourl,
      firmaurl: user.firmaurl,
      id_rol: user.id_rol,

      // 🪪 Datos de credencial (si existen)
      fechaemision: credencial.fechaemision || null,
      fechavigencia: credencial.fechavigencia || null,
      qr: credencial.qr || null,
      activo: credencial.activo ?? null,
    });

  } catch (error) {
    console.error("❌ Error verificando token:", error);
    return res.status(500).json({
      message: "Error al verificar token",
    });
  }
};
