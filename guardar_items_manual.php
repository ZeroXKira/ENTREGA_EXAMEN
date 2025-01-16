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
    $codigo = trim($_POST['codigo']);
    $nombreProducto = trim($_POST['nombre_producto']);
    $valorNeto = trim($_POST['valor_neto']);
    $cantidad = trim($_POST['cantidad']);
    $numeroFactura = trim($_POST['numero_aleatorio']); // Número de factura generado

    // Validar campos requeridos
    if (empty($codigo) || empty($nombreProducto) || empty($valorNeto) || empty($cantidad)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
        exit();
    }

    if (!is_numeric($valorNeto) || $valorNeto <= 0 || !is_numeric($cantidad) || $cantidad <= 0) {
        echo json_encode(['success' => false, 'message' => 'Valores numéricos deben ser mayores a 0.']);
        exit();
    }

    try {
        // Iniciar transacción
        mysqli_begin_transaction($enlace);

        // Verificar si el producto ya existe
        $consultaProducto = "SELECT * FROM producto WHERE codigo_producto = ?";
        $stmtProducto = $enlace->prepare($consultaProducto);
        $stmtProducto->bind_param('s', $codigo);
        $stmtProducto->execute();
        $resultadoProducto = $stmtProducto->get_result();

        if ($resultadoProducto->num_rows > 0) {
            // Producto encontrado, actualizar stock
            $producto = $resultadoProducto->fetch_assoc();
            $sqlActualizar = "UPDATE producto SET stock = stock + ?, valor_neto = ? WHERE codigo_producto = ?";
            $stmtActualizar = $enlace->prepare($sqlActualizar);
            $stmtActualizar->bind_param('dis', $cantidad, $valorNeto, $codigo);
            $stmtActualizar->execute();
        } else {
            // Producto no encontrado, insertar nuevo producto
            $sqlInsertarProducto = "INSERT INTO producto (codigo_producto, nombre, valor_neto, stock) VALUES (?, ?, ?, ?)";
            $stmtInsertarProducto = $enlace->prepare($sqlInsertarProducto);
            $stmtInsertarProducto->bind_param('ssdi', $codigo, $nombreProducto, $valorNeto, $cantidad);
            $stmtInsertarProducto->execute();
        }

        // Insertar la factura en la tabla factura_boleta
        $sqlInsertarFactura = "INSERT INTO factura_boleta (numero_factura, rut_empresa, fecha_ingreso, tipo_documento, usuario) 
                               VALUES (?, '00000000-0', NOW(), 'manual', 'Sistema')";
        $stmtInsertarFactura = $enlace->prepare($sqlInsertarFactura);
        $stmtInsertarFactura->bind_param('s', $numeroFactura);
        $stmtInsertarFactura->execute();
        $idFactura = $enlace->insert_id;

        // Insertar el detalle en la tabla factura_boleta_detalle
        $sqlInsertarDetalle = "INSERT INTO factura_boleta_detalle (id_factura, codigo_producto, cantidad_inicial) VALUES (?, ?, ?)";
        $stmtInsertarDetalle = $enlace->prepare($sqlInsertarDetalle);
        $stmtInsertarDetalle->bind_param('isi', $idFactura, $codigo, $cantidad);
        $stmtInsertarDetalle->execute();

        // Confirmar la transacción
        mysqli_commit($enlace);

        echo json_encode(['success' => true, 'message' => 'Datos guardados exitosamente.']);
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        mysqli_rollback($enlace);
        echo json_encode(['success' => false, 'message' => 'Error al guardar los datos: ' . $e->getMessage()]);
    } finally {
        // Cerrar la conexión
        $enlace->close();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
