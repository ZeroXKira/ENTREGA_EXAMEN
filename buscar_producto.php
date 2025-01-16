<?php
// Incluir conexión a la base de datos
include('conexion.php');

// Configurar encabezado para devolver JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Validar que el método sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo = trim($_POST['codigo_producto']); // Obtener el código del producto desde la solicitud

    // Validar el código
    if (empty($codigo)) {
        echo json_encode(['success' => false, 'message' => 'Código de producto requerido.']);
        exit();
    }

    try {
        // Buscar el producto por su código
        $sqlProducto = "SELECT codigo_producto, nombre AS nombre_producto, valor_neto FROM producto WHERE codigo_producto = ?";
        $stmtProducto = $enlace->prepare($sqlProducto);

        if (!$stmtProducto) {
            throw new Exception("Error al preparar la consulta: " . $enlace->error);
        }

        $stmtProducto->bind_param('s', $codigo); // Vincular el código del producto
        $stmtProducto->execute();
        $resultadoProducto = $stmtProducto->get_result();

        if ($resultadoProducto->num_rows > 0) {
            // Producto encontrado
            $producto = $resultadoProducto->fetch_assoc();
            echo json_encode(['success' => true, 'producto' => $producto]);
        } else {
            // Producto no encontrado
            echo json_encode(['success' => false, 'message' => 'Producto no encontrado.']);
        }
    } catch (Exception $e) {
        // Manejar errores y devolver un mensaje de error
        echo json_encode(['success' => false, 'message' => 'Error al buscar producto: ' . $e->getMessage()]);
    } finally {
        // Cerrar conexión a la base de datos
        $stmtProducto->close();
        $enlace->close();
    }
} else {
    // Responder con error si el método no es POST
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
