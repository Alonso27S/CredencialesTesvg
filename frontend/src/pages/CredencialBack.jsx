import React from "react";

const CredencialBack = ({ datos }) => {
  const CARD_WIDTH = 300;

  // 🧠 Validar si mostrar NSS (solo alumnos)
  const mostrarNSS = datos?.tipoPersona === "Alumno";

  return (
    <div
      className="h-[420px] bg-[#7c1d2d] text-white rounded-xl shadow-xl p-5 flex flex-col justify-between"
      style={{ width: `${CARD_WIDTH}px` }}
    >
      {/* RFC & CURP */}
      <div className="flex justify-between text-sm mt-2 px-2">
        <div className="flex flex-col items-center">
          <p className="font-bold">RFC</p>
          <p>{datos?.rfc || "---------"}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="font-bold">CURP</p>
          <p>{datos?.curp || "---------"}</p>
        </div>
      </div>

      {/* 🆕 NSS SOLO SI ES ALUMNO */}
      {mostrarNSS && (
        <div className="flex justify-center text-sm mt-3">
          <div className="flex flex-col items-center">
            <p className="font-bold">NSS</p>
            <p>{datos?.nss || "---------"}</p>
          </div>
        </div>
      )}

      {/* Firma */}
      <div className="mt-6 text-center">
        {datos?.firma ? (
          <div className="flex justify-center">
            <img
              src={datos.firma}
              alt="Firma del alumno"
              className="h-16 object-contain"
            />
          </div>
        ) : (
          <p className="text-xs italic opacity-70">Sin firma</p>
        )}
        <p className="text-sm tracking-wide mt-1">Firma del Alumno</p>
        <div className="h-10"></div>
        <p className="font-bold mt-4">Director General</p>
      </div>

      {/* Texto Inferior */}
      <div className="text-center text-sm leading-tight mt-2">
        <p>Tecnológico de Estudios Superiores de</p>
        <p>Villa Guerrero</p>
      </div>

      {/* Logo Inferior */}
      <div className="flex justify-center mt-4">
        <img src="/assets/logo_rev.png" className="h-12" alt="rev logo" />
      </div>

      {/* Vigencia */}
      <p className="text-center text-sm mt-3 tracking-wide">Vigencia: 9/7/26</p>
    </div>
  );
};

export default CredencialBack;
