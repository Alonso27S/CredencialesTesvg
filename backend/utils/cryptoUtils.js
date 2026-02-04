// utils/cryptoUtils.js
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ALGORITHM = "aes-256-gcm";

// ⚠ Usa una contraseña, NO una key directa
const SECRET = process.env.QR_ENCRYPTION_KEY || "clave-por-defecto-segura";

// 🔐 Derivar clave de 32 BYTES exactos
const KEY = crypto
  .createHash("sha256")
  .update(SECRET)
  .digest(); // 32 bytes

export const encryptQRData = (data) => {
  try {
    const texto = JSON.stringify(data);

    const iv = crypto.randomBytes(12); // recomendado para GCM

    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    const encrypted = Buffer.concat([
      cipher.update(texto, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString("base64");
  } catch (error) {
    console.error("❌ Error al encriptar datos QR:", error);
    throw error;
  }
};

export const decryptQRData = (encryptedData) => {
  try {
    const buffer = Buffer.from(encryptedData, "base64");

    const iv = buffer.slice(0, 12);
    const authTag = buffer.slice(12, 28);
    const encryptedText = buffer.slice(28);

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString("utf8"));
  } catch (error) {
    console.error("❌ Error al desencriptar datos QR:", error);
    throw error;
  }
};