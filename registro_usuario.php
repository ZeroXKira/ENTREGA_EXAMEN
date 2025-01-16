<?php
include('conexion.php');

// Configurar el encabezado para devolver JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes desde cualquier origen
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejo de solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Procesar el formulario de registro de usuario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombres = trim($_POST['nombres']);
    $apellido_paterno = trim($_POST['apellido_paterno']);
    $apellido_materno = trim($_POST['apellido_materno']) ?: null; // Permitir null si está vacío
    $rut = trim($_POST['rut']);
    $correo = trim($_POST['correo']);
    $nombre_usuario = trim($_POST['nombre_usuario']);
    $contrasena = trim($_POST['contrasena']);
    $rol = trim($_POST['rol']);

    // Validar campos obligatorios
    if (empty($nombres) || empty($apellido_paterno) || empty($rut) || empty($correo) || empty($nombre_usuario) || empty($contrasena) || empty($rol)) {
        echo json_encode(["success" => false, "message" => "Todos los campos obligatorios deben ser completados."]);
        exit();
    }

    // Encriptar contraseña solo si el rol no es administrador
    $contrasena_encriptada = password_hash($contrasena, PASSWORD_DEFAULT);

    try {
        $sql = "INSERT INTO usuarios (nombres, apellido_paterno, apellido_materno, rut, correo, nombre_usuario, contrasena, rol, fecha_creacion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $enlace->prepare($sql);
        $stmt->bind_param('ssssssss', $nombres, $apellido_paterno, $apellido_materno, $rut, $correo, $nombre_usuario, $contrasena_encriptada, $rol);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Usuario registrado con éxito."]);
        } else {
            throw new Exception("Error al registrar el usuario: " . $stmt->error);
        }
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    } finally {
        $stmt->close();
        $enlace->close();
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
?>
