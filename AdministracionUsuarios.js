import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/AdministracionUsuarios.css';

const AdministracionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios
  const [errorMensaje, setErrorMensaje] = useState(''); // Estado para mensajes de error
  const navigate = useNavigate(); // Hook para redirigir a otras rutas

  // Función para cargar usuarios desde el backend
  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost/examen-react/backend/administracion_usuario.php', {
        credentials: 'include', // Incluir credenciales como cookies
      });
      const data = await response.json();

      if (data.success) {
        setUsuarios(data.usuarios); // Actualizar la lista de usuarios
        setErrorMensaje(''); // Limpiar mensaje de error
      } else {
        setErrorMensaje(data.message || 'No autorizado');
        if (data.message === 'No autorizado') {
          navigate('/'); // Redirigir al login si no está autorizado
        }
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setErrorMensaje('Ocurrió un error al cargar los usuarios.');
    }
  };

  // Función para eliminar un usuario por su ID
  const eliminarUsuario = async (idUsuario) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este usuario?');
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost/examen-react/backend/eliminar_usuario.php?id_usuario=${idUsuario}`, {
        method: 'GET', // Solicitud de tipo GET para eliminar
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message); // Mostrar mensaje de éxito
        cargarUsuarios(); // Recargar la lista de usuarios
      } else {
        alert('Error: ' + result.message); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al intentar eliminar el usuario.');
    }
  };

  // Función para cerrar sesión del usuario actual
  const cerrarSesion = async () => {
    try {
      await fetch('http://localhost/examen-react/backend/cerrar_sesion.php', {
        method: 'GET', // Solicitud de tipo GET para cerrar sesión
        credentials: 'include', // Incluir credenciales
      });
      navigate('/'); // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Ocurrió un error al cerrar la sesión.');
    }
  };

  // useEffect para cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="admin-usuarios-container">
      <header className="admin-usuarios-header">
        <h1 className="admin-usuarios-title">Administración de Usuarios</h1>
        <button className="admin-usuarios-cerrar-sesion" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </header>
      <main>
        {errorMensaje ? (
          <p className="admin-usuarios-error-mensaje">{errorMensaje}</p>
        ) : (
          <>
            <div className="admin-usuarios-btn-container">
              <button
                className="admin-usuarios-agregar-btn"
                onClick={() => navigate('/registro_usuario')}
              >
                Agregar Usuario
              </button>
            </div>
            <table className="admin-usuarios-table">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>RUT</th>
                  <th>Correo</th>
                  <th>Nombre Usuario</th>
                  <th>Rol</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.nombres}</td>
                    <td>{usuario.apellido_paterno}</td>
                    <td>{usuario.apellido_materno || '-'}</td>
                    <td>{usuario.rut}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.nombre_usuario}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.fecha_creacion}</td>
                    <td>
                      <button
                        className="admin-usuarios-editar-btn"
                        onClick={() => navigate(`/editar_usuario/${usuario.id_usuario}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-usuarios-eliminar-btn"
                        onClick={() => eliminarUsuario(usuario.id_usuario)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
};

export default AdministracionUsuarios;
