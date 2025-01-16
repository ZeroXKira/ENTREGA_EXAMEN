<?php 
// Incluir el archivo de conexión
include('conexion.php');

// Configurar la respuesta como JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes desde cualquier origen (ajustar en producción)
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejo de solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar si se envió el parámetro 'id_usuario' en la URL
if (isset($_GET['id_usuario'])) {
    $id_usuario = intval($_GET['id_usuario']); // Asegurarse de que el ID sea un número válido

    try {
        // Verificar si el usuario existe en la base de datos
        $consultaVerificar = "SELECT * FROM usuarios WHERE id_usuario = ?";
        $stmtVerificar = $enlace->prepare($consultaVerificar);
        $stmtVerificar->bind_param("i", $id_usuario);
        $stmtVerificar->execute();
        $resultado = $stmtVerificar->get_result();

        if ($resultado->num_rows > 0) {
            // El usuario existe, proceder a eliminar
            $consultaEliminar = "DELETE FROM usuarios WHERE id_usuario = ?";
            $stmtEliminar = $enlace->prepare($consultaEliminar);
            $stmtEliminar->bind_param("i", $id_usuario);

            if ($stmtEliminar->execute()) {
                echo json_encode(['success' => true, 'message' => 'Usuario eliminado correctamente.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al eliminar el usuario: ' . $stmtEliminar->error]);
            }

            $stmtEliminar->close();
        } else {
            // El usuario no existe
            echo json_encode(['success' => false, 'message' => 'El usuario no existe o ya fue eliminado.']);
        }

        $stmtVerificar->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error inesperado: ' . $e->getMessage()]);
    }
} else {
    // No se especificó el ID del usuario
    echo json_encode(['success' => false, 'message' => 'ID de usuario no especificado.']);
}

// Cerrar la conexión
$enlace->close();
?>
