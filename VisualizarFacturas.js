import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/VisualizarFacturas.css"; // CSS exclusivo para esta página

const VisualizarFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");
  const navigate = useNavigate();

  // Función para cargar las facturas
  const cargarFacturas = async () => {
    try {
      const response = await fetch(
        "http://localhost/examen-react/backend/obtener_facturas.php"
      );
      const data = await response.json();

      if (data.success) {
        setFacturas(data.facturas);
        setErrorMensaje("");
      } else {
        setErrorMensaje(data.message || "Error al cargar las facturas.");
      }
    } catch (error) {
      console.error("Error al cargar las facturas:", error);
      setErrorMensaje("Ocurrió un error al cargar las facturas.");
    }
  };

  // Función para eliminar factura
  const eliminarFactura = async (numeroFactura) => {
    if (window.confirm("¿Estás seguro de eliminar esta factura?")) {
      try {
        const response = await fetch(
          `http://localhost/examen-react/backend/eliminar_factura.php?numero_factura=${numeroFactura}`,
          { method: "GET" }
        );
        const result = await response.json();

        if (result.success) {
          alert(result.message);
          cargarFacturas(); // Recargar la tabla
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error al eliminar la factura:", error);
        alert("Error al intentar eliminar la factura.");
      }
    }
  };

  // Navegar a los detalles de la factura
  const verDetalle = (numeroFactura) => {
    navigate(`/detalle_factura/${numeroFactura}`);
  };

  // Cargar facturas al montar el componente
  useEffect(() => {
    cargarFacturas();
  }, []);

  return (
    <div className="visualizar-facturas-container">
      <header className="visualizar-facturas-header">
        <h1>Visualizar Facturas / Boletas</h1>
        <button
          className="cerrar-sesion"
          onClick={() =>
            (window.location.href =
              "http://localhost/examen-react/backend/cerrar_sesion.php")
          }
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="visualizar-facturas-main">
        {errorMensaje && <p className="error-mensaje">{errorMensaje}</p>}
        <table className="visualizar-facturas-tabla">
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Fecha Ingreso</th>
              <th>Empresa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, index) => (
              <tr key={index}>
                <td>{factura.numero_factura}</td>
                <td>{factura.fecha_ingreso}</td>
                <td>{factura.nombre_empresa}</td>
                <td>
                  <button
                    className="detalle-btn"
                    onClick={() => verDetalle(factura.numero_factura)}
                  >
                    Detalle
                  </button>
                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarFactura(factura.numero_factura)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="atras-btn"
          onClick={() => navigate("/pagina_principal")}
        >
          Atrás
        </button>
      </main>
    </div>
  );
};

export default VisualizarFacturas;
