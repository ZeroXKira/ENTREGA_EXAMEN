import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/IngresoManualItems.css'; // Importa el CSS exclusivo para esta página

const IngresoManualItems = () => {
  const [codigo, setCodigo] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [valorNeto, setValorNeto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [numeroAleatorio, setNumeroAleatorio] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  // Generar un número aleatorio al cargar la página
  useEffect(() => {
    setNumeroAleatorio(Math.floor(Math.random() * 1000000).toString());
  }, []);

  // Función para buscar un producto por su código
  const buscarProducto = async () => {
    if (!codigo) {
      alert('Por favor, ingrese un código.');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost/examen-react/backend/buscar_producto.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ codigo_producto: codigo }),
        }
      );
      const data = await response.json();

      if (data.success) {
        const producto = data.producto;
        setNombreProducto(producto.nombre_producto);
        setValorNeto(producto.valor_neto);
        setCantidad('');
      } else {
        alert('Producto no encontrado. Ingrese los datos manualmente.');
        setNombreProducto('');
        setValorNeto('');
      }
    } catch (error) {
      console.error('Error al buscar producto:', error);
      alert('Ocurrió un error al buscar el producto.');
    }
  };

  // Función para grabar los datos ingresados
  const grabarDatos = async () => {
    if (!codigo || !nombreProducto || !valorNeto || !cantidad) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost/examen-react/backend/guardar_items_manual.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            codigo,
            nombre_producto: nombreProducto,
            valor_neto: valorNeto,
            cantidad,
            numero_aleatorio: numeroAleatorio,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Datos guardados exitosamente.');
        setCodigo('');
        setNombreProducto('');
        setValorNeto('');
        setCantidad('');
        setNumeroAleatorio(Math.floor(Math.random() * 1000000).toString());
        setMensaje('Producto registrado correctamente.');
      } else {
        alert(data.message || 'No se pudo guardar el registro.');
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Ocurrió un error al guardar los datos.');
    }
  };

  return (
    <div className="ingreso-manual-container">
      <header className="ingreso-manual-header">
        <h1 className="ingreso-manual-title">Ingreso Manual de Ítems</h1>
        <button className="ingreso-manual-cerrar-sesion" onClick={() => navigate('/')}>
          Cerrar Sesión
        </button>
      </header>
      <main className="ingreso-manual-main">
        {mensaje && <p className="ingreso-manual-mensaje">{mensaje}</p>}
        <div className="ingreso-manual-form-container">
          <form>
            <div className="ingreso-manual-row">
              <label htmlFor="codigo">Código:</label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onBlur={buscarProducto}
                required
              />
            </div>
            <div className="ingreso-manual-row">
              <label htmlFor="nombre_producto">Nombre Producto:</label>
              <input
                type="text"
                id="nombre_producto"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                required
              />
            </div>
            <div className="ingreso-manual-row">
              <label htmlFor="valor_neto">Valor Neto (CLP):</label>
              <input
                type="number"
                id="valor_neto"
                value={valorNeto}
                onChange={(e) => setValorNeto(e.target.value)}
                required
              />
            </div>
            <div className="ingreso-manual-row">
              <label htmlFor="cantidad">Cantidad:</label>
              <input
                type="number"
                id="cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                required
              />
            </div>
          </form>
          <button className="ingreso-manual-atras" onClick={() => navigate('/pagina_principal')}>
            Atrás
          </button>
        </div>
        <div className="ingreso-manual-aleatorio-container">
          <label className="ingreso-manual-label">Número Aleatorio:</label>
          <div className="ingreso-manual-aleatorio">{numeroAleatorio}</div>
        </div>
        <button className="ingreso-manual-grabar" onClick={grabarDatos}>
          Grabar Datos
        </button>
      </main>
    </div>
  );
};

export default IngresoManualItems;
