<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambia esto según tu dominio
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verificar si el usuario está autenticado
    if (isset($_SESSION['nombre_usuario']) && isset($_SESSION['rol'])) {
        echo json_encode([
            "success" => true,
            "rol" => $_SESSION['rol']
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Usuario no autenticado o rol no definido."
        ]);
    }
    exit();
}

echo json_encode([
    "success" => false,
    "message" => "Método no permitido."
]);
exit();
?>
