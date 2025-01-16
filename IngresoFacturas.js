import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/IngresoFactura.css"; // CSS exclusivo para esta página

const IngresoFactura = () => {
  const [numeroFactura, setNumeroFactura] = useState("");
  const [mensajeErrorFactura, setMensajeErrorFactura] = useState("");
  const [datosEmpresa, setDatosEmpresa] = useState({
    rut_empresa: "",
    nombre_empresa: "",
    correo_empresa: "",
    direccion_empresa: "",
    telefono_empresa: "",
    ciudad_empresa: "",
  });
  const [itemsFactura, setItemsFactura] = useState([
    { codigo: "", nombre_producto: "", valor_neto: "", cantidad: "" },
  ]);
  const [camposHabilitados, setCamposHabilitados] = useState(false);

  const navigate = useNavigate();

  // Verificar si el número de factura ya existe
  const verificarNumeroFactura = async () => {
    if (numeroFactura) {
      try {
        const response = await fetch(
          `http://localhost/examen-react/backend/verificar_factura.php?numero_factura=${numeroFactura}`
        );
        const data = await response.json();

        if (data.existe) {
          setMensajeErrorFactura("Factura o Boleta ya registrada.");
          setCamposHabilitados(false);
        } else {
          setMensajeErrorFactura("Número de factura disponible.");
          setCamposHabilitados(true);
        }
      } catch (error) {
        console.error("Error al verificar la factura:", error);
        setMensajeErrorFactura("Error al verificar el número de factura.");
        setCamposHabilitados(false);
      }
    }
  };

  // Cargar datos de la empresa según el RUT
  const cargarDatosEmpresa = async () => {
    const { rut_empresa } = datosEmpresa;
    if (rut_empresa) {
      try {
        const response = await fetch(
          `http://localhost/examen-react/backend/buscar_empresa.php?rut=${rut_empresa}`
        );
        const data = await response.json();

        if (data.success) {
          setDatosEmpresa((prev) => ({
            ...prev,
            nombre_empresa: data.nombre_empresa,
            correo_empresa: data.correo_empresa,
            direccion_empresa: data.direccion_empresa,
            telefono_empresa: data.telefono_empresa,
            ciudad_empresa: data.ciudad_empresa,
          }));
        } else {
          alert("La empresa no está registrada. Complete los datos manualmente.");
          setDatosEmpresa((prev) => ({
            ...prev,
            nombre_empresa: "",
            correo_empresa: "",
            direccion_empresa: "",
            telefono_empresa: "",
            ciudad_empresa: "",
          }));
        }
      } catch (error) {
        console.error("Error al cargar los datos de la empresa:", error);
        alert("Error al cargar los datos de la empresa.");
      }
    }
  };

  // Buscar producto por código y completar datos
  const buscarProducto = async (index, codigo) => {
    if (codigo) {
      try {
        const response = await fetch(
          `http://localhost/examen-react/backend/buscar_producto.php?codigo=${codigo}`
        );
        const data = await response.json();

        if (data.success) {
          setItemsFactura((prev) =>
            prev.map((item, idx) =>
              idx === index
                ? {
                    ...item,
                    nombre_producto: data.producto.nombre_producto,
                    valor_neto: data.producto.valor_neto,
                  }
                : item
            )
          );
        } else {
          alert("Producto no encontrado. Complete los datos manualmente.");
          setItemsFactura((prev) =>
            prev.map((item, idx) =>
              idx === index
                ? {
                    ...item,
                    nombre_producto: "",
                    valor_neto: "",
                  }
                : item
            )
          );
        }
      } catch (error) {
        console.error("Error al buscar el producto:", error);
        alert("Error al buscar el producto.");
      }
    }
  };

  // Agregar una nueva fila a la tabla de ítems
  const agregarFila = () => {
    setItemsFactura((prev) => [
      ...prev,
      { codigo: "", nombre_producto: "", valor_neto: "", cantidad: "" },
    ]);
  };

  // Manejar el envío del formulario
  const enviarFormulario = async (event) => {
    event.preventDefault();

    const payload = {
      numero_factura: numeroFactura,
      rut_empresa: datosEmpresa.rut_empresa,
      nombre_empresa: datosEmpresa.nombre_empresa,
      correo_empresa: datosEmpresa.correo_empresa,
      direccion_empresa: datosEmpresa.direccion_empresa,
      telefono_empresa: datosEmpresa.telefono_empresa,
      ciudad_empresa: datosEmpresa.ciudad_empresa,
      items: itemsFactura,
    };

    try {
      const response = await fetch(
        "http://localhost/examen-react/backend/ingreso_facturas.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();

      if (result.success) {
        alert("Factura y sus ítems se registraron correctamente.");
        setNumeroFactura("");
        setMensajeErrorFactura("");
        setDatosEmpresa({
          rut_empresa: "",
          nombre_empresa: "",
          correo_empresa: "",
          direccion_empresa: "",
          telefono_empresa: "",
          ciudad_empresa: "",
        });
        setItemsFactura([{ codigo: "", nombre_producto: "", valor_neto: "", cantidad: "" }]);
        setCamposHabilitados(false);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Error al registrar la factura.");
    }
  };

  return (
    <div className="ingreso-factura-container">
      <header className="ingreso-factura-header">
        <h1 className="ingreso-factura-title">Ingreso de Facturas / Boletas</h1>
        <button
          className="ingreso-factura-cerrar-sesion"
          onClick={() => navigate("/")}
        >
          Cerrar Sesión
        </button>
      </header>
      <main className="ingreso-factura-main">
        <form onSubmit={enviarFormulario}>
          <div className="form-container">
            <label htmlFor="numero_factura">N° de Factura/Boleta:</label>
            <input
              type="text"
              id="numero_factura"
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              onBlur={verificarNumeroFactura}
              required
            />
            <div className="mensaje-error-factura">
              {mensajeErrorFactura}
            </div>

            <h2>Datos de la Empresa</h2>
            {Object.keys(datosEmpresa).map((key, index) => (
              <div key={index}>
                <label htmlFor={key}>{key.replace("_", " ").toUpperCase()}:</label>
                <input
                  type={key === "correo_empresa" ? "email" : "text"}
                  id={key}
                  value={datosEmpresa[key]}
                  onChange={(e) =>
                    setDatosEmpresa((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  required
                  onBlur={key === "rut_empresa" ? cargarDatosEmpresa : undefined}
                  disabled={!camposHabilitados}
                />
              </div>
            ))}
          </div>

          <div className="tabla-facturas">
            <h2>Ítems de la Factura</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre Producto</th>
                  <th>Valor Neto</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {itemsFactura.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.codigo}
                        onChange={(e) =>
                          setItemsFactura((prev) =>
                            prev.map((el, idx) =>
                              idx === index
                                ? { ...el, codigo: e.target.value }
                                : el
                            )
                          )
                        }
                        onBlur={() => buscarProducto(index, item.codigo)}
                        required
                        disabled={!camposHabilitados}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.nombre_producto}
                        onChange={(e) =>
                          setItemsFactura((prev) =>
                            prev.map((el, idx) =>
                              idx === index
                                ? { ...el, nombre_producto: e.target.value }
                                : el
                            )
                          )
                        }
                        required
                        disabled={!camposHabilitados}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.valor_neto}
                        onChange={(e) =>
                          setItemsFactura((prev) =>
                            prev.map((el, idx) =>
                              idx === index
                                ? { ...el, valor_neto: e.target.value }
                                : el
                            )
                          )
                        }
                        required
                        disabled={!camposHabilitados}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) =>
                          setItemsFactura((prev) =>
                            prev.map((el, idx) =>
                              idx === index
                                ? { ...el, cantidad: e.target.value }
                                : el
                            )
                          )
                        }
                        required
                        disabled={!camposHabilitados}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="btn-agregar-fila"
              onClick={agregarFila}
              disabled={!camposHabilitados}
            >
              Agregar Ítem
            </button>
          </div>
          <div className="botones">
            <button
              type="submit"
              className="btn-grabar"
              disabled={!camposHabilitados}
            >
              Grabar Ingreso
            </button>
            <button
              type="button"
              className="btn-atras"
              onClick={() => navigate("/pagina_principal")}
            >
              Atrás
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default IngresoFactura;
