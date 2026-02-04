// controllers/qr.controller.js
import { decryptQRData } from "../utils/cryptoUtils.js";
import { pool } from "../db.js";

export const verificarQR = async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: "Datos QR no proporcionados"
      });
    }
    
    // 1️⃣ Desencriptar datos del QR
    const datosDesencriptados = decryptQRData(qrData);
    
    // 2️⃣ Verificar en la base de datos (opcional)
    const query = await pool.query(
      `SELECT u.*, c.* 
       FROM usuarios u
       JOIN registro r ON u.id = r.id_usuario
       JOIN credencial c ON r.id = c.id_registro
       WHERE u.numeroidentificador = $1
       AND c.qr = $2
       AND c.activo = true`,
      [datosDesencriptados.numeroControl, qrData]
    );
    
    if (query.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Credencial no válida o inactiva"
      });
    }
    
    // 3️⃣ Devolver datos verificados
    res.json({
      success: true,
      datos: datosDesencriptados,
      usuario: query.rows[0],
      fechaVerificacion: new Date()
    });
    
  } catch (error) {
    console.error("❌ Error al verificar QR:", error);
    
    if (error.message.includes("bad decrypt")) {
      return res.status(400).json({
        success: false,
        message: "QR inválido o manipulado"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error al verificar QR",
      error: error.message
    });
  }
};