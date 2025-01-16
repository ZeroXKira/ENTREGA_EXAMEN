import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/ventaRapida.css';

const VentaRapida = () => {
  const [productos, setProductos] = useState([]);
  const [codigoProducto, setCodigoProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const navigate = useNavigate();

  // Agregar Producto al Carrito
  const agregarProducto = async () => {
    if (!codigoProducto.trim() || cantidad <= 0) {
      alert("Por favor, ingrese un código válido y una cantidad mayor a 0.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/examen-react/backend/venta_rapida.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            accion: "agregarProducto",
            codigo_producto: codigoProducto.trim(),
            cantidad: cantidad,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setProductos((prev) => {
          const productoExistente = prev.find(
            (p) => p.codigo_producto === data.producto.codigo_producto
          );
          if (productoExistente) {
            return prev.map((p) =>
              p.codigo_producto === data.producto.codigo_producto
                ? { ...p, cantidad: p.cantidad + cantidad }
                : p
            );
          } else {
            return [...prev, { ...data.producto, cantidad }];
          }
        });
        setCodigoProducto("");
        setCantidad(1);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Hubo un problema al agregar el producto.");
    }
  };

  // Eliminar Producto del Carrito
  const eliminarProducto = (index) => {
    setProductos((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Procesar Pago
  const pagar = async () => {
    if (productos.length === 0) {
      alert("No hay productos en el carrito para pagar.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/examen-react/backend/venta_rapida.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            accion: "pagar",
            productos: JSON.stringify(productos),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setProductos([]);
      } else {
        alert("Error al procesar el pago: " + data.message);
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Hubo un problema al procesar el pago.");
    }
  };

  // Calcular Totales
  const valorNetoTotal = productos.reduce((acc, p) => acc + (parseFloat(p.valor_neto) || 0) * p.cantidad, 0);
  const ivaTotal = valorNetoTotal * 0.19;
  const totalPagar = valorNetoTotal + ivaTotal;

  return (
    <div className="venta-rapida-container">
      <header className="venta-rapida-header">
        <h1>Venta Rápida</h1>
        <button
          className="venta-rapida-cerrar-sesion"
          onClick={() => navigate("/cerrar_sesion")}
        >
          Cerrar Sesión
        </button>
      </header>
      <main>
        <div className="venta-rapida-form-container">
          <label htmlFor="codigo_producto">Código del Producto:</label>
          <input
            type="text"
            id="codigo_producto"
            value={codigoProducto}
            onChange={(e) => setCodigoProducto(e.target.value)}
          />

          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value, 10)))}
          />

          <button type="button" onClick={agregarProducto}>
            Agregar Producto
          </button>
        </div>

        <div className="venta-rapida-tabla-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre Producto</th>
                <th>Valor Neto</th>
                <th>Valor + IVA</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => {
                const valorNeto = parseFloat(producto.valor_neto) || 0;
                return (
                  <tr key={index}>
                    <td>{producto.codigo_producto}</td>
                    <td>{producto.nombre}</td>
                    <td>${valorNeto.toFixed(2)}</td>
                    <td>${(valorNeto * 1.19).toFixed(2)}</td>
                    <td>{producto.cantidad}</td>
                    <td>${(valorNeto * producto.cantidad * 1.19).toFixed(2)}</td>
                    <td>
                      <button onClick={() => eliminarProducto(index)}>X</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="venta-rapida-totales">
            <p>Valor Neto Total: <span>${valorNetoTotal.toFixed(2)}</span></p>
            <p>IVA Total (19%): <span>${ivaTotal.toFixed(2)}</span></p>
            <p>Total a Pagar: <span>${totalPagar.toFixed(2)}</span></p>
          </div>

          <div className="venta-rapida-botones">
            <button onClick={pagar}>PAGAR</button>
            <button onClick={() => navigate("/modulo_ventas")}>Atrás</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VentaRapida;
