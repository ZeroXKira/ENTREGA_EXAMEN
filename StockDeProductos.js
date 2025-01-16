import React, { useEffect, useState } from 'react';
import './css/StockDeProductos.css'; // CSS exclusivo para esta página

const StockDeProductos = () => {
  const [productos, setProductos] = useState([]); // Estado para almacenar los productos
  const [errorMensaje, setErrorMensaje] = useState(''); // Estado para mensajes de error

  // Función para cargar los datos del stock desde el backend
  const cargarStock = async () => {
    try {
      const response = await fetch('http://localhost/examen-react/backend/stock_de_productos.php');
      const data = await response.json();

      if (data.error) {
        setErrorMensaje(data.error);
        setProductos([]);
      } else {
        setProductos(data);
        setErrorMensaje('');
      }
    } catch (error) {
      console.error('Error al cargar el stock:', error);
      setErrorMensaje('Ocurrió un error al cargar el stock.');
    }
  };

  // Función para exportar el stock a Excel
  const exportarExcel = () => {
    window.location.href = 'http://localhost/examen-react/backend/exportar_stock_productos.php';
  };

  // Cargar el stock al montar el componente
  useEffect(() => {
    cargarStock();
  }, []);

  return (
    <div className="stock-container">
      <header className="stock-header">
        <h1 className="stock-title">Control de Stock</h1>
        <button
          className="stock-cerrar-sesion"
          onClick={() => (window.location.href = 'http://localhost/examen-react/backend/cerrar_sesion.php')}
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="stock-main">
        {errorMensaje ? (
          <p className="stock-error-mensaje">{errorMensaje}</p>
        ) : (
          <>
            <table className="stock-tabla">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre del Producto</th>
                  <th>Valor Neto</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto, index) => (
                  <tr key={index}>
                    <td>{producto.codigo}</td>
                    <td>{producto.nombre_producto}</td>
                    <td>{producto.valor_neto}</td>
                    <td>{producto.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="stock-botones">
              <button className="stock-exportar" onClick={exportarExcel}>
                Exportar a Excel
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default StockDeProductos;
