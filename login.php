<?php
session_start();
include('conexion.php');

// Configurar el encabezado para devolver JSON
header('Content-Type: application/json');

// Configurar CORS para React
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambia esto a tu dominio React
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre_usuario = mysqli_real_escape_string($enlace, trim($_POST['nombre_usuario']));
    $contrasena = trim($_POST['contrasena']);

    if (empty($nombre_usuario) || empty($contrasena)) {
        echo json_encode(["success" => false, "message" => "Por favor, complete todos los campos."]);
        exit();
    }

    $sql = "SELECT * FROM usuarios WHERE nombre_usuario = ?";
    $stmt = $enlace->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Error interno del servidor."]);
        exit();
    }

    $stmt->bind_param("s", $nombre_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();

        // Verificar contraseña
        if (password_verify($contrasena, $usuario['contrasena'])) {
            // Crear sesión para el usuario autenticado
            $_SESSION['nombre_usuario'] = $usuario['nombre_usuario'];
            $_SESSION['rol'] = $usuario['rol'];

            // Redirigir según el rol del usuario
            if ($usuario['rol'] === 'administrador') {
                echo json_encode(["success" => true, "redirect" => "pagina_administrador.html"]);
            } elseif ($usuario['rol'] === 'usuario') {
                echo json_encode(["success" => true, "redirect" => "pagina_principal.html"]);
            } else {
                echo json_encode(["success" => false, "message" => "Rol no reconocido."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Credenciales incorrectas."]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}

$enlace->close();
?>
