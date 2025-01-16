import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/EditarUsuario.css";

const EditarUsuario = () => {
  const { id_usuario } = useParams();
  const [usuario, setUsuario] = useState({});
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const cargarUsuario = async () => {
    try {
      const response = await fetch(
        `http://localhost/examen-react/backend/editar_usuario.php?id_usuario=${id_usuario}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar el usuario.");
      }

      const data = await response.json();
      if (data.success) {
        setUsuario(data.usuario);
      } else {
        setMensaje(data.message || "Usuario no encontrado.");
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      setMensaje("Error al cargar el usuario.");
    }
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(usuario).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(
        `http://localhost/examen-react/backend/editar_usuario.php`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Error al guardar cambios.");
      }

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        navigate("/administracion_usuario");
      } else {
        alert(data.message || "Error al guardar cambios.");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("Error al guardar cambios.");
    }
  };

  useEffect(() => {
    cargarUsuario();
  }, [id_usuario]);

  return (
    <div className="editar-usuario-container">
      <header>
        <h1>Editar Usuario</h1>
      </header>
      <main>
        {mensaje && <p className="mensaje-error">{mensaje}</p>}
        <form onSubmit={guardarCambios} className="editar-usuario-form">
          <label>
            Nombres:
            <input
              type="text"
              value={usuario.nombres || ""}
              onChange={(e) => setUsuario({ ...usuario, nombres: e.target.value })}
              required
            />
          </label>
          <label>
            Apellido Paterno:
            <input
              type="text"
              value={usuario.apellido_paterno || ""}
              onChange={(e) =>
                setUsuario({ ...usuario, apellido_paterno: e.target.value })
              }
              required
            />
          </label>
          <label>
            Apellido Materno:
            <input
              type="text"
              value={usuario.apellido_materno || ""}
              onChange={(e) =>
                setUsuario({ ...usuario, apellido_materno: e.target.value })
              }
            />
          </label>
          <label>
            RUT:
            <input
              type="text"
              value={usuario.rut || ""}
              onChange={(e) => setUsuario({ ...usuario, rut: e.target.value })}
              required
            />
          </label>
          <label>
            Correo:
            <input
              type="email"
              value={usuario.correo || ""}
              onChange={(e) => setUsuario({ ...usuario, correo: e.target.value })}
              required
            />
          </label>
          <label>
            Nombre de Usuario:
            <input
              type="text"
              value={usuario.nombre_usuario || ""}
              onChange={(e) =>
                setUsuario({ ...usuario, nombre_usuario: e.target.value })
              }
              required
            />
          </label>
          <label>
            Rol:
            <select
              value={usuario.rol || ""}
              onChange={(e) => setUsuario({ ...usuario, rol: e.target.value })}
              required
            >
              <option value="usuario">Usuario</option>
              <option value="administrador">Administrador</option>
            </select>
          </label>
          <div className="editar-usuario-botones">
            <button type="submit" className="btn-guardar">Guardar Cambios</button>
            <button
              type="button"
              onClick={() => navigate("/administracion_usuario")}
              className="btn-cancelar"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditarUsuario;
