<?php
session_start();

// Conexión a la base de datos
include('conexion.php');

// Configurar encabezados para permitir CORS y responder en JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accion = $_POST['accion'] ?? null;

    if ($accion === 'agregarProducto') {
        $codigoProducto = $_POST['codigo_producto'] ?? '';
        $cantidad = (int) ($_POST['cantidad'] ?? 0);

        // Verificar si los datos están presentes
        if (empty($codigoProducto) || $cantidad <= 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Código de producto y cantidad válidos son requeridos.',
            ]);
            exit();
        }

        // Verificar si el producto existe en la base de datos
        $consultaProducto = "SELECT codigo_producto, nombre, valor_neto, stock FROM producto WHERE codigo_producto = ?";
        $stmt = $enlace->prepare($consultaProducto);
        $stmt->bind_param('s', $codigoProducto);
        $stmt->execute();
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            $producto = $resultado->fetch_assoc();

            // Verificar si hay suficiente stock
            if ($cantidad <= $producto['stock']) {
                echo json_encode([
                    'success' => true,
                    'producto' => $producto,
                    'cantidad' => $cantidad,
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => "Stock insuficiente. Solo quedan {$producto['stock']} unidades disponibles.",
                ]);
            }
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Producto no encontrado.',
            ]);
        }
        exit();
    } elseif ($accion === 'pagar') {
        $productos = json_decode($_POST['productos'], true);
        $rutCliente = '11111111-1'; // Cliente genérico fijo

        // Validar lista de productos
        if (empty($productos) || !is_array($productos)) {
            echo json_encode([
                'success' => false,
                'message' => 'No hay productos para procesar.',
            ]);
            exit();
        }

        // Verificar si el cliente genérico existe
        $consultaCliente = "SELECT rut_cliente FROM clientes WHERE rut_cliente = ?";
        $stmtCliente = $enlace->prepare($consultaCliente);
        $stmtCliente->bind_param('s', $rutCliente);
        $stmtCliente->execute();
        $resultadoCliente = $stmtCliente->get_result();

        if ($resultadoCliente->num_rows === 0) {
            // Insertar cliente genérico si no existe
            $insertarCliente = "INSERT INTO clientes (rut_cliente, nombre_cliente) VALUES (?, 'Cliente Genérico')";
            $stmtInsertarCliente = $enlace->prepare($insertarCliente);
            $stmtInsertarCliente->bind_param('s', $rutCliente);
            $stmtInsertarCliente->execute();
        }

        // Iniciar transacción
        $enlace->begin_transaction();

        try {
            // Insertar la venta
            $consultaVenta = "INSERT INTO venta (rut_cliente, rut_usuario) VALUES (?, NULL)";
            $stmtVenta = $enlace->prepare($consultaVenta);
            $stmtVenta->bind_param('s', $rutCliente);
            $stmtVenta->execute();
            $idVenta = $stmtVenta->insert_id;

            // Procesar los productos y registrar los detalles
            foreach ($productos as $producto) {
                $codigoProducto = $producto['codigo_producto'];
                $cantidadVendida = (int) $producto['cantidad'];
                $valorNeto = (float) $producto['valor_neto'];

                // Actualizar stock
                $consultaActualizarStock = "UPDATE producto SET stock = stock - ? WHERE codigo_producto = ?";
                $stmtStock = $enlace->prepare($consultaActualizarStock);
                $stmtStock->bind_param('is', $cantidadVendida, $codigoProducto);
                $stmtStock->execute();

                // Insertar en detalle de la venta
                $consultaDetalle = "INSERT INTO venta_detalle (id_venta, codigo_producto, valor_neto, cantidad) VALUES (?, ?, ?, ?)";
                $stmtDetalle = $enlace->prepare($consultaDetalle);
                $stmtDetalle->bind_param('isdi', $idVenta, $codigoProducto, $valorNeto, $cantidadVendida);
                $stmtDetalle->execute();
            }

            // Confirmar la transacción
            $enlace->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Pago realizado con éxito.',
            ]);
        } catch (Exception $e) {
            // Revertir transacción en caso de error
            $enlace->rollback();
            echo json_encode([
                'success' => false,
                'message' => 'Error al procesar el pago: ' . $e->getMessage(),
            ]);
        }
        exit();
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Acción no válida.',
        ]);
        exit();
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido.',
    ]);
}
?>
