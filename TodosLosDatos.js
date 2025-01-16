import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/TodosLosDatos.css'; // CSS exclusivo para esta página

const TodosLosDatos = () => {
  const [datos, setDatos] = useState([]); // Estado para almacenar los datos
  const [errorMensaje, setErrorMensaje] = useState(''); // Estado para mensajes de error
  const navigate = useNavigate(); // Hook para manejar la navegación

  // Función para cargar los datos desde el backend
  const cargarDatos = async () => {
    try {
      const response = await fetch('http://localhost/examen-react/backend/todos_los_datos.php', {
        credentials: 'include', // Incluye cookies de sesión
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setErrorMensaje(data.error);
        setDatos([]);
      } else {
        setDatos(data);
        setErrorMensaje('');
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      setErrorMensaje('Ocurrió un error al cargar los datos.');
    }
  };

  // Función para exportar los datos a Excel
  const exportarExcel = () => {
    window.location.href = 'http://localhost/examen-react/backend/exportar_todos_los_datos.php';
  };

  // Cargar los datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Función para cerrar sesión y redirigir al login
  const cerrarSesion = async () => {
    try {
      const response = await fetch('http://localhost/examen-react/backend/cerrar_sesion.php', {
        method: 'GET',
        credentials: 'include', // Incluye las cookies en la solicitud
      });

      if (response.ok) {
        navigate('/'); // Redirige al login
      } else {
        alert('Error al cerrar sesión. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un problema al cerrar sesión.');
    }
  };

  return (
    <div className="todos-datos-container">
      <header className="todos-datos-header">
        <h1 className="todos-datos-title">Historial de ingreso</h1>
        <button className="todos-datos-cerrar-sesion" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </header>
      <main className="todos-datos-main">
        {errorMensaje ? (
          <p className="todos-datos-error">{errorMensaje}</p>
        ) : (
          <>
            <div className="todos-datos-acciones">
              <button className="todos-datos-exportar" onClick={exportarExcel}>
                Exportar a Excel
              </button>
            </div>
            <table className="todos-datos-tabla">
              <thead>
                <tr>
                  <th>Número de Factura</th>
                  <th>Nombre del Producto</th>
                  <th>Fecha de Ingreso</th>
                  <th>Cantidad Total</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((factura, index) => (
                  <tr key={index}>
                    <td>{factura.numero_factura || 'Sin número'}</td>
                    <td>{factura.nombre_producto || 'Desconocido'}</td>
                    <td>{factura.fecha_ingreso || 'Sin fecha'}</td>
                    <td>{factura.cantidad_total || 0}</td>
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

export default TodosLosDatos;
