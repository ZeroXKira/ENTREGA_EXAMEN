import React, { useState, useEffect } from "react";
import "./css/VentasRealizadas.css"; // CSS exclusivo para esta página

const VentasRealizadas = () => {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState("");

  // Cargar ventas desde el backend
  const cargarVentas = async () => {
    try {
      const response = await fetch("http://localhost/examen-react/backend/ventas_realizadas.php");
      if (!response.ok) {
        throw new Error("Error al cargar las ventas.");
      }
      const data = await response.json();
      setVentas(data.ventas || []);
    } catch (error) {
      console.error("Error al cargar las ventas:", error);
      setError("Error al cargar las ventas. Por favor, intenta nuevamente.");
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // Función para exportar ventas a Excel
  const exportarExcel = () => {
    window.location.href = "http://localhost/examen-react/backend/exportar_excel_ventas.php";
  };

  return (
    <div className="ventas-realizadas-container">
      <header className="ventas-realizadas-header">
        <h1 className="ventas-realizadas-title">Ventas Realizadas</h1>
        <button
          className="ventas-realizadas-cerrar-sesion"
          onClick={() => (window.location.href = "http://localhost/examen-react/backend/cerrar_sesion.php")}
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="ventas-realizadas-main">
        {error ? (
          <p className="ventas-realizadas-error">{error}</p>
        ) : (
          <>
            <table className="ventas-realizadas-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>RUT Cliente</th>
                  <th>Nombre Cliente</th>
                  <th>Código Producto</th>
                  <th>Nombre Producto</th>
                  <th>Cantidad</th>
                  <th>Valor Neto</th>
                  <th>IVA</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length > 0 ? (
                  ventas.map((venta, index) => {
                    const valorNeto = parseFloat(venta.valor_neto) || 0; 
                    const cantidad = parseFloat(venta.cantidad) || 0; 
                    const iva = valorNeto * cantidad * 0.19; 
                    const total = valorNeto * cantidad + iva; 

                    return (
                      <tr key={index}>
                        <td>{venta.fecha}</td>
                        <td>{venta.rut_cliente}</td>
                        <td>{venta.cliente}</td>
                        <td>{venta.codigo_producto}</td>
                        <td>{venta.nombre_producto}</td>
                        <td>{venta.cantidad}</td>
                        <td>${(valorNeto * cantidad).toFixed(2)}</td>
                        <td>${iva.toFixed(2)}</td>
                        <td>${total.toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9">No se encontraron ventas realizadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="ventas-realizadas-buttons">
              <button
                onClick={exportarExcel}
                className="ventas-realizadas-btn-excel"
              >
                Descargar Excel
              </button>
              <button
                onClick={() => window.history.back()}
                className="ventas-realizadas-btn-atras"
              >
                Atrás
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VentasRealizadas;
