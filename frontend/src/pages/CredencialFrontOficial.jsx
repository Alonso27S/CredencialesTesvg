import React, { useEffect, useState, useMemo } from "react";
import QRCode from "qrcode";

/**
 * CredencialFront
 * ----------------------------------------------------
 * Componente que renderiza el frente de la credencial.
 * - Layout blindado contra textos largos
 * - QR estable
 * - Responsive
 * - No se montan elementos
 */
const CredencialFront = ({ datos }) => {
  /* ================= CONSTANTES DE DISEÑO ================= */
  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 420;
  const BAR_HEIGHT = 44;

  /* ================= ESTADO ================= */
  const [qrImage, setQrImage] = useState(null);

  /* ================= FOTO ================= */
  const fotoReal = datos?.fotourl
    ? datos.fotourl.startsWith("http")
      ? datos.fotourl
      : `https://credencialestesvg.com.mx${datos.fotourl}`
    : "/assets/default_user.png";

  /* ================= NOMBRE COMPLETO ================= */
  const nombreCompleto = `${datos?.nombre || ""} ${datos?.apellidop || ""} ${datos?.apellidom || ""}`.trim();

  /* ================= TAMAÑO DINÁMICO DEL QR ================= */
  const qrSize = useMemo(() => {
    if (nombreCompleto.length > 40) return 80;
    if (nombreCompleto.length > 30) return 90;
    return 96;
  }, [nombreCompleto]);

  /* ================= GENERAR QR ================= */
  useEffect(() => {
    if (!datos?.qr) return;

    QRCode.toDataURL(datos.qr, { width: 160, margin: 1 })
      .then(setQrImage)
      .catch((err) => console.error("Error generando QR:", err));
  }, [datos]);

  return (
    <div
      className="relative bg-[#d6b99c] rounded-xl shadow-xl border border-gray-300
                 overflow-hidden flex flex-col"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {/* ================= LOGOS SUPERIORES ================= */}
      <div className="flex justify-between items-center px-3 pt-3 z-30">
        <img
          src="/assets/logo_gobierno.png"
          className="h-8 w-auto object-contain"
          alt="Gobierno"
        />
        <img
          src="/assets/logo_tesvg2.png"
          className="h-8 w-auto object-contain"
          alt="TESVG"
        />
      </div>

      {/* ================= CONTENIDO ================= */}
      <div
        className="flex flex-col items-center px-3 z-20 flex-1 justify-start"
        style={{ paddingBottom: BAR_HEIGHT + 6 }}
      >
        {/* ================= FOTO ================= */}
        <div className="mt-3">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={fotoReal}
              className="w-full h-full object-cover"
              alt="Foto usuario"
              onError={(e) => {
                e.currentTarget.src = "/assets/default_user.png";
              }}
            />
          </div>
        </div>

        {/* ================= BLOQUE INFORMACIÓN ================= */}
        <div className="text-center mt-3 px-2 w-full">

          {/* Nombre */}
          <p
            className={`font-bold leading-tight break-words ${
              nombreCompleto.length > 40
                ? "text-[13px]"
                : nombreCompleto.length > 30
                ? "text-[14px]"
                : "text-[15px]"
            }`}
          >
            {nombreCompleto}
          </p>

          {/* Área (máximo 2 líneas reales, jamás invade) */}
          <p
            className="text-gray-800 leading-tight mt-1"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize:
                datos?.nombrearea?.length > 45
                  ? "11px"
                  : datos?.nombrearea?.length > 30
                  ? "12px"
                  : "13px",
            }}
          >
            {datos?.nombrearea}
          </p>

          {/* Identificador separado */}
          <p className="text-gray-800 mt-2 text-[13px] font-medium">
            {datos?.numeroidentificador}
          </p>

        </div>

        {/* ================= TEXTO INSTITUCIONAL ================= */}
        <p className="text-center font-extrabold text-xl mt-3">
          EDUCACIÓN
        </p>

        <p className="text-center text-[10px] px-2 leading-tight">
          SECRETARÍA DE EDUCACIÓN, CIENCIA, TECNOLOGÍA E INNOVACIÓN
        </p>

        {/* ================= QR ================= */}
        <div className="mt-4 mb-2">
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR Credencial"
              className="bg-white p-1 rounded shadow"
              style={{ width: qrSize, height: qrSize }}
            />
          ) : (
            <p className="text-xs text-gray-600">Generando QR...</p>
          )}
        </div>
      </div>

      {/* ================= DECORACIÓN ================= */}
      <img
        src="/assets/logo_colibri.png"
        className="absolute left-0 bottom-[44px] h-[260px] opacity-20 z-0 pointer-events-none"
        alt="Decoración"
      />

      {/* ================= BARRA INFERIOR ================= */}
      <div
        className="absolute bottom-0 left-0 w-full z-40 px-3
                   flex items-center justify-center"
        style={{ height: BAR_HEIGHT }}
      >
        <img
          src="/assets/logo_barra.png"
          alt="barra"
          className="w-full h-8 object-contain"
        />
      </div>
    </div>
  );
};

export default CredencialFront;