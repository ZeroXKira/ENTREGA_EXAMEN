import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/PaginaPrincipal.css"; // Importar el CSS exclusivo

const menuItems = [
  { label: "Módulo de Ventas", path: "/modulo_ventas" },
  { label: "Visualización de Fiados", path: "/visualizacion_fiados" },
  { label: "Ventas Realizadas", path: "/ventas_realizadas" },
  { label: "Visualizar Facturas", path: "/visualizar_factura" },
  { label: "Ingreso de Facturas", path: "/ingreso_facturas" },
  { label: "Ingreso Manual de Ítems", path: "/ingreso_items" },
  { label: "Control de Stock", path: "/stock_de_productos" },
  { label: "Visualizar Todos los Datos", path: "/todos_los_datos" },
  { label: "Dashboard", path: "/dashboard" },
];

const PaginaPrincipal = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    window.location.href = "http://localhost/examen-react/backend/cerrar_sesion.php";
  };

  return (
    <div className="pagina-principal">
      <header className="pagina-principal-header">
        <h1 className="pagina-principal-header-title">Página Principal</h1>
        <button
          className="pagina-principal-cerrar-sesion"
          onClick={handleCerrarSesion}
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="pagina-principal-menu-container">
        <div className="pagina-principal-menu-grid">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="pagina-principal-menu-button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PaginaPrincipal;
