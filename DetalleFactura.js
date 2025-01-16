import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/DetalleFactura.css";

const DetalleFactura = () => {
  const { numeroFactura } = useParams(); // Obtiene el número de factura de la URL mediante parámetros
  const [empresa, setEmpresa] = useState({}); // Estado para almacenar los datos de la empresa
  const [items, setItems] = useState([]); // Estado para almacenar los ítems de la factura
  const [errorMensaje, setErrorMensaje] = useState(""); // Estado para manejar mensajes de error
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función para cargar el detalle de la factura desde el backend
  const cargarDetalle = async () => {
    try {
      // Realiza una solicitud al backend con el número de factura como parámetro
      const response = await fetch(
        `http://localhost/examen-react/backend/detalle_documento.php?numero_factura=${numeroFactura}`
      );

      // Verifica si la respuesta no es exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Convierte la respuesta a JSON

      if (data.success) {
        // Actualiza los estados con los datos obtenidos del backend
        setEmpresa(data.empresa); // Datos de la empresa
        setItems(data.items); // Ítems de la factura
        setErrorMensaje(""); // Limpia cualquier mensaje de error previo
      } else {
        // Muestra un mensaje de error si la respuesta no es exitosa
        setErrorMensaje(data.message || "No se pudo cargar el detalle.");
      }
    } catch (error) {
      console.error("Error al cargar el detalle:", error); // Muestra el error en la consola
      setErrorMensaje("Ocurrió un error al cargar el detalle."); // Actualiza el estado con el mensaje de error
    }
  };

  // Hook para cargar los datos al montar el componente
  useEffect(() => {
    cargarDetalle(); // Llama a la función para cargar los datos
  }, [numeroFactura]); // Ejecuta el efecto cuando el número de factura cambia

  return (
    <div className="detalle-factura-container">
      <header>
        <h1>Detalle del Documento</h1>
        {/* Botón para volver a la página anterior */}
        <button className="detalle-factura-volver" onClick={() => navigate("/visualizar_factura")}>
          Volver
        </button>
      </header>
      <main>
        {/* Muestra el mensaje de error si existe */}
        {errorMensaje && <p className="detalle-factura-error">{errorMensaje}</p>}
        <section className="info-documento">
          <h2>Información del Documento</h2>
          {/* Muestra la información de la empresa */}
          <p>
            <strong>Número de Factura:</strong> {empresa.numero_factura || "N/A"}
          </p>
          <p>
            <strong>Nombre de la Empresa:</strong> {empresa.nombre_empresa || "N/A"}
          </p>
          <p>
            <strong>Correo Electrónico:</strong> {empresa.correo_empresa || "N/A"}
          </p>
          <p>
            <strong>Dirección:</strong> {empresa.direccion_empresa || "N/A"}
          </p>
          <p>
            <strong>Teléfono:</strong> {empresa.telefono_empresa || "N/A"}
          </p>
          <p>
            <strong>Ciudad:</strong> {empresa.ciudad_empresa || "N/A"}
          </p>
          <p>
            <strong>Fecha de Ingreso:</strong> {empresa.fecha_ingreso || "N/A"}
          </p>
        </section>
        <section className="items-documento">
          <h2>Ítems del Documento</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Valor Neto</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {/* Renderiza los ítems de la factura o un mensaje si no hay ítems */}
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.codigo}</td>
                    <td>{item.nombre_producto}</td>
                    <td>{item.valor_neto}</td>
                    <td>{item.cantidad}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No hay ítems disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default DetalleFactura;
