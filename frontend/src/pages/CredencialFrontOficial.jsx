import React, { useEffect, useState, useMemo } from "react";
import QRCode from "qrcode";

const CredencialFront = ({ datos }) => {
  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 420;
  const BAR_HEIGHT = 40;

  const [qrImage, setQrImage] = useState(null);

  const fotoReal = datos?.fotourl
    ? datos.fotourl.startsWith("http")
      ? datos.fotourl
      : `https://meztlitech.site${datos.fotourl}`
    : "/assets/default_user.png";

  const nombreCompleto = `${datos?.nombre || ""} ${datos?.apellidop || ""} ${datos?.apellidom || ""}`.trim();

  const qrSize = 80;

  useEffect(() => {
    if (!datos?.qr) return;

    QRCode.toDataURL(datos.qr, { width: 155, margin: 1 })
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
      <div className="text-center  px-3 flex flex-col items-center"
      style={{
        height: "90px"
      }}
      >

        {/* Nombre */}
         <div
            style={{
              height: "42px",
              width: "90%",
              overflow: "hidden",
            }}
          >

        <p
          className={`font-bold leading-tight ${
                nombreCompleto.length > 40
                  ? "text-[12px]"
                  : nombreCompleto.length > 30
                  ? "text-[13px]"
                  : "text-[15px]"
              }`}
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {nombreCompleto}
        </p>
        </div>

        {/* Área */}

        <div
            style={{
              height: "32px",
              width: "90%",
              overflow: "hidden",
            }}
        >
        <p
            className="text-gray-800 leading-tight "
            style={{
               fontSize:
              (datos?.nombrearea || "").length > 80
                ? "8px"
                : (datos?.nombrearea || "").length > 60
                ? "9px"
                : (datos?.nombrearea || "").length > 40
                ? "10px"
                : "12px",
            }}
          >
            {datos?.nombrearea}
        </p>
        </div>

        {/* Identificador */}

                  <div
              style={{
                height: "15px",
                marginTop: "3px",
              }}
            >
              <p
                className="text-gray-800 font-medium"
                style={{
                  fontSize: "10px",
                }}
              >
          {datos?.numeroidentificador}
        </p>
      </div>
      </div>

      {/* ================= BLOQUE INFERIOR ================= */}
      <div
        className="flex flex-col items-center px-3"
        style={{
          height: "100px",
          paddingBottom: BAR_HEIGHT ,
               
        }}
      >
        <p className="font-extrabold text-[18px] leading-none"
        style={{
          marginTop:"1px",
          marginBottom: "2px",
        }}
        >
          EDUCACIÓN
        </p>
        <p
           className="text-center leading-tight"
              style={{

                fontSize: "10px",
                height: "20px",
                marginBottom: "5px",

              }}
            >
              SECRETARÍA DE EDUCACIÓN, CIENCIA, TECNOLOGÍA E INNOVACIÓN
        </p>

        <div
              style={{
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
                
              }}
         >
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR"
              className="bg-white p-1 rounded shadow"
              style={{ 
                width: "80px", 
                height: "80px",
               }}
            />
          ) : (
            <div
              style={{
                width: "75px",
                height: "75px",
               }}
                />
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