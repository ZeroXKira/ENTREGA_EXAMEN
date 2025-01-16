import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ventaNormal.css"; // Importar el CSS exclusivo para esta página

const VentaNormal = () => {
  const [cliente, setCliente] = useState({ rut: "", nombre: "", correo: "", telefono: "" });
  const [productos, setProductos] = useState([]);
  const [codigoProducto, setCodigoProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const navigate = useNavigate();

  // -------------------------- Buscar cliente por RUT --------------------------
  const buscarCliente = async () => {
    if (!cliente.rut.trim()) {
      alert("Por favor, ingrese un RUT.");
      return;
    }
    try {
      const response = await fetch("http://localhost/examen-react/backend/venta_normal.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ accion: "buscarCliente", rut_cliente: cliente.rut }),
      });
      const data = await response.json();
      if (data.success) {
        setCliente({
          rut: cliente.rut,
          nombre: data.cliente.nombre_cliente,
          correo: data.cliente.correo_cliente,
          telefono: data.cliente.telefono_cliente,
        });
      } else {
        alert(data.message);
        setCliente((prev) => ({ ...prev, nombre: "", correo: "", telefono: "" }));
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      alert("Error en la comunicación con el servidor.");
    }
  };

  // -------------------------- Agregar cliente al sistema --------------------------
  const agregarCliente = async () => {
    const { rut, nombre, correo, telefono } = cliente;
    if (!rut || !nombre || !correo || !telefono) {
      alert("Complete todos los campos para agregar al cliente.");
      return;
    }
    try {
      const response = await fetch("http://localhost/examen-react/backend/venta_normal.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          accion: "guardarCliente",
          rut_cliente: rut,
          nombre_cliente: nombre,
          correo_cliente: correo,
          telefono_cliente: telefono,
        }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  // -------------------------- Agregar producto al carrito --------------------------
  const agregarProducto = async () => {
    if (!codigoProducto || cantidad <= 0) {
      alert("Ingrese un código y cantidad válidos.");
      return;
    }
    try {
      const response = await fetch("http://localhost/examen-react/backend/venta_normal.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ accion: "agregarProducto", codigo_producto: codigoProducto, cantidad }),
      });
      const data = await response.json();
      if (data.success) {
        setProductos((prev) => {
          const existente = prev.find((p) => p.codigo_producto === data.producto.codigo_producto);
          if (existente) {
            return prev.map((p) =>
              p.codigo_producto === existente.codigo_producto
                ? { ...p, cantidad: p.cantidad + cantidad }
                : p
            );
          } else {
            return [...prev, { ...data.producto, cantidad }];
          }
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // -------------------------- Agregar producto a Fiado --------------------------
  const agregarFiado = async (producto) => {
    if (!cliente.rut) {
      alert("Ingrese un cliente válido para agregar al fiado.");
      return;
    }
    try {
      const response = await fetch("http://localhost/examen-react/backend/venta_normal.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          accion: "agregarFiado",
          rut_cliente: cliente.rut,
          codigo_producto: producto.codigo_producto,
          cantidad: producto.cantidad,
        }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        setProductos((prev) => prev.filter((p) => p.codigo_producto !== producto.codigo_producto)); // Remover producto del carrito
      }
    } catch (error) {
      console.error("Error al agregar fiado:", error);
      alert("Error en la comunicación con el servidor al agregar fiado.");
    }
  };

  // -------------------------- Realizar pago --------------------------
  const pagar = async () => {
    if (!cliente.rut || productos.length === 0) {
      alert("Ingrese cliente y productos válidos.");
      return;
    }
    try {
      const response = await fetch("http://localhost/examen-react/backend/venta_normal.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          accion: "pagar",
          rut_cliente: cliente.rut,
          productos: JSON.stringify(productos),
        }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  return (
    <div className="venta-normal-container">
      {/* -------------------------- Encabezado -------------------------- */}
      <header>
        <h1>Venta Normal</h1>
      </header>

      {/* -------------------------- Sección de datos del cliente -------------------------- */}
      <main>
        <section>
          <label>RUT Cliente:</label>
          <input
            type="text"
            value={cliente.rut}
            onChange={(e) => setCliente((prev) => ({ ...prev, rut: e.target.value }))}
            onBlur={buscarCliente}
          />
          <label>Nombre:</label>
          <input
            type="text"
            value={cliente.nombre}
            onChange={(e) => setCliente((prev) => ({ ...prev, nombre: e.target.value }))}
          />
          <label>Correo:</label>
          <input
            type="text"
            value={cliente.correo}
            onChange={(e) => setCliente((prev) => ({ ...prev, correo: e.target.value }))}
          />
          <label>Teléfono:</label>
          <input
            type="text"
            value={cliente.telefono}
            onChange={(e) => setCliente((prev) => ({ ...prev, telefono: e.target.value }))}
          />
          <button onClick={agregarCliente}>Agregar Cliente</button>
        </section>

        {/* -------------------------- Sección de productos -------------------------- */}
        <section>
          <label>Código Producto:</label>
          <input type="text" value={codigoProducto} onChange={(e) => setCodigoProducto(e.target.value)} />
          <label>Cantidad:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
          <button onClick={agregarProducto}>Agregar Producto</button>
        </section>

        {/* -------------------------- Tabla de productos -------------------------- */}
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Total + IVA</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i}>
                <td>{p.codigo_producto}</td>
                <td>{p.nombre}</td>
                <td>{p.cantidad}</td>
                <td>${(p.valor_neto * 1.19 * p.cantidad).toFixed(2)}</td>
                <td>
                  <button onClick={() => setProductos((prev) => prev.filter((_, idx) => idx !== i))}>
                    Eliminar
                  </button>
                  <button onClick={() => agregarFiado(p)}>+ Fiado</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* -------------------------- Sección de acciones -------------------------- */}
        <section>
          <button onClick={pagar}>Pagar</button>
          <button onClick={() => navigate("/ventas_realizadas")}>Visualizar Ventas</button>
          <button onClick={() => navigate("/visualizacion_fiados")}>Visualizar Fiados</button>
          <button onClick={() => navigate("/pagina_principal")}>Atrás</button>
        </section>
      </main>
    </div>
  );
};

export default VentaNormal;
