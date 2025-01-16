<?php
include('conexion.php');

// Configurar la respuesta como JSON
header('Content-Type: application/json');

// Configurar CORS para permitir solicitudes desde React
header('Access-Control-Allow-Origin: *'); // Cambia a tu origen correcto
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true'); // Permitir enviar cookies/sesión

// Manejo de solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Consultar todos los productos y su stock
    $sql = "SELECT codigo_producto AS codigo, nombre AS nombre_producto, valor_neto, stock AS cantidad FROM producto";
    $resultado = mysqli_query($enlace, $sql);

    if (!$resultado) {
        throw new Exception("Error en la consulta a la base de datos: " . mysqli_error($enlace));
    }

    $productos = [];
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $productos[] = $fila;
    }

    // Enviar datos en formato JSON
    echo json_encode($productos);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
} finally {
    // Cerrar conexión
    mysqli_close($enlace);
}
?>
