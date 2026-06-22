import React, { useEffect, useState, useMemo } from "react";
import QRCode from "qrcode";


const CredencialFront = ({ datos }) => {
  
  const [qrImage, setQrImage] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  
  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 420;
  const BAR_HEIGHT = 30;


  const fotoReal = datos?.fotourl
    ? datos.fotourl.startsWith("http")
      ? datos.fotourl
      : `https://meztlitech.site${datos.fotourl}`
    : "/assets/default_user.png";

  const nombreCompleto = `${datos?.nombre || ""} ${datos?.apellidop || ""} ${datos?.apellidom || ""}`.trim();

  const qrSize = 100;

  useEffect(() => {
    if (!datos?.qr) return;

    QRCode.toDataURL(datos.qr, { 
      width: 300,
       margin: 2 })
      .then(setQrImage)
      .catch((err) => console.error("Error generando QR:", err));
  }, [datos]);

  {/*SECCION 1 */}
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

{/*SECCION 2 */}
      {/* ================= FOTO ================= */}
      <div className="flex justify-center mt-3">
        <div className="w-20 h-20 rounded-full overflow-hidden
         border-4 border-white shadow-md">
          <img
            src={fotoReal}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/assets/default_user.png";
            }}
          />
        </div>
      </div>

{/*SECCION 3 */}
      {/* ================= BLOQUE TEXTO (CRECE NATURAL) ================= */}
      <div className="text-center  px-3 flex flex-col items-center"
      style={{
        height: "90px"
      }}
      >

        {/* Nombre */}
         <div
            style={{
              height: "52px",
              width: "90%",
              //overflow: "hidden",
            }}
          >

        <p
          className={`font-bold leading-tight ${
                nombreCompleto.length > 40
                  ? "text-[11px]"
                  : nombreCompleto.length > 30
                  ? "text-[12px]"
                  : "text-[13px]"
              }`}
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {nombreCompleto}
        </p>
        </div>

  {/*SECCION 4 */}

  {/* Área */}

        <div
            style={{
              height: "40px",
              width: "90%",
             // overflow: "hidden",
            }}
        >
        <p
            className="text-gray-800 leading-tight "
            style={{
               fontSize: 
              (datos?.nombrearea || "").length > 80
                ? "7px"
                : (datos?.nombrearea || "").length > 60
                ? "8px"
                : (datos?.nombrearea || "").length > 40
                ? "9px"
                : "10px",
            }}
          >
            {datos?.nombrearea}
        </p>
        </div>

  {/*SECCION  5*/}

  {/* Identificador */}

            <div
              style={{
                height: "15px",
                marginTop: "0px",
              }}
            >
              <p
                className="text-gray-800 font-medium"
                style={{
                  fontSize: "11px",
                }}
              >
          {datos?.numeroidentificador}
        </p>
      </div>
      </div>

      {/*SECCION 6 */}

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
          marginTop:"2px",
          marginBottom: "2px",
        }}
        >
          EDUCACIÓN
        </p>
        {/*SECCION 7 */}
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


{/*SECCION 8 */}
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
              alt= "QR"
              onClick={(e) => {
              e.stopPropagation();
              setQrModalOpen(true);
            }}
              style={{
                width: "100px",
                height: "100px",
                cursor: "pointer"
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
      {qrModalOpen && (
  <div
    className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4"
    onClick={() => setQrModalOpen(false)}
  >
     <div
      className="bg-white p-4 rounded-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={qrImage}
        alt="QR Grande"
        style={{
          width: "80vw",
          maxWidth: "400px",
          height: "auto",

        }}
      />
    </div>
  </div>
)}
    </div>
  );
};

export default CredencialFront;