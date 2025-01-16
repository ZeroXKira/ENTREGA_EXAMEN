<?php
include('conexion.php');

// Configurar encabezados CORS
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambiar al origen correcto
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Procesar solicitudes GET y POST
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id_usuario = $_GET['id_usuario'] ?? null;
    if (!$id_usuario) {
        echo json_encode(["success" => false, "message" => "ID de usuario no proporcionado"]);
        exit();
    }

    // Consulta para obtener datos del usuario
    $sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
    $stmt = $enlace->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Error en la preparación de la consulta"]);
        exit();
    }

    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $usuario = $resultado->fetch_assoc();
        echo json_encode(["success" => true, "usuario" => $usuario]);
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    }

    $stmt->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_usuario = $_POST['id_usuario'] ?? null;
    $nombres = $_POST['nombres'] ?? null;
    $apellido_paterno = $_POST['apellido_paterno'] ?? null;
    $apellido_materno = $_POST['apellido_materno'] ?? null;
    $rut = $_POST['rut'] ?? null;
    $correo = $_POST['correo'] ?? null;
    $nombre_usuario = $_POST['nombre_usuario'] ?? null;
    $rol = $_POST['rol'] ?? null;

    if (!$id_usuario || !$nombres || !$apellido_paterno || !$rut || !$correo || !$nombre_usuario || !$rol) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
        exit();
    }

    // Actualizar usuario en la base de datos
    $sql = "UPDATE usuarios SET nombres = ?, apellido_paterno = ?, apellido_materno = ?, rut = ?, correo = ?, nombre_usuario = ?, rol = ? WHERE id_usuario = ?";
    $stmt = $enlace->prepare($sql);
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Error en la preparación de la consulta"]);
        exit();
    }

    $stmt->bind_param("sssssssi", $nombres, $apellido_paterno, $apellido_materno, $rut, $correo, $nombre_usuario, $rol, $id_usuario);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Usuario actualizado con éxito"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el usuario"]);
    }

    $stmt->close();
    exit();
}

// Cerrar conexión
mysqli_close($enlace);
?>
