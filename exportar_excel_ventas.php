<?php
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header("Content-Disposition: attachment; filename=ventas_realizadas.xls");
header("Pragma: no-cache");
header("Expires: 0");

// Incluir conexión a la base de datos
include('conexion.php');

// Consulta para obtener las ventas realizadas
$sql = "
    SELECT 
        v.fecha_hora AS fecha, 
        v.rut_cliente, 
        COALESCE(c.nombre_cliente, 'Venta Directa') AS cliente, 
        vd.codigo_producto, 
        p.nombre AS nombre_producto, 
        vd.cantidad, 
        vd.valor_neto,
        (vd.cantidad * vd.valor_neto) AS subtotal,
        ((vd.cantidad * vd.valor_neto) * 0.19) AS iva,
        ((vd.cantidad * vd.valor_neto) * 1.19) AS total
    FROM venta v
    LEFT JOIN clientes c ON v.rut_cliente = c.rut_cliente
    LEFT JOIN venta_detalle vd ON v.id_venta = vd.id_venta
    LEFT JOIN producto p ON vd.codigo_producto = p.codigo_producto
    ORDER BY v.fecha_hora DESC";

$resultado = mysqli_query($enlace, $sql);

if (!$resultado) {
    die("Error al generar el archivo Excel: " . mysqli_error($enlace));
}

// Encabezados de las columnas
echo "Fecha\tRUT Cliente\tNombre Cliente\tCódigo Producto\tNombre Producto\tCantidad\tValor Neto Unitario\tSubtotal\tIVA\tTotal\n";

// Procesar los datos de las ventas
while ($venta = mysqli_fetch_assoc($resultado)) {
    echo "{$venta['fecha']}\t" .
         "{$venta['rut_cliente']}\t" .
         "{$venta['cliente']}\t" .
         "{$venta['codigo_producto']}\t" .
         "{$venta['nombre_producto']}\t" .
         "{$venta['cantidad']}\t" .
         number_format($venta['valor_neto'], 2, '.', '') . "\t" .
         number_format($venta['subtotal'], 2, '.', '') . "\t" .
         number_format($venta['iva'], 2, '.', '') . "\t" .
         number_format($venta['total'], 2, '.', '') . "\n";
}

// Cerrar conexión con la base de datos
mysqli_close($enlace);
?>
