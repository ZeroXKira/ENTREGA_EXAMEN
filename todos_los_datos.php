<?php
include('conexion.php');

// Configurar la respuesta como JSON
header('Content-Type: application/json');

// Configurar CORS para permitir solicitudes desde el frontend en localhost:3000
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambia el origen al del frontend
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true'); // Permitir enviar cookies/sesión

// Manejo de solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Consulta a la base de datos, ordenando por fecha_ingreso de manera descendente
$sql = "SELECT f.numero_factura, 
               IFNULL(p.nombre, 'Ingreso Manual') AS nombre_producto, 
               f.fecha_ingreso, 
               SUM(d.cantidad_inicial) AS cantidad_total
        FROM factura_boleta f
        LEFT JOIN factura_boleta_detalle d ON f.id_factura = d.id_factura
        LEFT JOIN producto p ON d.codigo_producto = p.codigo_producto
        GROUP BY f.numero_factura, p.nombre, f.fecha_ingreso
        ORDER BY f.fecha_ingreso DESC"; // Ordenar por fecha_ingreso descendente

$resultado = mysqli_query($enlace, $sql);

$facturas = [];
while ($fila = mysqli_fetch_assoc($resultado)) {
    $facturas[] = $fila;
}

// Enviar datos en formato JSON
echo json_encode($facturas);

// Cerrar conexión
mysqli_close($enlace);
?>
