import React, { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

const FormularioVisita = ({ onBack }) => {
  const [form, setForm] = useState({
    fecha: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    horaEntrada: "",
    motivo: "",
    dependencia: "",
    area: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full p-4">

      {/* Botón Regresar */}
      <button
        onClick={onBack}
        className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center gap-2 font-semibold mb-6"
      >
        <ArrowLeft size={18} /> Regresar
      </button>

      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <UserPlus className="text-[#8A2136]" />
        Registrar Nueva Visita
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div>
          <label className="font-medium">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-medium">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Ej. Juan"
          />
        </div>

        <div>
          <label className="font-medium">Apellido Paterno</label>
          <input
            name="apellidoPaterno"
            value={form.apellidoPaterno}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Ej. Pérez"
          />
        </div>

        <div>
          <label className="font-medium">Apellido Materno</label>
          <input
            name="apellidoMaterno"
            value={form.apellidoMaterno}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Ej. Ramírez"
          />
        </div>

        {/* Tipo de Identificación */}
        <div className="col-span-1 sm:col-span-2">
          <label className="font-medium block mb-1">Tipo de Identificación</label>

          <div className="flex gap-6 pl-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoIdentificacion"
                value="INE"
                checked={form.tipoIdentificacion === "INE"}
                onChange={handleChange}
              />
              INE
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoIdentificacion"
                value="CURP"
                checked={form.tipoIdentificacion === "CURP"}
                onChange={handleChange}
              />
              CURP
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoIdentificacion"
                value="Otro"
                checked={form.tipoIdentificacion === "Otro"}
                onChange={handleChange}
              />
              Otro
            </label>
          </div>
        </div>

        {/* Campo dinámico para número de identificación */}
        {form.tipoIdentificacion && (
          <div className="col-span-1 sm:col-span-2">
            <label className="font-medium">Número de Identificación</label>
            <input
              name="numeroIdentificacion"
              value={form.numeroIdentificacion}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder={
                form.tipoIdentificacion === "CURP"
                  ? "Ej. ABCD001122HDFRRS09"
                  : form.tipoIdentificacion === "INE"
                  ? "Número de INE"
                  : "Especifique identificación"
              }
            />
          </div>
        )}

        <div>
          <label className="font-medium">Hora de Entrada</label>
          <input
            type="time"
            name="horaEntrada"
            value={form.horaEntrada}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="font-medium">Motivo</label>
          <input
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Motivo de visita"
          />
        </div>

        <div>
          <label className="font-medium">Dependencia</label>
          <input
            name="dependencia"
            value={form.dependencia}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Ej. Mantenimiento"
          />
        </div>

        <div>
          <label className="font-medium">Área</label>
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Ej. Sistemas"
          />
        </div>

      </div>

      {/* BOTÓN REGISTRAR */}
      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-600">
          Registrar
        </button>
      </div>

    </div>
  );
};

export default FormularioVisita;
