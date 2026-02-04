import React from "react";

const TablaUsuarios = ({ usuarios, titulo }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-6">
      <h4 className="text-xl font-semibold mb-4">{titulo}</h4>

      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-[#8A2136] text-white">
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{user.nombre}</td>
              <td className="p-2">{user.correo}</td>
              <td className="p-2">{user.tipopersona}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;
