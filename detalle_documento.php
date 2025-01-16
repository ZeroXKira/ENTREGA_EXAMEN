<?php
// Incluir conexión a la base de datos
include('conexion.php');

// Configurar encabezado para devolver JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Verificar si se proporciona el parámetro 'numero_factura'
if (isset($_GET['numero_factura'])) {
    $numeroFactura = trim($_GET['numero_factura']);

    try {
        // Obtener detalles de la factura y la empresa asociada
        $sqlFactura = "
            SELECT 
                f.numero_factura, 
                f.fecha_ingreso, 
                e.nombre_empresa, 
                e.correo_empresa, 
                e.direccion_empresa, 
                e.telefono_empresa, 
                e.ciudad_empresa
            FROM factura_boleta AS f
            INNER JOIN empresas AS e ON f.rut_empresa = e.rut_empresa
            WHERE f.numero_factura = ?
        ";
        $stmtFactura = $enlace->prepare($sqlFactura);
        if (!$stmtFactura) {
            throw new Exception("Error al preparar la consulta de detalles de la factura.");
        }
        $stmtFactura->bind_param('s', $numeroFactura);
        $stmtFactura->execute();
        $resultadoFactura = $stmtFactura->get_result();
        $empresa = $resultadoFactura->fetch_assoc();
        $stmtFactura->close();

        // Verificar si la factura existe
        if (!$empresa) {
            echo json_encode(['success' => false, 'message' => 'Factura no encontrada.']);
            exit();
        }

        // Obtener los ítems asociados a la factura
        $sqlItems = "
            SELECT 
                d.codigo_producto AS codigo, 
                p.nombre AS nombre_producto, 
                d.cantidad_inicial AS cantidad, 
                p.valor_neto AS valor_neto
            FROM factura_boleta_detalle AS d
            INNER JOIN producto AS p ON d.codigo_producto = p.codigo_producto
            WHERE d.id_factura = (
                SELECT id_factura FROM factura_boleta WHERE numero_factura = ?
            )
        ";
        $stmtItems = $enlace->prepare($sqlItems);
        if (!$stmtItems) {
            throw new Exception("Error al preparar la consulta de los ítems.");
        }
        $stmtItems->bind_param('s', $numeroFactura);
        $stmtItems->execute();
        $resultadoItems = $stmtItems->get_result();
        $items = $resultadoItems->fetch_all(MYSQLI_ASSOC);
        $stmtItems->close();

        // Devolver los datos como JSON
        echo json_encode(['success' => true, 'empresa' => $empresa, 'items' => $items]);
    } catch (Exception $e) {
        // Manejar errores y devolver un mensaje
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    } finally {
        $enlace->close();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Número de documento no proporcionado.']);
}
?>
