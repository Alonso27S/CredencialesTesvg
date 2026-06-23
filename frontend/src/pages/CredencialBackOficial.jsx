import React from "react";

// URL base del backend para cargar recursos (ej. firma)
const BASE_URL = "https://credencialestesvg.com.mx";

const CredencialBack = ({ datos }) => {
  /**
   * =========================================================
   *   FIRMA
   * =========================================================
   */
  const firmaReal =
    datos?.firmaurl && datos.firmaurl !== ""
      ? `${BASE_URL}${datos.firmaurl}`
      : null;

  /**
   * =========================================================
   *   LÓGICA
   * =========================================================
   */
  const esAlumno = datos?.tipopersona?.toLowerCase() === "alumno";

  return (
    <div
      className="relative bg-[#7c1d2d] rounded-xl shadow-xl border
       border-gray-300 overflow-hidden flex flex-col text-white"
       style={{
        width: 300,
        height: 420,
        minHeight:420,
        paddingTop:25,
        paddingBottom: 20,
        
       }}
    >
      {/* =====================================================
            RFC / CURP (fila principal)
      ===================================================== */}
      <div
        className="
          w-full
          flex flex-row justify-between items-center
          text-xs sm:text-sm
          mt-1 px-1
          gap-2
        "
      >
        {/* RFC */}
        <div className="flex flex-col items-center flex-1">
          <p className="font-bold text-[10px] text-white sm:text-xs" translate="no">RFC</p>

          <p className="text-center break-words leading-tight text white" translate="no"
          style={{
            fontSize: "11px",
            whiteSpace: "nowrap"
          }}
          >
            {datos?.rfc || "--------"}
          </p>
        </div>
 
        {/* Separador */}
        <span className="font-bold opacity-80">|</span>

        {/* CURP */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <p className="font-bold text-[10px] sm:text-xs">CURP</p>
           
           <p
            className="text-center leading-tight witespace-nowrap"
            style={{
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >

            {datos?.curp || "--------"}
          </p>
        </div>
      </div>

      {/* =====================================================
            NSS DEBAJO (solo alumno)
      ===================================================== */}
      {esAlumno && (
        <div
          className="
            w-full text-center
            mt-2
            flex flex-col items-center
          "
        >
          <p className="font-bold text-[10px] sm:text-xs" translate="no">NSS</p>

          <p
            className="text-center leading-tight"
            style={{
              fontSize: "11px",
              whiteSpace: "nowrap",
            }}
          >
            {datos?.nss || "--------"}
          </p>
        </div>
      )}

      {/* =====================================================
            FIRMA
      ===================================================== */}
      <div className="mt-4 text-center w-full">
        {firmaReal ? (
          <div className="flex justify-center">
            <img
              src={firmaReal}
              alt="Firma"
              className="
                h-14 sm:h-16
                object-contain
              "
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : (
          <p className="text-[10px] italic opacity-70">Sin firma registrada</p>
        )}

        <p className="text-xs sm:text-sm mt-1">Firma</p>

        {/* ================================
      FIRMA DIRECTOR (FIJA)
================================ */}
        <div className="w-full flex flex-col items-center mt-2">
          {/* Contenedor con espacio fijo */}
          <div
            className="
      w-full
      h-12 sm:h-14
      flex items-center justify-center
    "
          >
            <img
              src="/assets/firmaDigital.png"
              alt="Firma Director"
              className="
        max-h-full
        object-contain
      "
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* Nombre Director */}
          <p className="font-bold text-xs sm:text-sm leading-none text-center mt-1">
            Dr. Zain Bernal Beltrán
            <br />
            Director General
          </p>
        </div>

         </div>
      {/* =====================================================
            TEXTO INSTITUCIONAL
      ===================================================== */}
      <div className="text-center text-[11px] sm:text-sm leading-tight">
        <p>Tecnológico de Estudios Superiores de</p>
        <p>Villa Guerrero</p>
      </div>

      {/* =====================================================
            LOGO
      ===================================================== */}
      <div className="flex justify-center mt-2">
        <img
          src="/assets/logo_rev.png"
          className="h-10 sm:h-12 object-contain"
          alt="rev logo"
        />
      </div>

      {/* =====================================================
            VIGENCIAA
      ===================================================== */}
      <p className="text-center text-xs sm:text-sm tracking-wide">
        Vigencia:{" "}
        {datos?.fechavigencia
          ? new Date(datos.fechavigencia).toLocaleDateString("es-MX")
          : "----"}
      </p>
    </div>
  );
};

export default CredencialBack;
