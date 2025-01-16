import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/RegistroUsuario.css"; // Importa el CSS exclusivo para esta página

const RegistroUsuario = () => {
  const [usuario, setUsuario] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    rut: "",
    correo: "",
    nombre_usuario: "",
    contrasena: "",
    rol: "usuario",
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const registrarUsuario = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(usuario).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        "http://localhost/examen-react/backend/registro_usuario.php",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.success) {
        alert(data.message); // Mensaje de éxito
        navigate("/administracion_usuario"); // Redirigir a la página de administración
      } else {
        setMensaje(data.message || "Error al registrar usuario.");
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje("Ocurrió un error al procesar la solicitud.");
    }
  };

  return (
    <div className="registro-container"> {/* Clase única para el contenedor */}
      <header className="registro-header">
        <h1 className="registro-title">Registro de Usuario</h1>
        <button
          className="cerrar-sesion"
          onClick={() =>
            (window.location.href = "http://localhost/examen-react/backend/cerrar_sesion.php")
          }
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="registro-main">
        {mensaje && <p className="registro-mensaje">{mensaje}</p>}
        <form className="registro-form" onSubmit={registrarUsuario}>
          <label className="registro-label">
            Nombres:
            <input
              type="text"
              value={usuario.nombres}
              onChange={(e) =>
                setUsuario({ ...usuario, nombres: e.target.value })
              }
              required
            />
          </label>
          <label className="registro-label">
            Apellido Paterno:
            <input
              type="text"
              value={usuario.apellido_paterno}
              onChange={(e) =>
                setUsuario({ ...usuario, apellido_paterno: e.target.value })
              }
              required
            />
          </label>
          <label className="registro-label">
            Apellido Materno:
            <input
              type="text"
              value={usuario.apellido_materno}
              onChange={(e) =>
                setUsuario({ ...usuario, apellido_materno: e.target.value })
              }
            />
          </label>
          <label className="registro-label">
            RUT:
            <input
              type="text"
              value={usuario.rut}
              onChange={(e) => setUsuario({ ...usuario, rut: e.target.value })}
              required
            />
          </label>
          <label className="registro-label">
            Correo:
            <input
              type="email"
              value={usuario.correo}
              onChange={(e) =>
                setUsuario({ ...usuario, correo: e.target.value })
              }
              required
            />
          </label>
          <label className="registro-label">
            Nombre de Usuario:
            <input
              type="text"
              value={usuario.nombre_usuario}
              onChange={(e) =>
                setUsuario({ ...usuario, nombre_usuario: e.target.value })
              }
              required
            />
          </label>
          <label className="registro-label">
            Contraseña:
            <input
              type="password"
              value={usuario.contrasena}
              onChange={(e) =>
                setUsuario({ ...usuario, contrasena: e.target.value })
              }
              required
            />
          </label>
          <label className="registro-label">
            Rol:
            <select
              value={usuario.rol}
              onChange={(e) => setUsuario({ ...usuario, rol: e.target.value })}
              required
            >
              <option value="usuario">Usuario</option>
              <option value="administrador">Administrador</option>
            </select>
          </label>
          <div className="registro-buttons">
            <button className="registro-submit" type="submit">Registrar</button>
            <button
              className="registro-cancel"
              type="button"
              onClick={() => navigate("/administracion_usuario")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RegistroUsuario;
