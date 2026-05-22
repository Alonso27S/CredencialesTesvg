import React, { useState } from "react";
import axios from "axios";

const EditarUsuario = ({ usuario, onBack }) => {

  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellidop, setApellidop] = useState(usuario.apellidop);
  const [apellidom, setApellidom] = useState(usuario.apellidom);
  const [correo, setCorreo] = useState(usuario.correo);
  const [numeroidentificador, setNumeroidentificador] = useState(usuario.numeroidentificador);

  const guardarCambios = async () => {

    try {

      await axios.put(
        `https://credencialestesvg.com.mx/api/edusuarios/${usuario.id}`,
        
        {
          nombre,
          apellidop,
          apellidom,
          correo,
          numeroidentificador
        }
      );

      alert("Usuario actualizado correctamente");

      onBack();

    } catch (error) {

      console.error(error);

      alert("Error al actualizar");

    }

  };

  return (

    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6 text-[#8A2136]">
        Editar Usuario
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="font-semibold">
            Nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">
            Apellido Paterno
          </label>

          <input
            type="text"
            value={apellidop}
            onChange={(e) => setApellidop(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">
            Apellido Materno
          </label>

          <input
            type="text"
            value={apellidom}
            onChange={(e) => setApellidom(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">
            Correo
          </label>

          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">
            Número Identificador
          </label>

          <input
            type="text"
            value={numeroidentificador}
            onChange={(e) => setNumeroidentificador(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

      </div>

      <div className="flex justify-end gap-4 mt-8">

        <button
          onClick={onBack}
          className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-lg"
        >
          Cancelar
        </button>

        <button
          onClick={guardarCambios}
          className="bg-[#8A2136] hover:brightness-90 text-white px-5 py-2 rounded-lg"
        >
          Guardar Cambios
        </button>

      </div>

    </div>

  );

};

export default EditarUsuario;