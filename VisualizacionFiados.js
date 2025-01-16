import React, { useState, useEffect } from "react";
import "./css/VisualizacionFiados.css"; // Archivo CSS exclusivo para esta página

const VisualizacionFiados = () => {
  const [fiados, setFiados] = useState([]);
  const [error, setError] = useState("");

  // Cargar fiados desde el backend
  const cargarFiados = async () => {
    try {
      const response = await fetch("http://localhost/examen-react/backend/visualizacion_fiados.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ accion: "listar" }),
      });
      if (!response.ok) {
        throw new Error("Error al cargar los fiados.");
      }
      const data = await response.json();
      setFiados(data);
    } catch (error) {
      console.error("Error al cargar los fiados:", error);
      setError("Error al cargar los fiados. Por favor, intenta nuevamente.");
    }
  };

  // Marcar como pagado
  const marcarPagado = async (id_fiado) => {
    try {
      const response = await fetch("http://localhost/examen-react/backend/visualizacion_fiados.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ accion: "marcarPagado", id_fiado }),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        cargarFiados(); // Recargar los datos después de marcar como pagado
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al marcar como pagado:", error);
    }
  };

  // Exportar datos a Excel
  const exportarExcel = () => {
    window.location.href = "http://localhost/examen-react/backend/exportar_excel_fiados.php";
  };

  useEffect(() => {
    cargarFiados();
  }, []);

  return (
    <div className="visualizacion-fiados-container">
      <header className="visualizacion-fiados-header">
        <h1 className="visualizacion-fiados-title">Visualización de Fiados</h1>
        <button
          className="visualizacion-fiados-cerrar-sesion"
          onClick={() => (window.location.href = "http://localhost/examen-react/backend/cerrar_sesion.php")}
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="visualizacion-fiados-main">
        {error ? (
          <p className="visualizacion-fiados-error">{error}</p>
        ) : (
          <table className="visualizacion-fiados-tabla">
            <thead>
              <tr>
                <th>RUT Cliente</th>
                <th>Nombre Cliente</th>
                <th>Código Producto</th>
                <th>Nombre Producto</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Fecha Fiado</th>
                <th>Valor Neto</th>
                <th>IVA</th>
                <th>Total a Deber</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fiados.length > 0 ? (
                fiados.map((fiado) => (
                  <tr key={fiado.id_fiado}>
                    <td>{fiado.rut_cliente || "N/A"}</td>
                    <td>{fiado.nombre_cliente || "N/A"}</td>
                    <td>{fiado.codigo_producto || "N/A"}</td>
                    <td>{fiado.nombre_producto || "N/A"}</td>
                    <td>{fiado.cantidad_fiada}</td>
                    <td>{fiado.estado_fiado}</td>
                    <td>{new Date(fiado.fecha_fiado).toLocaleString()}</td>
                    <td>${fiado.valor_neto_total?.toFixed(2) || "0.00"}</td>
                    <td>${fiado.iva?.toFixed(2) || "0.00"}</td>
                    <td>${fiado.total?.toFixed(2) || "0.00"}</td>
                    <td>
                      <button onClick={() => marcarPagado(fiado.id_fiado)} className="visualizacion-fiados-btn-pagado">
                        PAGADO
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11">No se encontraron fiados registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className="visualizacion-fiados-buttons">
          <button onClick={exportarExcel} className="visualizacion-fiados-btn-excel">
            Descargar Excel
          </button>
        </div>
      </main>
    </div>
  );
};

export default VisualizacionFiados;
