<?php
session_start();

// Destruir todas las variables de sesión
session_unset();

// Destruir la sesión
session_destroy();

// Responder al frontend
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambiar según tu dominio
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

echo json_encode([
    "success" => true,
    "message" => "Sesión cerrada correctamente."
]);
exit();
?>