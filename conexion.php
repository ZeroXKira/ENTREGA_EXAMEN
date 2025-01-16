<?php
// Configuración de la conexión
$servidor = "localhost";
$usuario = "root";
$clave = ""; // Cambia esto si configuraste una contraseña en MySQL
$baseDeDatos = "base_de_datos"; // Cambia esto al nombre de tu base de datos

// Crear conexión
$enlace = mysqli_connect($servidor, $usuario, $clave, $baseDeDatos);

// Verificar conexión
if (!$enlace) {
    die(json_encode([
        'success' => false,
        'message' => 'Error al conectar a la base de datos: ' . mysqli_connect_error()
    ]));
}

// Establecer el conjunto de caracteres para evitar problemas con UTF-8
mysqli_set_charset($enlace, "utf8");
?>
