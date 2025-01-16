<?php
// Incluir conexión a la base de datos
include('conexion.php');

// Configurar encabezado para devolver JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Permitir solicitudes de cualquier origen
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if (isset($_GET['rut'])) {
    $rut = trim($_GET['rut']);

    // Consulta para buscar datos de la empresa
    $sql = "SELECT * FROM empresas WHERE rut_empresa = ?";
    $stmt = $enlace->prepare($sql);
    $stmt->bind_param('s', $rut);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($empresa = $resultado->fetch_assoc()) {
        echo json_encode([
            'success' => true,
            'nombre_empresa' => $empresa['nombre_empresa'],
            'correo_empresa' => $empresa['correo_empresa'],
            'direccion_empresa' => $empresa['direccion_empresa'],
            'telefono_empresa' => $empresa['telefono_empresa'],
            'ciudad_empresa' => $empresa['ciudad_empresa']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Empresa no encontrada.'
        ]);
    }
    $stmt->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Falta el parámetro "rut".'
    ]);
}
$enlace->close();
