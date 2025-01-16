<?php
// Incluir conexión a la base de datos
include('conexion.php');

// Configurar encabezado para devolver JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Permitir solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (isset($_GET['numero_factura'])) {
    $numeroFactura = trim($_GET['numero_factura']);

    // Consulta para verificar si la factura ya existe
    $sql = "SELECT COUNT(*) AS total FROM factura_boleta WHERE numero_factura = ?";
    $stmt = $enlace->prepare($sql);
    $stmt->bind_param('s', $numeroFactura);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $total = $resultado->fetch_assoc()['total'];

    echo json_encode([
        'existe' => $total > 0
    ]);
    $stmt->close();
} else {
    echo json_encode([
        'error' => true,
        'message' => 'No se proporcionó el número de factura.'
    ]);
}
$enlace->close();
