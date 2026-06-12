import React, { useState } from "react";
import axios from "axios";

const EditarUsuario = ({ usuario, onBack }) => {
const usuarioSesion = JSON.parse(
  localStorage.getItem("usuario")
);

const idrolUsuario = usuarioSesion?.id_rol;

const [nombre, setNombre] = useState(usuario?.nombre || "");
const [apellidop, setApellidop] = useState(usuario?.apellidop || "");
const [apellidom, setApellidom] = useState(usuario?.apellidom || "");
const [correo, setCorreo] = useState(usuario?.correo || "");
const [numeroidentificador, setNumeroidentificador] = useState(
  usuario?.numeroidentificador || ""
);

const [numerosegurosocial, setNumeroSeguroSocial] = useState(
  usuario?.numerosegurosocial || ""
);
const [curp, setCurp] = useState(usuario?.curp || "");
const [rfc, setRfc] = useState(usuario?.rfc || "");
const [tipopersona, setTipopersona] = useState(
  usuario?.tipopersona || ""
);
const [nombrearea, setNombreArea] = useState(
  usuario?.nombrearea || ""
);
const [puesto, setPuesto] = useState(usuario?.puesto || "");
const [tipoidentificador] = useState(
  usuario?.tipoidentificador || ""
);
const [nuevaPassword, setNuevaPassword] = useState("");
const [confirmarPassword, setConfirmarPassword] = useState(""); 

  if (!usuario) {
    return  <div>No hay usuario seleccionado</div>;

  }

  const guardarCambios = async () => {

    try {

      // Validaciones para Superadministrador
if (String(idrolUsuario) === "1" && nuevaPassword) {

  // Verificar confirmación
  if (nuevaPassword !== confirmarPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  // Validar seguridad de contraseña
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;

  if (!passwordRegex.test(nuevaPassword)) {
    alert(
      "La contraseña debe cumplir con los siguientes requisitos:\n\n" +
      "• Mínimo 8 caracteres\n" +
      "• Máximo 20 caracteres\n" +
      "• Al menos una letra mayúscula\n" +
      "• Al menos una letra minúscula\n" +
      "• Al menos un número"
    );
  
            return;
  }
} 
      await axios.put(
        `https://meztlitech.site/api/edusuarios/${usuario.id}`,

        {
          nombre,
          apellidop,
          apellidom,
          correo,
          numeroidentificador,
          numerosegurosocial,
          curp,
          rfc,
          tipopersona,
          nombrearea,
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
            onChange={(e) => setNombre(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""))}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Apellido Paterno</label>
          <input
            type="text"
            value={apellidop}
            onChange={(e) => setApellidop(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""))}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Apellido Materno</label>
          <input
            type="text"
            value={apellidom}
            onChange={(e) => setApellidom(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""))}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">CURP</label>
          <input
            type="text"
            value={curp}
            onChange={(e) => setCurp(e.target.value.replace(/[A-Z0-9]/g,"").slice(0,18))}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">RFC</label>
          <input
            type="text"
            value={rfc}
            onChange={(e) => setRfc(e.target.value.replace(/[^A-Z0-9]/g,"").slice(0,13))}
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
          <label className="font-semibold">Tipo de Usuario (ALUMNO,DOCENTE,ADMINISTRATIVO)</label>
          <input
            type="text"
            value={tipopersona}
            onChange={(e) => setTipopersona(e.target.value)}
            className="w-full border rounded-lg p-3 mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Área / Departamento</label>
          <input
            type="text"
            value={nombrearea}
            onChange={(e) => setNombreArea(e.target.value)}
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
            placeholder="usuario@villaguerrero.tecnm.mx"
            pattern="^[a-zA-Z0-9._%+-]+@villaguerrero\.tecnm\.mx$"
            title="Debe ser un correo institucional @villaguerrero.tecnm.mx"
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
        {tipopersona === "Alumno" ? (
    <>
      <div>
        <label className="font-semibold">
          Número de Control
        </label>

        <input
          type="text"
          value={numeroidentificador}
          onChange={(e) =>
            setNumeroidentificador(e.target.value.replace(/\D/g,""))
          }
          className="w-full border rounded-lg p-3 mt-1"
        />
      </div>

      <div>
        <label className="font-semibold">
          Número de Seguro Social
        </label>

        <input
          type="text"
          value={numerosegurosocial}
          onChange={(e) =>
            setNumeroSeguroSocial(e.target.value.replace(/\D/g,"").slice(0,11))
          }
          className="w-full border rounded-lg p-3 mt-1"
        />
      </div>
    </>
  ) : (
    <div>
      <label className="font-semibold">
        Clave ISSEMYM
      </label>

      <input
        type="text"
        value={numeroidentificador}
        onChange={(e) =>
          setNumeroidentificador(e.target.value.replace(/\D/g,"").slice(0,10))
        }
        className="w-full border rounded-lg p-3 mt-1"
      />
    </div>
  )}

</div>

        

      {/* SEGURIDAD */}

      {String(idrolUsuario) === "1" && (

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
                placeholder="Ingrese nueva contraseña"
              />

              <p className="text-xs text-gray-500 mt-1">
                Minimo 8 caracteres, una mayúscula, una minuscula y un número.
              </p>
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
                placeholder="Repita la contraseña"
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