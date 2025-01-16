import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/ModuloVentas.css"; // Importar el CSS único para esta página

const ModuloVentas = () => {
  const navigate = useNavigate();

  return (
    <div className="modulo-ventas-container">
      <header className="modulo-ventas-header">
        <h1 className="modulo-ventas-title">Módulo de Ventas</h1>
        <button
          className="modulo-ventas-cerrar-sesion"
          onClick={() => navigate("/cerrar_sesion")}
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="modulo-ventas-menu">
        <button
          className="modulo-ventas-btn venta-rapida"
          onClick={() => navigate("/venta_rapida")}
        >
          Venta Rápida
        </button>
        <button
          className="modulo-ventas-btn venta-normal"
          onClick={() => navigate("/venta_normal")}
        >
          Venta Normal
        </button>
        <button
          className="modulo-ventas-btn atras"
          onClick={() => navigate("/pagina_principal")}
        >
          Atrás
        </button>
      </main>
    </div>
  );
};

export default ModuloVentas;
