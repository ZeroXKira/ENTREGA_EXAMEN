<?php
include('conexion.php');

// Configurar los encabezados para exportar a Excel
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment; filename="todos_los_datos.xls"');
header('Pragma: no-cache');
header('Expires: 0');

// Consulta para obtener los datos de facturas y sus ítems
$sql = "SELECT f.numero_factura, 
               f.fecha_ingreso, 
               i.codigo_producto, 
               p.nombre AS nombre_producto, 
               i.cantidad_inicial AS cantidad, 
               p.valor_neto
        FROM factura_boleta f
        JOIN factura_boleta_detalle i ON f.id_factura = i.id_factura
        JOIN producto p ON i.codigo_producto = p.codigo_producto";
$resultado = mysqli_query($enlace, $sql);

if (!$resultado) {
    echo "Error en la consulta: " . mysqli_error($enlace);
    exit();
}

// Generar la tabla para exportar
echo "<table border='1'>";
echo "<tr>
        <th>Número de Factura</th>
        <th>Fecha de Ingreso</th>
        <th>Código</th>
        <th>Nombre del Producto</th>
        <th>Cantidad</th>
        <th>Valor Neto</th>
      </tr>";

// Rellenar la tabla con los datos obtenidos
while ($fila = mysqli_fetch_assoc($resultado)) {
    echo "<tr>
            <td>{$fila['numero_factura']}</td>
            <td>{$fila['fecha_ingreso']}</td>
            <td>{$fila['codigo_producto']}</td>
            <td>{$fila['nombre_producto']}</td>
            <td>{$fila['cantidad']}</td>
            <td>{$fila['valor_neto']}</td>
          </tr>";
}

echo "</table>";

// Cerrar la conexión
mysqli_close($enlace);
?>
