<?php
// Incluir archivo de conexión a la base de datos
include('conexion.php');

// Configurar encabezados para manejar CORS y devolver JSON
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes desde cualquier origen
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Encabezados permitidos
header('Content-Type: application/json'); // Tipo de contenido devuelto

// Verificar si el método es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer datos del cuerpo de la solicitud
    $data = json_decode(file_get_contents('php://input'), true);

    // Datos generales de la factura y la empresa
    $rutEmpresa = trim($data['rut_empresa']);
    $nombreEmpresa = trim($data['nombre_empresa']);
    $correoEmpresa = trim($data['correo_empresa']);
    $direccionEmpresa = trim($data['direccion_empresa']);
    $telefonoEmpresa = trim($data['telefono_empresa']);
    $ciudadEmpresa = trim($data['ciudad_empresa']);
    $numeroFactura = trim($data['numero_factura']);
    $items = $data['items']; // Ítems de la factura

    // Iniciar transacción para garantizar consistencia
    mysqli_begin_transaction($enlace);

    try {
        // Verificar si la factura ya existe
        $sqlVerificarFactura = "SELECT COUNT(*) AS total FROM factura_boleta WHERE numero_factura = ?";
        $stmtVerificarFactura = $enlace->prepare($sqlVerificarFactura);
        $stmtVerificarFactura->bind_param('s', $numeroFactura);
        $stmtVerificarFactura->execute();
        $resultadoVerificarFactura = $stmtVerificarFactura->get_result();
        $existeFactura = $resultadoVerificarFactura->fetch_assoc()['total'];
        $stmtVerificarFactura->close();

        if ($existeFactura > 0) {
            throw new Exception('La factura o boleta ya está registrada.');
        }

        // Verificar si la empresa ya está registrada
        $sqlVerificarEmpresa = "SELECT COUNT(*) AS total FROM empresas WHERE rut_empresa = ?";
        $stmtVerificarEmpresa = $enlace->prepare($sqlVerificarEmpresa);
        $stmtVerificarEmpresa->bind_param('s', $rutEmpresa);
        $stmtVerificarEmpresa->execute();
        $resultadoVerificarEmpresa = $stmtVerificarEmpresa->get_result();
        $existeEmpresa = $resultadoVerificarEmpresa->fetch_assoc()['total'];
        $stmtVerificarEmpresa->close();

        // Insertar empresa si no existe
        if ($existeEmpresa == 0) {
            $sqlInsertarEmpresa = "INSERT INTO empresas (rut_empresa, nombre_empresa, correo_empresa, direccion_empresa, telefono_empresa, ciudad_empresa, fecha_registro) 
                                   VALUES (?, ?, ?, ?, ?, ?, NOW())";
            $stmtInsertarEmpresa = $enlace->prepare($sqlInsertarEmpresa);
            $stmtInsertarEmpresa->bind_param('ssssss', $rutEmpresa, $nombreEmpresa, $correoEmpresa, $direccionEmpresa, $telefonoEmpresa, $ciudadEmpresa);
            $stmtInsertarEmpresa->execute();
            $stmtInsertarEmpresa->close();
        }

        // Insertar factura en la tabla `factura_boleta`
        $sqlInsertarFactura = "INSERT INTO factura_boleta (rut_empresa, numero_factura, fecha_ingreso) VALUES (?, ?, NOW())";
        $stmtInsertarFactura = $enlace->prepare($sqlInsertarFactura);
        $stmtInsertarFactura->bind_param('ss', $rutEmpresa, $numeroFactura);
        $stmtInsertarFactura->execute();
        $idFactura = $stmtInsertarFactura->insert_id; // Obtener ID de la factura
        $stmtInsertarFactura->close();

        // Procesar cada ítem y actualizar stock
        foreach ($items as $item) {
            // Verificar si el producto ya existe
            $sqlVerificarProducto = "SELECT COUNT(*) AS total FROM producto WHERE codigo_producto = ?";
            $stmtVerificarProducto = $enlace->prepare($sqlVerificarProducto);
            $stmtVerificarProducto->bind_param('s', $item['codigo']);
            $stmtVerificarProducto->execute();
            $resultadoVerificarProducto = $stmtVerificarProducto->get_result();
            $existeProducto = $resultadoVerificarProducto->fetch_assoc()['total'];
            $stmtVerificarProducto->close();

            // Insertar producto si no existe
            if ($existeProducto == 0) {
                $sqlInsertarProducto = "INSERT INTO producto (codigo_producto, nombre, valor_neto, stock) 
                                        VALUES (?, ?, ?, ?)";
                $stmtInsertarProducto = $enlace->prepare($sqlInsertarProducto);
                $stmtInsertarProducto->bind_param(
                    'ssdi', 
                    $item['codigo'], // Código del producto
                    $item['nombre_producto'], // Nombre del producto
                    $item['valor_neto'], // Valor neto
                    $item['cantidad'] // Stock inicial
                );
                $stmtInsertarProducto->execute();
                $stmtInsertarProducto->close();
            } else {
                // Si el producto existe, actualizar el stock
                $sqlActualizarStock = "UPDATE producto SET stock = stock + ? WHERE codigo_producto = ?";
                $stmtActualizarStock = $enlace->prepare($sqlActualizarStock);
                $stmtActualizarStock->bind_param(
                    'is', 
                    $item['cantidad'], // Cantidad a sumar
                    $item['codigo'] // Código del producto
                );
                $stmtActualizarStock->execute();
                $stmtActualizarStock->close();
            }

            // Insertar ítem en la tabla `factura_boleta_detalle`
            $sqlInsertarItem = "INSERT INTO factura_boleta_detalle (id_factura, codigo_producto, cantidad_inicial, fecha_ingreso) 
                                VALUES (?, ?, ?, NOW())";
            $stmtInsertarItem = $enlace->prepare($sqlInsertarItem);
            $stmtInsertarItem->bind_param(
                'isi', 
                $idFactura, // ID de la factura
                $item['codigo'], // Código del producto
                $item['cantidad'] // Cantidad del producto
            );
            $stmtInsertarItem->execute();
            $stmtInsertarItem->close();
        }

        // Confirmar la transacción
        mysqli_commit($enlace);

        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => 'Factura y sus ítems guardados correctamente.',
        ]);
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        mysqli_rollback($enlace);
        echo json_encode([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage(),
        ]);
    }
}

// Cerrar conexión con la base de datos
mysqli_close($enlace);
?>
