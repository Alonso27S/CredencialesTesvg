import React, { useState, useRef } from "react"; // React y hooks
import { ArrowLeft, Camera, PenLine } from "lucide-react"; // Iconos usados en la UI
import CredencialFront from "./CredencialFront"; // Componente para la vista frontal de la credencial
import CredencialBack from "./CredencialBack"; // Componente para la vista trasera de la credencial
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

// Estado inicial del formulario: define todas las propiedades que se manejarán
const initialFormState = {
  nombre: "",
  apellidop: "",
  apellidom: "",
  curp: "",
  rfc: "",
  tipoPersona: "",
  nombreArea: "",
  tipoIdentificador: "control",
  numeroIdentificador: "",
  numeroSeguroSocial: "",
  puesto: "",
  correo: "",
  esUsuarioInicial: "",
  contraseña: "",
};


const AREAS = [
  "INGENIERÍA EN SISTEMAS COMPUTACIONALES",
  "INGENIERÍA EN INDUSTRIAS ALIMENTARIAS",
  "INGENIERÍA INDUSTRIAL",
  "INGENIERÍA EN INOVACIÓN AGRICOLA SUSTENTABLE",
  "INGENIERÍA ELECTRONICA",
  "LICENCIATURA EN ADMINISTRACIÓN",
  "ARQUITECTURA", //
  "LICENCIATURA EN TURISMO" ,
  "JUNTA DIRECTIVA",
  "PATRONATO",
  "DIRECCIÓN GENERAL",
  "DIRECCIÓN ACADÉMICA",//
  "DIRECCIÓN DE ADMINISTRACIÓN Y FINANZAS",//
  "SUBDIRECCIÓN DE ESTUDIOS PROFESIONALES", //
  "DEPARTAMENTO DE DESARROLLO ACADÉMICO",//
  "DEPARTAMENTO DE CIENCIAS BÁSICAS",
  "DEPARTAMENTO DE ACTIVIDADES CULTURALES Y DEPORTIVAS",//
  "SUBDIRECCIÓN DE ESTUDIOS PROFESIONALES",//
  "DEPARTAMENTO DE POSGRADO E INVESTIGACION",
  "DIRECCIÓN DE PLANEACIÓN Y VINCULACIÓN",
  "SUBDIRECCIÓN DE VINCULACIÓN Y EXTENSIÓN",//
  "SUBDIRECCIÓN DE PLANEACIÓN E IGUALDAD DE GÉNERO",//
  "SUBDIRECCIÓN DE SERVICIOS ADMINISTRATIVOS",
  "DEPARTAMENTO DE VINCULACIÓN",
  "DEPARTAMENTO DE DIFUSIÓN Y CONCENTRACIÓN",
  "DEPARTAMENTO DE TITULACIÓN Y EGRESADOS",//
  "DEPARTAMENTO DE SERVICIO SOCIAL Y PRÁCTICAS PROFESIONALES", //
  "DEPARTAMENTO DE PLANEACIÓN Y EVALUACIÓN", //
  "DEPARTAMENTO DE ESTADISTICA Y EVALUACION",
  "DEPARTAMENTO DE CONTROL ESCOLAR",
  "DEPARTAMENTO DE PERSONAL",//
  "DEPARTAMENTO DE PRESUPUESTOS Y CONTABILIDAD",
  "DEPARTAMENTO DE RECURSOS MATERIALES",//
];



const Registro = ({ importado, onBack }) => {
  // Estado principal del formulario
  const [form, setForm] = useState(initialFormState);

  // Estados UI auxiliares
  const [modalOpen, setModalOpen] = useState(false); // controla modal que muestra la contraseña generada
  const [passwordGenerada, setPasswordGenerada] = useState(""); // contraseña generada por el backend
  const [fotoFile, setFotoFile] = useState(null); // archivo File de la foto (para enviar al backend)
  const [firmaFile, setFirmaFile] = useState(null); // archivo File de la firma
  const [fotoPreview, setFotoPreview] = useState(null); // preview en base64 para mostrar en la UI
  const [firmaPreview, setFirmaPreview] = useState(null); // preview de la firma
  const [loading, setLoading] = useState(false); // indicador de envío en progreso

  // Mensaje de error específico para el campo correo (por ejemplo, duplicado)
  const [errorCorreo, setErrorCorreo] = useState("");

  // isFormValid: valida de manera rápida si el formulario está listo antes de enviar.
  // - revisa errores por campo (state `errors`)
  // - revisa que los campos obligatorios no estén vacíos
  const isFormValid = () => {
    // Si hay al menos un error en el objeto errors
    const hasErrors = Object.values(errors).some((error) => error);

    // Campos obligatorios (puedes ajustar esta lista)
    const requiredFields = ["nombre", "apellidop", "correo"];
    const hasEmptyRequired = requiredFields.some(
      (field) => !form[field] || form[field].trim() === "",
    );

    // Devuelve true sólo cuando no hay errores y no faltan campos obligatorios
    return !hasErrors && !hasEmptyRequired;
  };

  // Referencia para controlar si la firma está activa (no utilizada actualmente,
  // pero se mantiene para posibles futuras integraciones)
  // eslint-disable-next-line no-unused-vars
  const firmaActiva = useRef(false);

  // Resetea el formulario y previews a su estado inicial
  const resetFormulario = () => {
    setForm(initialFormState);
    setPasswordGenerada("");
    setFotoFile(null);
    setFirmaFile(null);
    setFotoPreview(null);
    setFirmaPreview(null);
  };

  // Helper: extrae la contraseña desde la respuesta JSON del backend
  // Acepta distintos nombres de campo por compatibilidad
  const extractPasswordFromJson = (json) => {
    return json.passwordGenerada || json.contraseña || null;
  };

  const location = useLocation();

  /* ================================
     🔹 PRECARGAR DATOS IMPORTADOS
  ================================ */
  useEffect(() => {
    if (importado) {
      console.log("📥 Datos importados en Registro:", importado);

      setForm((prev) => ({
        ...prev,
        nombre: importado.nombre || "",
        apellidop: importado.apellidop || "",
        apellidom: importado.apellidom || "",
        curp: importado.curp || "",
        rfc: importado.rfc || "",
        numeroIdentificador: importado.numeroIdentificador || "",
        nombreArea: importado.nombreArea || "",
        correo: importado.correo || "",
        tipoPersona: importado.tipoPersona || "Alumno",
      }));
    }
  }, [importado]);

  // Estado que guarda errores por campo (ej: validaciones de texto)
  const [errors, setErrors] = useState({});

  // Regex para validar nombres y campos similares en mayúsculas con acentos y caracteres permitidos
  const textoSeguroRegex =
    /^[A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ´\-,]*( [A-ZÁÉÍÓÚÜÑ][A-ZÁÉÍÓÚÜÑ´\-,]*)*$/;

  // Patrones comunes que intentan detectar intentos de SQL injection u caracteres peligrosos
  const sqlInjectionPatterns = [
    /('|\"|;|--|\/\*|\*\/)/i, // Caracteres especiales y comentarios
    /\b(SELECT|DROP|INSERT|UPDATE|DELETE|UNION|EXEC|OR|AND)\b/i, // Palabras SQL
    /\b(OR\s+1=1|AND\s+1=1|DROP\s+TABLE|UNION\s+SELECT)\b/i, // Combinaciones típicas
  ];

  // Maneja cambios de inputs: normaliza, valida y actualiza estado
  const handleChange = (e) => {
    let { name, value } = e.target;
    let error = "";

    // Normalizaciones y validaciones por campo
    if (name === "curp") {
      // CURP: solo mayúsculas y números, máximo 18 caracteres
      value = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 18);
    } else if (name === "rfc") {
      // RFC: similar a CURP, hasta 13 caracteres
      value = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 13);
    } else if (name === "numeroIdentificador") {
      // Identificador: solo alfanumérico hasta 11 caracteres
      value = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 11);
    } else if (name === "correo") {
      // Correo: convertir a minúsculas y limpiar error específico
      value = value.toLowerCase();
      setErrorCorreo("");
    } else if (name === "numeroSeguroSocial") {
      // Solo números, máx 11 (ajusta si quieres 10)
      value = value.replace(/\D/g, "").slice(0, 11);
    } else {
      // Campos que deben ir en mayúsculas y validarse con textoSeguroRegex
      const camposMayus = [
        "nombre",
        "apellidop",
        "apellidom",
        "nombreArea",
        "puesto",
      ];

      if (camposMayus.includes(name)) {
        // Convertir a mayúsculas y eliminar caracteres no permitidos
        value = value.toUpperCase();

        // Permitir letras, acentos, guiones, comas, apóstrofes y espacios simples
        value = value.replace(/[^A-ZÁÉÍÓÚÜÑ´\-,\s]/gi, "");
        // Normalizar espacios múltiples a uno solo
        value = value.replace(/\s+/g, " ");

        // Validar formato con regex para evitar entradas con caracteres inválidos
        if (value && !textoSeguroRegex.test(value)) {
          error =
            "Solo letras, un espacio entre palabras y sin espacios al inicio o final.";
        }

        // Comprobar patrones de SQL Injection y bloquear si coincide
        for (let pattern of sqlInjectionPatterns) {
          if (pattern.test(value)) {
            error = "Valor no permitido por motivos de seguridad.";
            break;
          }
        }
      }
    }

    // Actualizar estado del formulario y errores por campo
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ================================
  //   CAPTURAR FOTO (usa cámara y guarda File + preview)
  // ================================
  const tomarFoto = async () => {
    try {
      // Solicita acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Crear elemento video para mostrar la vista previa de la cámara
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      await video.play();

      // Crear modal DOM simple para mostrar video y botones
      const modal = document.createElement("div");
      Object.assign(modal.style, {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
      });

      // Estilos para el video
      video.style.maxWidth = "90%";
      video.style.maxHeight = "70%";
      video.style.borderRadius = "8px";
      video.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";

      // Botón para tomar la foto
      const btnTomar = document.createElement("button");
      btnTomar.innerText = "Tomar Foto";
      Object.assign(btnTomar.style, {
        padding: "10px 18px",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      });

      // Botón cancelar para cerrar modal sin guardar
      const btnCancelar = document.createElement("button");
      btnCancelar.innerText = "Cancelar";
      Object.assign(btnCancelar.style, {
        padding: "10px 18px",
        background: "#ef4444",
        color: "#fff",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      });

      // Acción al tomar foto: recorta a cuadrado (centrado), genera preview y File
      btnTomar.onclick = () => {
        const canvas = document.createElement("canvas");
        // tamaño: tomar el menor entre ancho, alto y 600px para limitar resolución
        const size = Math.min(video.videoWidth, video.videoHeight, 600);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        // Centrar el recorte
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

        // Preview en base64 para mostrar en la UI
        const fotoDataUrl = canvas.toDataURL("image/png");
        setFotoPreview(fotoDataUrl);

        // Generar objeto File para enviar al backend
        canvas.toBlob((blob) => {
          const file = new File([blob], `foto_${Date.now()}.png`, {
            type: "image/png",
          });
          setFotoFile(file);
        }, "image/png");

        // Parar cámara y cerrar modal
        stream.getTracks().forEach((t) => t.stop());
        document.body.removeChild(modal);
      };

      // Cancelar: parar cámara y cerrar modal
      btnCancelar.onclick = () => {
        stream.getTracks().forEach((t) => t.stop());
        document.body.removeChild(modal);
      };

      // Construir modal y añadir al DOM
      modal.appendChild(video);
      const btns = document.createElement("div");
      Object.assign(btns.style, { display: "flex", gap: "12px" });
      btns.appendChild(btnTomar);
      btns.appendChild(btnCancelar);
      modal.appendChild(btns);
      document.body.appendChild(modal);
    } catch (err) {
      // Manejo de errores (p. ej. permisos denegados)
      console.error("Error cámara:", err);
      alert("No se pudo acceder a la cámara. Revisa permisos.");
    }
  };

  // ================================
  //   FIRMA DIGITAL (canvas en modal, guarda File + preview)
  // ================================
  const abrirFirma = () => {
    // Crear modal DOM
    const modal = document.createElement("div");
    Object.assign(modal.style, {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      flexDirection: "column",
      gap: "12px",
      padding: "16px",
    });

    // Crear canvas para dibujar la firma
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 300;
    canvas.style.background = "#fff";
    canvas.style.borderRadius = "6px";
    canvas.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    canvas.style.touchAction = "none";

    const ctx = canvas.getContext("2d");
    // Ajustes de dibujo
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    let drawing = false;

    // Obtener posición del puntero (mouse o touch)
    const getPointer = (e) => {
      if (e.touches && e.touches.length) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    // Iniciar trazo
    const start = (e) => {
      drawing = true;
      const p = getPointer(e);
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(p.x - rect.left, p.y - rect.top);
      e.preventDefault();
    };

    // Mover el trazo
    const move = (e) => {
      if (!drawing) return;
      const p = getPointer(e);
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(p.x - rect.left, p.y - rect.top);
      ctx.stroke();
    };

    // Detener trazo
    const stop = () => {
      drawing = false;
    };

    // Escuchar eventos pointer para compatibilidad con touch y mouse
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop, { once: false });

    // Botones para guardar, limpiar y cancelar
    const btnGuardar = document.createElement("button");
    btnGuardar.innerText = "Guardar Firma";
    Object.assign(btnGuardar.style, {
      padding: "10px 18px",
      background: "#16a34a",
      color: "#fff",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    });

    const btnLimpiar = document.createElement("button");
    btnLimpiar.innerText = "Limpiar";
    Object.assign(btnLimpiar.style, {
      padding: "10px 18px",
      background: "#f3f4f6",
      color: "#000",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.innerText = "Cancelar";
    Object.assign(btnCancelar.style, {
      padding: "10px 18px",
      background: "#ef4444",
      color: "#fff",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
    });

    // Guardar: crear preview y File a partir del canvas
    btnGuardar.onclick = () => {
      const firmaDataUrl = canvas.toDataURL("image/png");
      setFirmaPreview(firmaDataUrl);

      canvas.toBlob((blob) => {
        const file = new File([blob], `firma_${Date.now()}.png`, {
          type: "image/png",
        });
        setFirmaFile(file);
      }, "image/png");

      // Quitar listeners y cerrar modal
      canvas.removeEventListener("pointerdown", start);
      canvas.removeEventListener("pointermove", move);
      document.body.removeChild(modal);
    };

    // Limpiar el canvas
    btnLimpiar.onclick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Cancelar sin guardar
    btnCancelar.onclick = () => {
      document.body.removeChild(modal);
    };

    // Añadir botones al modal y mostrar
    const btns = document.createElement("div");
    Object.assign(btns.style, {
      display: "flex",
      gap: "10px",
      marginTop: "12px",
    });
    btns.appendChild(btnGuardar);
    btns.appendChild(btnLimpiar);
    btns.appendChild(btnCancelar);

    modal.appendChild(canvas);
    modal.appendChild(btns);
    document.body.appendChild(modal);
  };

  // ================================
  //   ENVIAR FORMULARIO (usa FormData para archivos)
  // ================================
  const handleSubmit = async () => {
    // Validaciones básicas antes de enviar al backend:
    // - campos obligatorios completados
    // - longitudes mínimas para CURP y RFC
    if (
      !form.nombre ||
      !form.apellidop ||
      !form.apellidom ||
      form.curp.length < 18 ||
      form.rfc.length < 12 ||
      !form.tipoPersona ||
      !form.nombreArea ||
      !form.numeroIdentificador ||
      !form.correo ||
      !form.puesto ||
      !form.esUsuarioInicial
    ) {
      alert(
        "Por favor completa correctamente todos los campos obligatorios (revisa CURP/RFC).",
      );
      return;
    }

    // Validación simple de formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(form.correo)) {
      alert("El correo no tiene formato válido.");
      return;
    }

    setLoading(true);
    setErrorCorreo("");

    try {
      const nssFinal =
        form.tipoPersona === "Docente" || form.tipoPersona === "Administrativo"
          ? form.numeroIdentificador
          : form.numeroSeguroSocial;

      // Construir FormData para incluir archivos y campos de texto
      const formData = new FormData();

      // Campos de texto
      formData.append("nombre", form.nombre);
      formData.append("apellidop", form.apellidop);
      formData.append("apellidom", form.apellidom);
      formData.append(
        "tipoIdentificador",
        form.tipoIdentificador === "control"
          ? "Numero de Control"
          : "Matricula",
      );
      formData.append("numeroIdentificador", form.numeroIdentificador);
      formData.append("rfc", form.rfc);
      formData.append("curp", form.curp);
      formData.append("puesto", form.puesto);
      formData.append("tipoPersona", form.tipoPersona);
      formData.append("nombreArea", form.nombreArea);
      formData.append("correo", form.correo);
      formData.append("id_rol", "3"); // rol por defecto (ejemplo)
      formData.append("numeroSeguroSocial", nssFinal);

      formData.append(
        "esUsuarioInicial",
        form.esUsuarioInicial === "Sí" ? "true" : "false",
      );

      // Archivos: sólo si existen (foto y firma)
      if (fotoFile) {
        formData.append("foto", fotoFile);
      }
      if (firmaFile) {
        formData.append("firma", firmaFile);
      }

      // Envío al endpoint de registro (backend corriendo en localhost:5000)
      const res = await fetch("https://credencialestesvg.com.mx/api/registro", {
        method: "POST",
        body: formData, // Enviar FormData para incluir archivos
      });
      const json = await res.json();

      // Manejo de errores HTTP
      if (!res.ok) {
        // Caso típico: correo ya existente (status 409)
        if (res.status === 409 && json.field === "correo") {
          setErrorCorreo(json.message);
          return;
        }
        alert(json.message || "Error al registrar usuario");
        return;
      }

      // Si todo fue OK, extraer contraseña generada y mostrar modal
      const pwd = extractPasswordFromJson(json) || "";
      setPasswordGenerada(pwd);
      setForm((prev) => ({ ...prev, contraseña: pwd }));
      setModalOpen(true);
    } catch (error) {
      // Errores de conexión o fetch fallido
      console.error("Error de conexión:", error);
      alert(
        "Error al conectar con el servidor. Verifica que el backend esté corriendo.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos utilizados por los componentes de vista previa
  const datosCredencial = {
    nombre: form.nombre,
    apPaterno: form.apellidop,
    apMaterno: form.apellidom,
    area: form.nombreArea,
    identificador: form.numeroIdentificador,
    nss: form.numeroSeguroSocial,   // 👈 nuevo
    tipoPersona: form.tipoPersona,
    rfc: form.rfc,
    curp: form.curp,
    foto: fotoPreview, // se usa preview (base64) para mostrar la imagen localmente
    firma: firmaPreview, // preview de la firma
  };

  return (
    <div className="w-full">
      {/* Botón regresar */}
      <div className="flex justify-start mb-6">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center gap-2 font-semibold"
        >
          <ArrowLeft size={18} /> Regresar
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* FORMULARIO - izquierda */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NOMBRE */}
          <div>
            <label className="font-medium">Nombre(s)</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${
                errors.nombre ? "border-red-500" : ""
              }`}
            />

            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* APELLIDO P */}
          <div>
            <label className="font-medium">Apellido Paterno</label>
            <input
              name="apellidop"
              value={form.apellidop}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${
                errors.apellidop ? "border-red-500" : ""
              }`}
            />

            {errors.apellidop && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidop}</p>
            )}
          </div>

          {/* APELLIDO M */}
          <div>
            <label className="font-medium">Apellido Materno</label>
            <input
              name="apellidom"
              value={form.apellidom}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${
                errors.apellidom ? "border-red-500" : ""
              }`}
            />

            {errors.apellidom && (
              <p className="text-red-500 text-sm mt-1">{errors.apellidom}</p>
            )}
          </div>

          {/* CURP */}
          <div>
            <label className="font-medium">CURP</label>
            <input
              name="curp"
              value={form.curp}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="18 caracteres"
            />
          </div>

          {/* RFC */}
          <div>
            <label className="font-medium" translate="no">
              RFC
              </label>
            <input
              translate="no"
              name="rfc"
              value={form.rfc}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="12-13 caracteres"
            />
          </div>

          {/* TIPO PERSONA */}
          <div>
            <label className="font-medium">Tipo</label>
            <select
              name="tipoPersona"
              value={form.tipoPersona}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione</option>
              <option value="Alumno">Alumno</option>
              <option value="Docente">Docente</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div>

          {/* AREA */}
          <div>
                <label className="font-medium">Área / Departamento</label>
                <select
                  name="nombreArea"
                  value={form.nombreArea}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Seleccione un área</option>
                  {AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
           </div>

          {/* TIPO IDENTIFICADOR */}
          <div className="col-span-2">
            <label className="font-medium block mb-1">
              Tipo de Identificador
            </label>

            <div className="flex gap-10">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoIdentificador"
                  value="control"
                  checked={form.tipoIdentificador === "control"}
                  onChange={handleChange}
                />
                Número de Control
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="tipoIdentificador"
                  value="matricula"
                  checked={form.tipoIdentificador === "matricula"}
                  onChange={handleChange}
                />
                Clave Issemym
              </label>
            </div>
          </div>

          {/* IDENTIFICADOR */}
          <div className="col-span-2">
            <label className="font-medium">Número de Identificador</label>
            <input
              name="numeroIdentificador"
              value={form.numeroIdentificador}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="Máx 11 caracteres"
            />
          </div>

          {/* NSS */}
          <div className="col-span-2">
            <label className="font-medium" translate="no">Número de Seguro Social</label>

            <input
              name="numeroSeguroSocial"
              value={
                // 🔁 Si es docente/admin usa el mismo identificador
                form.tipoPersona === "Docente" ||
                form.tipoPersona === "Administrativo"
                  ? form.numeroIdentificador
                  : form.numeroSeguroSocial
              }
              onChange={handleChange}
              className="border p-2 rounded w-full"
              placeholder="NSS"
              disabled={
                form.tipoPersona === "Docente" ||
                form.tipoPersona === "Administrativo"
              }
            />
          </div>

          {/* PUESTO */}
          <div>
            <label className="font-medium">Puesto</label>
            <input
              name="puesto"
              value={form.puesto}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* CORREO */}
          <div>
            <label className="font-medium">Correo</label>
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={(e) => {
                handleChange(e);
                setErrorCorreo(""); // limpia error al escribir
              }}
              className={`border p-2 rounded w-full ${
                errorCorreo ? "border-red-500" : ""
              }`}
            />

            {errorCorreo && (
              <p className="text-red-600 text-sm mt-1">{errorCorreo}</p>
            )}
          </div>

          {/* CONTRASEÑA (solo lectura) */}
          <div>
            <label className="font-medium">Contraseña (generada)</label>
            <input
              name="contraseña"
              value={form.contraseña}
              readOnly
              className="border p-2 rounded w-full bg-gray-100"
              placeholder="Se llenará al registrar"
            />
          </div>

          {/* ES USUARIO INICIAL */}
          <div>
            <label className="font-medium">Activo</label>
            <select
              name="esUsuarioInicial"
              value={form.esUsuarioInicial}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* BOTONES FOTO / FIRMA */}
          <div className="flex gap-4 col-span-2 mt-2">
            <button
              onClick={tomarFoto}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
              type="button"
            >
              <Camera size={20} /> Agregar Foto
            </button>

            <button
              onClick={abrirFirma}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
              type="button"
            >
              <PenLine size={20} /> Agregar Firma
            </button>
          </div>

          {/* PREVIEWS de foto y firma si existen */}
          {(fotoPreview || firmaPreview) && (
            <div className="col-span-2 flex flex-col sm:flex-row gap-4 mt-2">
              {fotoPreview ? (
                <div className="flex-1">
                  <p className="font-medium mb-1">Foto Capturada:</p>
                  <img
                    src={fotoPreview}
                    className="w-full max-w-xs h-40 object-cover rounded-lg shadow-lg"
                    alt="foto"
                  />
                </div>
              ) : null}

              {firmaPreview ? (
                <div className="flex-1">
                  <p className="font-medium mb-1">Firma Capturada:</p>
                  <img
                    src={firmaPreview}
                    className="w-full max-w-xs h-40 object-contain border shadow-md rounded"
                    alt="firma"
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* BOTÓN REGISTRO: deshabilitado si está cargando o formulario inválido */}
          <div className="col-span-2 mt-4">
            <button
              onClick={handleSubmit}
              //  BLOQUEO TOTAL DEL BOTÓN
              disabled={loading || !isFormValid()}
              // Tooltip UX
              title={
                !isFormValid() ? "Corrige los campos marcados en rojo" : ""
              }
              className={`w-full py-3 rounded-lg font-semibold transition
              ${
                loading || !isFormValid()
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            `}
            >
              {loading ? "Registrando..." : "Registrar Usuario"}
            </button>
          </div>
        </div>

        {/* VISTA PREVIA CREDENCIAL - derecha */}
        <div className="w-full lg:w-1/2">
          <h3 className="text-center font-semibold text-lg mb-4">
            Vista Previa de Credencial Digital
          </h3>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {/* Componentes que renderizan la credencial usando datosCredencial */}
            <CredencialFront datos={datosCredencial} />
            <CredencialBack datos={datosCredencial} />
          </div>
        </div>
      </div>

      {/* MODAL CONTRASEÑA: aparece cuando modalOpen es true */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-3">
              Usuario Registrado Correctamente
            </h2>

            <p className="mb-2">La contraseña generada es:</p>
            <p className="font-bold text-lg bg-gray-200 p-2 rounded break-words">
              {passwordGenerada}
            </p>

            <button
              onClick={() => {
                // Cerrar modal y resetear formulario
                setModalOpen(false);
                resetFormulario();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registro;
