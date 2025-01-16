<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Incluir conexión
include('conexion.php');

// Verificar conexión
if (!isset($enlace) || !$enlace) {
    echo json_encode([
        "error" => "Error al conectar con la base de datos: Conexión no inicializada"
    ]);
    exit;
}

// Inicializar respuesta
$response = [
    "producto_mas_vendido" => null,
    "producto_mas_fiado" => null,
    "persona_mas_fia" => null,
];

try {
    // Producto más vendido
    $sqlVendido = "SELECT p.codigo_producto, p.nombre, SUM(vd.cantidad) as total_vendido
                   FROM venta_detalle vd
                   JOIN producto p ON vd.codigo_producto = p.codigo_producto
                   GROUP BY vd.codigo_producto
                   ORDER BY total_vendido DESC
                   LIMIT 1";
    $resultVendido = mysqli_query($enlace, $sqlVendido);
    if ($resultVendido && mysqli_num_rows($resultVendido) > 0) {
        $response["producto_mas_vendido"] = mysqli_fetch_assoc($resultVendido);
    }

    // Producto más fiado
    $sqlFiado = "SELECT p.codigo_producto, p.nombre, SUM(f.cantidad_fiada) as total_fiado
                 FROM fiado f
                 JOIN producto p ON f.codigo_producto = p.codigo_producto
                 GROUP BY f.codigo_producto
                 ORDER BY total_fiado DESC
                 LIMIT 1";
    $resultFiado = mysqli_query($enlace, $sqlFiado);
    if ($resultFiado && mysqli_num_rows($resultFiado) > 0) {
        $response["producto_mas_fiado"] = mysqli_fetch_assoc($resultFiado);
    }

    // Persona que más fia
    $sqlPersona = "SELECT c.id_cliente, c.nombre_cliente, COUNT(*) as total_fiados
                   FROM fiado f
                   JOIN clientes c ON f.id_cliente = c.id_cliente
                   GROUP BY c.id_cliente
                   ORDER BY total_fiados DESC
                   LIMIT 1";
    $resultPersona = mysqli_query($enlace, $sqlPersona);
    if ($resultPersona && mysqli_num_rows($resultPersona) > 0) {
        $response["persona_mas_fia"] = mysqli_fetch_assoc($resultPersona);
    }

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Error al obtener los datos del dashboard: " . $e->getMessage()
    ]);
}
?>
