import React from "react";

// URL base del backend para cargar recursos (ej. firma)
const BASE_URL = "https://credencialestesvg.com.mx";

const CredencialBack = ({ datos }) => {
  // Ancho fijo de la credencial
  const CARD_WIDTH = 300;

  /**
   * Construye la URL completa de la firma solo si existe.
   * Evita errores cuando no hay firma registrada.
   */
  const firmaReal =
    datos?.firmaurl && datos.firmaurl !== ""
      ? `${BASE_URL}${datos.firmaurl}`
      : null;

  /**
   * =========================================================
   *   LÓGICA DE VISUALIZACIÓN
   * =========================================================
   * - Alumno → RFC | NSS | CURP
   * - Administrativo → RFC | CURP
   */
  const esAlumno = datos?.tipoPersona?.toLowerCase() === "alumno";

  return (
    <div
      className="h-[420px] bg-[#7c1d2d] text-white rounded-xl shadow-xl p-5
                 flex flex-col justify-between items-center"
      style={{ width: `${CARD_WIDTH}px` }}
    >
      {/* ================= RFC / NSS / CURP ================= */}
      <div className="flex items-center justify-between w-full mt-2 px-2 text-sm">
        {/* RFC */}
        <div className="flex flex-col items-center flex-1 overflow-visible">
          <p className="font-bold text-xs">RFC</p>
          <p className="text-center text-xs leading-tight">
            {datos?.rfc || "---------"}
          </p>
        </div>

        {/* Separador */}
        <span className="mx-2 font-bold text-sm leading-none">|</span>

        {/* NSS (solo alumno) */}
        {esAlumno && (
          <>
            <div className="flex flex-col items-center flex-1 overflow-visible">
              <p className="font-bold text-xs">NSS</p>
              <p className="text-center text-xs leading-tight">
                {datos?.nss || "---------"}
              </p>
            </div>

            {/* Separador */}
            <span className="mx-2 font-bold text-sm leading-none">|</span>
          </>
        )}

        {/* CURP */}
        <div className="flex flex-col items-center flex-1 overflow-visible">
          <p className="font-bold text-xs">CURP</p>
          <p className="text-center text-xs leading-tight">
            {datos?.curp || "---------"}
          </p>
        </div>
      </div>

      {/* ================= FIRMA ================= */}
      <div className="mt-6 text-center w-full">
        {firmaReal ? (
          <div className="flex justify-center">
            <img
              src={firmaReal}
              alt="Firma del alumno"
              className="h-16 object-contain"
              crossOrigin="anonymous"
              onError={(e) => {
                // Oculta la imagen si ocurre un error al cargarla
                e.target.style.display = "none";
              }}
            />
          </div>
        ) : (
          // Mensaje cuando no hay firma registrada
          <p className="text-xs italic opacity-70">Sin firma registrada</p>
        )}

        <p className="text-sm tracking-wide mt-1">Firma del Alumno</p>

        {/* Espacio visual */}
        <div className="h-10"></div>

        <p className="font-bold mt-4">Director General</p>
      </div>

      {/* ================= TEXTO INSTITUCIONAL ================= */}
      <div className="text-center text-sm leading-tight mt-2">
        <p>Tecnológico de Estudios Superiores de</p>
        <p>Villa Guerrero</p>
      </div>

      {/* ================= LOGO ================= */}
      <div className="flex justify-center mt-4">
        <img src="/assets/logo_rev.png" className="h-12" alt="rev logo" />
      </div>

      {/* ================= VIGENCIA ================= */}
      <p className="text-center text-sm mt-3 tracking-wide">
        Vigencia:{" "}
        {datos?.fechavigencia
          ? new Date(datos.fechavigencia).toLocaleDateString("es-MX")
          : "----"}
      </p>
    </div>
  );
};

export default CredencialBack;
