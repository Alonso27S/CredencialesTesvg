import React, { useState } from "react";
import { Search, IdCard } from "lucide-react";
import FormularioVisita from "./FormularioVisita";

const Visitas = ({ onBack }) => {
  const [busqueda, setBusqueda] = useState("");
  const [abrirFormulario, setAbrirFormulario] = useState(false);

  const visitas = [
    {
      nombre: "Carlos Mendoza",
      empresa: "CFE",
      motivo: "Revisión técnica",
      fecha: "2025-10-01",
      id: "INEXX345",
    },
    {
      nombre: "Laura Pérez",
      empresa: "DHL",
      motivo: "Entrega de paquete",
      fecha: "2025-10-02",
      id: "ID8802",
    },
  ];

  const visitasFiltradas = visitas.filter((v) =>
    v.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (abrirFormulario) {
    return <FormularioVisita onBack={() => setAbrirFormulario(false)} />;
  }

  return (
    <div className="w-full p-4">

      {/* Botón Regresar */}
      <button
        onClick={onBack}
        className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center gap-2 font-semibold mb-6"
      >
        Regresar
      </button>

      {/* Título */}
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <IdCard className="text-[#8A2136]" />
        Control de Visitas
      </h3>

      {/* BUSCADOR */}
      <div className="mb-6 relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar visita por nombre..."
          className="w-full border p-2 pl-10 rounded"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA */}
      <div className="border rounded-xl p-4 shadow-sm bg-white">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          Últimas Visitas Registradas
        </h4>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border-b">Nombre</th>
              <th className="p-2 border-b">Empresa</th>
              <th className="p-2 border-b">Motivo</th>
              <th className="p-2 border-b">Fecha</th>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Acción</th>
            </tr>
          </thead>

          <tbody>
            {visitasFiltradas.map((v, i) => (
              <tr key={i}>
                <td className="p-2 border-b">{v.nombre}</td>
                <td className="p-2 border-b">{v.empresa}</td>
                <td className="p-2 border-b">{v.motivo}</td>
                <td className="p-2 border-b">{v.fecha}</td>
                <td className="p-2 border-b">{v.id}</td>
                <td className="p-2 border-b">
                  <button className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                    Finalizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BOTÓN NUEVA VISITA */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setAbrirFormulario(true)}
          className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-600"
        >
          Nueva Visita
        </button>
      </div>

    </div>
  );
};

export default Visitas;
