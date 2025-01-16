<?php
session_start();
include('conexion.php');

// Verificar conexión
if (!$enlace) {
    die("Error en la conexión: " . mysqli_connect_error());
}

// Consulta para obtener los datos de fiados
$sql = "
    SELECT 
        c.rut_cliente AS 'RUT Cliente',
        c.nombre_cliente AS 'Nombre Cliente',
        p.codigo_producto AS 'Código Producto',
        p.nombre AS 'Nombre Producto',
        p.valor_neto AS 'Valor Neto', -- Se incluye el valor neto del producto
        f.cantidad_fiada AS 'Cantidad',
        f.cantidad_fiada * p.valor_neto AS 'Valor Neto Total', -- Valor Neto Total
        (f.cantidad_fiada * p.valor_neto) * 0.19 AS 'IVA', -- IVA (19%)
        (f.cantidad_fiada * p.valor_neto) * 1.19 AS 'Total a Deber', -- Total (Valor Neto + IVA)
        f.estado_fiado AS 'Estado'
    FROM fiado f
    LEFT JOIN producto p ON f.codigo_producto = p.codigo_producto
    LEFT JOIN clientes c ON f.id_cliente = c.id_cliente
    ORDER BY f.id_fiado DESC
";

$resultado = mysqli_query($enlace, $sql);

// Verificar si hubo un error en la consulta
if (!$resultado) {
    die("Error en la consulta: " . mysqli_error($enlace));
}

// Crear archivo Excel
header("Content-Type: application/vnd.ms-excel");
header("Content-Disposition: attachment; filename=fiados.xls");

// Encabezados de las columnas
echo "RUT Cliente\tNombre Cliente\tCódigo Producto\tNombre Producto\tValor Neto\tCantidad\tValor Neto Total\tIVA\tTotal a Deber\tEstado\n";

// Agregar los datos al archivo Excel
while ($fila = mysqli_fetch_assoc($resultado)) {
    // Formatear valores numéricos
    $fila['Valor Neto Total'] = number_format($fila['Valor Neto Total'], 2, '.', '');
    $fila['IVA'] = number_format($fila['IVA'], 2, '.', '');
    $fila['Total a Deber'] = number_format($fila['Total a Deber'], 2, '.', '');

    echo implode("\t", $fila) . "\n";
}

// Cerrar conexión
mysqli_close($enlace);
?>
