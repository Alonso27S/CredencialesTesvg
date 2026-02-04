// src/components/CredencialFront.jsx
import React from "react";

const CredencialFront = ({ datos }) => {

  const CARD_WIDTH = 300;

  return (
    <div
      className="relative h-[420px] bg-[#d6b99c] rounded-xl shadow-xl overflow-hidden 
      border border-gray-300 flex flex-col"
      style={{ width: `${CARD_WIDTH}px` }}
    >

      {/* Logos */}
      <div className="flex justify-between items-center px-3 pt-3 relative z-10">
        <img src="/assets/logo_gobierno.png" className="h-8" alt="" />
        <img src="/assets/logo_edomex.png" className="h-8" alt="" />
        <img src="/assets/logo_tesvg2.png" className="h-8" alt="" />
      </div>

      {/* Foto */}
      <div className="flex justify-center mt-3 relative z-10">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img 
            src={datos?.foto || "/assets/default_user.png"} 
            className="w-full h-full object-cover" 
            alt="" 
          />
        </div>
      </div>

      {/* Nombre */}
      <div className="text-center mt-3 relative z-10">
        <p className="font-bold text-lg">
          {datos?.nombre} {datos?.apPaterno} {datos?.apMaterno}
        </p>
        <p className="text-gray-800 text-sm">
          {datos?.area || "Área / Departamento"}
        </p>
      </div>

      {/* Identificador */}
      <p className="text-center text-gray-800 mt-4 relative z-10">
        {datos?.identificador || "000000000"}
      </p>

      {/* Área grande */}
      <p className="text-center font-extrabold text-xl relative z-10">
        EDUCACIÓN
      </p>

      <p className="text-center text-[10px] px-2 leading-tight relative z-10">
        SECRETARÍA DE EDUCACIÓN, CIENCIA, TECNOLOGÍA E INNOVACIÓN
      </p>

{/* Fondo colibrí – sobresale la mitad desde abajo */}
<div className="flex-1 relative mt-2 overflow-visible">
  <img 
    src="/assets/logo_colibri.png"
    className="
      absolute 
      left-0 
      bottom-[-100px] 
      h-[300px] 
      w-auto 
      opacity-20 
      object-contain 
      pointer-events-none 
      select-none
    "
    alt=""
  />
</div>


      {/* Barra inferior del mismo tamaño que los logos superiores */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-full px-3">
        <img
          src="/assets/logo_barra.png"
          alt="barra"
          className="w-full h-8 object-contain drop-shadow-lg"
        />
      </div>

    </div>
  );
};

export default CredencialFront;