import React, { useState } from 'react';
import './css/Login.css'; // Importar los estilos únicos para este componente

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('nombre_usuario', nombreUsuario);
      formData.append('contrasena', contrasena);

      const response = await fetch('http://localhost/examen-react/backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud al servidor');
      }

      const result = await response.json();
      if (result.success) {
        if (result.redirect === 'pagina_administrador.html') {
          window.location.href = '/pagina_administrador';
        } else if (result.redirect === 'pagina_principal.html') {
          window.location.href = '/pagina_principal';
        }
      } else {
        setErrorMensaje(result.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMensaje('Ocurrió un error al intentar iniciar sesión. Inténtelo nuevamente.');
    }
  };

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch('http://localhost/examen-react/backend/cerrar_sesion.php', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }

      const result = await response.json();
      if (result.success) {
        window.location.href = '/';
      } else {
        setErrorMensaje('No se pudo cerrar la sesión correctamente.');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setErrorMensaje('Ocurrió un error al intentar cerrar la sesión.');
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Inicio de Sesión</h1>
      </header>
      <main className="login-main">
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="nombre_usuario">Nombre de Usuario:</label>
          <input
            type="text"
            id="nombre_usuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />

          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit">Iniciar Sesión</button>
        </form>
        {errorMensaje && <p className="login-error-message">{errorMensaje}</p>}
        {errorMensaje && (
          <button
            className="login-cerrar-sesion"
            onClick={handleCerrarSesion}
          >
            Cerrar Sesión
          </button>
        )}
      </main>
    </div>
  );
};

export default Login;
