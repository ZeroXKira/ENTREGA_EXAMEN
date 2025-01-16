<?php
session_start();

// Configurar encabezados CORS
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Verificar si el usuario está autenticado
if (!isset($_SESSION['nombre_usuario'])) {
    http_response_code(401); // Código de no autorizado
    echo json_encode(["success" => false, "message" => "No autorizado"]);
    exit();
}

// Si está autenticado, devolver éxito
http_response_code(200); // Código de éxito
echo json_encode(["success" => true, "message" => "Sesión activa"]);
