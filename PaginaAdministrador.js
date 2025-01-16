import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/PaginaAdministrador.css'; // Importar estilos específicos

const menuItems = [
  { label: 'Administración de Usuarios', path: '/administracion_usuario' },
  { label: 'Historial de Ingresos', path: '/todos_los_datos' },
  { label: 'Visualización de Fiados', path: '/visualizacion_fiados' },
  { label: 'Ventas Realizadas', path: '/ventas_realizadas' },
  { label: 'Módulo de Ventas', path: '/modulo_ventas' },
  { label: 'Visualizar Facturas', path: '/visualizar_factura' },
  { label: 'Ingreso de Facturas', path: '/ingreso_facturas' },
  { label: 'Ingreso Manual de Ítems', path: '/ingreso_items' },
  { label: 'Control de Stock', path: '/stock_de_productos' },
  { label: 'Dashboard', path: '/dashboard' },
];

const PaginaAdministrador = () => {
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    navigate('/'); // Redirige al inicio de sesión
  };

  return (
    <div className="admin-page"> {/* Clase específica para esta página */}
      <header className="admin-header">
        <h1 className="admin-title">Página de Administrador</h1>
        <button className="cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
      </header>
      <main className="admin-menu">
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="menu-item"
            >
              {item.label}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PaginaAdministrador;
