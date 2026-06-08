import React, { useState } from "react";
import axios from "axios";



  

const EditarUsuario = ({ usuario, onBack }) => {
const rolUsuario = localStorage.getItem("rol");
  const [nombre, setNombre] = useState(usuario.nombre);
  const [apellidop, setApellidop] = useState(usuario.apellidop);
  const [apellidom, setApellidom] = useState(usuario.apellidom);
  const [correo, setCorreo] = useState(usuario.correo);
  const [numeroidentificador, setNumeroidentificador] = useState(
    usuario?.numeroidentificador || ""
  );
  const [curp, setCurp] = useState(usuario.curp || "");
  const [rfc, setRfc] = useState(usuario.rfc || "");
  const [tipo, setTipo] = useState(usuario.tipo || "");
  const [area, setArea] = useState(usuario.area || "");
  const [puesto, setPuesto] = useState(usuario.puesto || "");
    const [tipoidentificador] = useState(
    usuario.tipoidentificador || ""
  );
   const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState(""); 

  if (!usuario) {
    return  <div>No hay usuario seleccionado</div>;

  }

  const guardarCambios = async () => {

    try {

      if (rolUsuario === "Superadministrador" 
        && nuevaPassword && nuevaPassword !== confirmarPassword) {
          alert("Las contraseñas no coinciden");

      }
      await axios.put(
        `https://credencialestesvg.com.mx/api/edusuarios/${usuario.id}`,

        {
          nombre,
          apellidop,
          apellidom,
          correo,
          numeroidentificador,
          curp,
          rfc,
          area,
          puesto,
          tipoidentificador,
          nuevaPassword
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

       <p className="text-gray-500 mb-8">
        Modifique la información del usuario seleccionado.
      </p>

      {/* DATOS PERSONALES */}

      <div className="border-b pb-2 mb-6">
        <h3 className="text-lg font-bold text-[#8A2136]">
          Datos Personales
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="font-semibold">Nombre(s)</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Apellido Paterno</label>
          <input
            type="text"
            value={apellidop}
            onChange={(e) => setApellidop(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Apellido Materno</label>
          <input
            type="text"
            value={apellidom}
            onChange={(e) => setApellidom(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">CURP</label>
          <input
            type="text"
            value={curp}
            onChange={(e) => setCurp(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">RFC</label>
          <input
            type="text"
            value={rfc}
            onChange={(e) => setRfc(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

      </div>

      {/* DATOS INSTITUCIONALES */}

      <div className="border-b pb-2 mt-10 mb-6">
        <h3 className="text-lg font-bold text-[#8A2136]">
          Datos Institucionales
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="font-semibold">Tipo</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Área / Departamento</label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Puesto</label>
          <input
            type="text"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

      </div>

      {/* IDENTIFICACIÓN */}

      <div className="border-b pb-2 mt-10 mb-6">
        <h3 className="text-lg font-bold text-[#8A2136]">
          Identificación
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="font-semibold">
            Tipo de Identificador
          </label>

          <input
            type="text"
            value={tipoidentificador}
            readOnly
            className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
          />
        </div>

        <div>
          <label className="font-semibold">
            {tipo === "Alumno"
              ? "Número de Control"
              : "Clave ISSEMYM"}
          </label>

          <input
            type="text"
            value={numeroidentificador}
            onChange={(e) =>
              setNumeroidentificador(e.target.value)
            }
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

      </div>

      {/* SEGURIDAD */}

      {rolUsuario === "Superadministrador" && (

        <>
          <div className="border-b pb-2 mt-10 mb-6">
            <h3 className="text-lg font-bold text-[#8A2136]">
              Seguridad
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="font-semibold">
                Nueva Contraseña
              </label>

              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) =>
                  setNuevaPassword(e.target.value)
                }
                className="w-full border rounded-lg p-3 mt-1"
              />
            </div>

            <div>
              <label className="font-semibold">
                Confirmar Contraseña
              </label>

              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) =>
                  setConfirmarPassword(e.target.value)
                }
                className="w-full border rounded-lg p-3 mt-1"
              />
            </div>

          </div>
        </>
      )}

      <div className="flex justify-end gap-4 mt-10">

        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-300 rounded-lg"
        >
          Cancelar
        </button>

        <button
          onClick={guardarCambios}
          className="px-6 py-3 bg-[#8A2136] text-white rounded-lg"
        >
          Guardar Cambios
        </button>

      </div>

    </div>

  );

};

export default EditarUsuario;