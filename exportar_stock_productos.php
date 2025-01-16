<?php
include('conexion.php');

// Configurar la cabecera para forzar la descarga de un archivo Excel
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="stock_productos.xls"');
header('Cache-Control: max-age=0');

// Iniciar la salida del archivo Excel
echo "<table border='1'>";
echo "<tr>
        <th>Codigo</th>
        <th>Nombre del Producto</th>
        <th>Valor Neto</th>
        <th>Cantidad</th>
      </tr>";

$sql = "SELECT codigo_producto AS codigo, nombre AS nombre_producto, valor_neto, stock AS cantidad FROM producto";
$resultado = mysqli_query($enlace, $sql);

while ($fila = mysqli_fetch_assoc($resultado)) {
    echo "<tr>
            <td>{$fila['codigo']}</td>
            <td>{$fila['nombre_producto']}</td>
            <td>{$fila['valor_neto']}</td>
            <td>{$fila['cantidad']}</td>
          </tr>";
}

echo "</table>";

// Cerrar conexión
mysqli_close($enlace);
?>
