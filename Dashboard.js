import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import './css/Dashboard.css'; // Archivo CSS exclusivo para esta página

const Dashboard = () => {
  // Estado para almacenar los datos del dashboard y manejar errores
  const [datosDashboard, setDatosDashboard] = useState(null);
  const [error, setError] = useState("");

  // Objeto para almacenar las instancias de los gráficos
  const charts = {};

  useEffect(() => {
    // Función para cargar los datos del backend
    const cargarDatosDashboard = async () => {
      try {
        const response = await fetch("http://localhost/examen-react/backend/dashboard_datos.php", {
          credentials: "include", // Permitir envío de cookies/sesión
        });

        if (!response.ok) {
          throw new Error("Error al cargar los datos del Dashboard.");
        }

        const data = await response.json();
        setDatosDashboard(data); // Actualizar estado con los datos obtenidos
        setError(""); // Limpiar errores previos
        generarGraficos(data); // Generar los gráficos con los datos obtenidos
      } catch (error) {
        console.error("Error al cargar los datos del Dashboard:", error);
        setError("Ocurrió un problema al cargar los datos del Dashboard.");
      }
    };

    cargarDatosDashboard();

    // Limpiar gráficos al desmontar el componente
    return () => {
      Object.values(charts).forEach((chart) => chart.destroy());
    };
  }, []);

  // Función para generar los gráficos
  const generarGraficos = (data) => {
    if (data) {
      // Gráfico del producto más vendido
      const canvasId1 = "graficoMasVendido";
      if (charts[canvasId1]) charts[canvasId1].destroy(); // Destruir gráfico previo si existe
      const ctx1 = document.getElementById(canvasId1).getContext("2d");
      charts[canvasId1] = new Chart(ctx1, {
        type: "bar",
        data: {
          labels: [data.producto_mas_vendido?.nombre || "No disponible"], // Etiqueta del producto
          datasets: [
            {
              label: "Cantidad Vendida",
              data: [data.producto_mas_vendido?.total_vendido || 0], // Cantidad vendida
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true, // Escala comienza desde 0
            },
          },
        },
      });

      // Gráfico del producto más fiado
      const canvasId2 = "graficoMasFiado";
      if (charts[canvasId2]) charts[canvasId2].destroy(); // Destruir gráfico previo si existe
      const ctx2 = document.getElementById(canvasId2).getContext("2d");
      charts[canvasId2] = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: [data.producto_mas_fiado?.nombre || "No disponible"], // Etiqueta del producto
          datasets: [
            {
              label: "Cantidad Fiada",
              data: [data.producto_mas_fiado?.total_fiado || 0], // Cantidad fiada
              backgroundColor: "rgba(255, 159, 64, 0.6)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true, // Escala comienza desde 0
            },
          },
        },
      });

      // Gráfico de la persona que más fia
      const canvasId3 = "graficoPersonaMasFia";
      if (charts[canvasId3]) charts[canvasId3].destroy(); // Destruir gráfico previo si existe
      const ctx3 = document.getElementById(canvasId3).getContext("2d");
      charts[canvasId3] = new Chart(ctx3, {
        type: "doughnut",
        data: {
          labels: [data.persona_mas_fia?.nombre_cliente || "No disponible"], // Etiqueta de la persona
          datasets: [
            {
              label: "Cantidad de Fiados",
              data: [data.persona_mas_fia?.total_fiados || 0], // Cantidad de fiados
              backgroundColor: ["rgba(153, 102, 255, 0.6)"],
              borderColor: ["rgba(153, 102, 255, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button
          className="cerrar-sesion"
          onClick={() => (window.location.href = "http://localhost/examen-react/backend/cerrar_sesion.php")}
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="dashboard-main">
        {error ? (
          <p className="dashboard-error">{error}</p> // Mostrar mensaje de error si ocurre
        ) : (
          <div className="graficos-container">
            {/* Contenedores de gráficos */}
            <div className="grafico">
              <h3>Producto Más Vendido</h3>
              <canvas id="graficoMasVendido"></canvas>
            </div>
            <div className="grafico">
              <h3>Producto Más Fiado</h3>
              <canvas id="graficoMasFiado"></canvas>
            </div>
            <div className="grafico">
              <h3>Persona Que Más Fia</h3>
              <canvas id="graficoPersonaMasFia"></canvas>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
