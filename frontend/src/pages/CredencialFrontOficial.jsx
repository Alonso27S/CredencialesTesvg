import React, { useEffect, useState, useMemo } from "react";
import QRCode from "qrcode";

const CredencialFront = ({ datos }) => {
  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 420;
  const BAR_HEIGHT = 44;

  const [qrImage, setQrImage] = useState(null);

  const fotoReal = datos?.fotourl
    ? datos.fotourl.startsWith("http")
      ? datos.fotourl
      : `https://credencialestesvg.com.mx${datos.fotourl}`
    : "/assets/default_user.png";

  const nombreCompleto = `${datos?.nombre || ""} ${datos?.apellidop || ""} ${datos?.apellidom || ""}`.trim();

  const qrSize = useMemo(() => {
    if (nombreCompleto.length > 40) return 80;
    if (nombreCompleto.length > 30) return 90;
    return 96;
  }, [nombreCompleto]);

  useEffect(() => {
    if (!datos?.qr) return;

    QRCode.toDataURL(datos.qr, { width: 160, margin: 1 })
      .then(setQrImage)
      .catch((err) => console.error("Error generando QR:", err));
  }, [datos]);

  return (
    <div
      className="relative bg-[#d6b99c] rounded-xl shadow-xl border border-gray-300 overflow-hidden flex flex-col"
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      {/* ================= LOGOS ================= */}
      <div className="flex justify-between items-center px-3 pt-3">
        <img src="/assets/logo_gobierno.png" className="h-8 object-contain" />
        <img src="/assets/logo_tesvg2.png" className="h-8 object-contain" />
      </div>

      {/* ================= FOTO ================= */}
      <div className="flex justify-center mt-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img
            src={fotoReal}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/assets/default_user.png";
            }}
          />
        </div>
      </div>

      {/* ================= BLOQUE TEXTO (CRECE NATURAL) ================= */}
      <div className="text-center mt-3 px-3">

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

        {/* Área */}
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

        {/* Identificador */}
        <p className="text-gray-800 mt-2 text-[13px] font-medium">
          {datos?.numeroidentificador}
        </p>
      </div>

      {/* ================= BLOQUE INFERIOR ================= */}
      <div
        className="flex flex-col items-center px-3 mt-2"
        style={{ marginTop: "auto", paddingBottom: BAR_HEIGHT + 6 }}
      >
        <p className="font-extrabold text-xl">
          EDUCACIÓN
        </p>

        <p className="text-[10px] text-center leading-tight">
          SECRETARÍA DE EDUCACIÓN, CIENCIA, TECNOLOGÍA E INNOVACIÓN
        </p>

        <div className="mt-2">
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR"
              className="bg-white p-1 rounded shadow"
              style={{ width: qrSize, height: qrSize }}
            />
          ) : (
            <p className="text-xs">Generando QR...</p>
          )}
        </div>
      </div>

      {/* ================= DECORACIÓN ================= */}
      <img
        src="/assets/logo_colibri.png"
        className="absolute left-0 bottom-[44px] h-[260px] opacity-20 pointer-events-none"
      />

      {/* ================= BARRA ================= */}
      <div
        className="absolute bottom-0 left-0 w-full flex items-center justify-center"
        style={{ height: BAR_HEIGHT }}
      >
        <img
          src="/assets/logo_barra.png"
          className="w-full h-8 object-contain"
        />
      </div>
    </div>
  );
};

export default CredencialFront;