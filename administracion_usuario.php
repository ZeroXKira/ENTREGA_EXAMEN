<?php
include('conexion.php'); // Asegúrate de incluir la conexión a la base de datos
header('Content-Type: application/json');

// Configuración CORS para React
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambia esto a la URL de tu frontend
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Consulta para obtener los usuarios
    $sql = "SELECT id_usuario, nombres, apellido_paterno, apellido_materno, rut, correo, nombre_usuario, rol, fecha_creacion FROM usuarios";
    $resultado = $enlace->query($sql);

    if (!$resultado) {
        throw new Exception("Error al obtener los usuarios: " . $enlace->error);
    }

    $usuarios = [];
    while ($fila = $resultado->fetch_assoc()) {
        $usuarios[] = $fila;
    }

    // Enviar los usuarios en formato JSON
    echo json_encode(["success" => true, "usuarios" => $usuarios]);
} catch (Exception $e) {
    // Manejo de errores
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} finally {
    $enlace->close();
}
?>
