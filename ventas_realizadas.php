<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include('conexion.php');

// Consultar ventas realizadas con sus productos, ordenadas por fecha descendente
$sql = "
    SELECT 
        v.fecha_hora AS fecha, 
        v.rut_cliente, 
        COALESCE(c.nombre_cliente, 'Venta Directa') AS cliente, 
        vd.codigo_producto, 
        p.nombre AS nombre_producto, 
        vd.cantidad, 
        vd.valor_neto
    FROM venta v
    LEFT JOIN clientes c ON v.rut_cliente = c.rut_cliente
    LEFT JOIN venta_detalle vd ON v.id_venta = vd.id_venta
    LEFT JOIN producto p ON vd.codigo_producto = p.codigo_producto
    ORDER BY v.fecha_hora DESC"; // Orden por fecha descendente

$resultado = mysqli_query($enlace, $sql);

if (!$resultado) {
    echo json_encode(['success' => false, 'message' => 'Error al consultar las ventas.']);
    exit();
}

$ventas = [];
while ($row = mysqli_fetch_assoc($resultado)) {
    $ventas[] = [
        'fecha' => $row['fecha'],
        'rut_cliente' => $row['rut_cliente'],
        'cliente' => $row['cliente'],
        'codigo_producto' => $row['codigo_producto'],
        'nombre_producto' => $row['nombre_producto'],
        'cantidad' => (int) $row['cantidad'],
        'valor_neto' => (float) $row['valor_neto'],
    ];
}

echo json_encode(['success' => true, 'ventas' => $ventas]);
