import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import PaginaAdministrador from './PaginaAdministrador';
import PaginaPrincipal from './PaginaPrincipal';
import AdministracionUsuarios from './AdministracionUsuarios';
import PrivateRoute from './PrivateRoute'; // Importa el componente de rutas privadas

function App() {
  const [user, setUser] = useState(null); // Estado para almacenar la información del usuario

  // Simulación de autenticación: verifica si el usuario está autenticado
  const isAuthenticated = !!user; // Devuelve true si hay un usuario autenticado
  const isAdmin = user?.rol === 'administrador'; // Devuelve true si el usuario es administrador

  return (
    <Router>
      <Routes>
        {/* Ruta para el inicio de sesión */}
        <Route
          path="/"
          element={<Login setUser={setUser} />} // Pasa setUser para actualizar el usuario después del inicio de sesión
        />

        {/* Ruta protegida para la página del administrador */}
        <Route
          path="/pagina_administrador"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && isAdmin}>
              <PaginaAdministrador />
            </PrivateRoute>
          }
        />

        {/* Ruta protegida para la página principal (usuario regular) */}
        <Route
          path="/pagina_principal"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <PaginaPrincipal />
            </PrivateRoute>
          }
        />

        {/* Ruta protegida para la administración de usuarios */}
        <Route
          path="/administracion_usuario"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated && isAdmin}>
              <AdministracionUsuarios />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
