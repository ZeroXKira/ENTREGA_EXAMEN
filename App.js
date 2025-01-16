import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importar componentes para cada página
import Login from "./Login";
import PaginaAdministrador from "./PaginaAdministrador";
import PaginaPrincipal from "./PaginaPrincipal";
import AdministracionUsuarios from "./AdministracionUsuarios";
import EditarUsuario from "./EditarUsuario";
import StockDeProductos from "./StockDeProductos";
import TodosLosDatos from "./TodosLosDatos";
import VisualizarFacturas from "./VisualizarFacturas";
import DetalleFactura from "./DetalleFactura";
import IngresoManualItems from "./IngresoManualItems";
import IngresoFacturas from "./IngresoFacturas";
import ModuloVentas from "./ModuloVentas";
import VentaRapida from "./VentaRapida";
import VentaNormal from "./VentaNormal";
import VentasRealizadas from "./VentasRealizadas";
import VisualizacionFiados from "./VisualizacionFiados";
import RegistroUsuario from './RegistroUsuario';
import Dashboard from './Dashboard'; // Importar el componente del Dashboard

// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de inicio: Página de Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas relacionadas con el administrador */}
        <Route path="/pagina_administrador" element={<PaginaAdministrador />} />
        <Route path="/administracion_usuario" element={<AdministracionUsuarios />} />
        <Route path="/editar_usuario/:id_usuario" element={<EditarUsuario />} />
        <Route path="/registro_usuario" element={<RegistroUsuario />} />

        {/* Ruta para el Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Ruta principal después de iniciar sesión */}
        <Route path="/pagina_principal" element={<PaginaPrincipal />} />

        {/* Rutas relacionadas con productos y facturas */}
        <Route path="/stock_de_productos" element={<StockDeProductos />} />
        <Route path="/todos_los_datos" element={<TodosLosDatos />} />
        <Route path="/visualizar_factura" element={<VisualizarFacturas />} />
        <Route path="/detalle_factura/:numeroFactura" element={<DetalleFactura />} />
        <Route path="/ingreso_items" element={<IngresoManualItems />} />
        <Route path="/ingreso_facturas" element={<IngresoFacturas />} />

        {/* Rutas del módulo de ventas */}
        <Route path="/modulo_ventas" element={<ModuloVentas />} />
        <Route path="/venta_rapida" element={<VentaRapida />} />
        <Route path="/venta_normal" element={<VentaNormal />} />

        {/* Rutas adicionales */}
        <Route path="/ventas_realizadas" element={<VentasRealizadas />} />
        <Route path="/visualizacion_fiados" element={<VisualizacionFiados />} />
      </Routes>
    </Router>
  );
}

export default App;
