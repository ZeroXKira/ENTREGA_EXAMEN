<?php
// Incluir conexión a la base de datos
include('conexion.php');

// Configurar encabezado para devolver JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes desde cualquier origen
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

try {
    // Consultar facturas y detalles
    $sql = "
        SELECT 
            fb.numero_factura,
            fb.fecha_ingreso,
            e.nombre_empresa
        FROM factura_boleta fb
        INNER JOIN empresas e ON fb.rut_empresa = e.rut_empresa
        ORDER BY fb.fecha_ingreso DESC
    ";

    $result = $enlace->query($sql);

    if (!$result) {
        throw new Exception("Error en la consulta: " . $enlace->error);
    }

    $facturas = [];
    while ($row = $result->fetch_assoc()) {
        $facturas[] = $row;
    }

    echo json_encode(['success' => true, 'facturas' => $facturas]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

// Cerrar conexión
$enlace->close();
?>
