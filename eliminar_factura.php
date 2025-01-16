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
        // Verificar si la factura existe
        $sqlVerificar = "SELECT id_factura FROM factura_boleta WHERE numero_factura = ?";
        $stmtVerificar = $enlace->prepare($sqlVerificar);
        $stmtVerificar->bind_param('s', $numeroFactura);
        $stmtVerificar->execute();
        $resultadoVerificar = $stmtVerificar->get_result();

        if ($resultadoVerificar->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Factura no encontrada.']);
            exit();
        }

        $factura = $resultadoVerificar->fetch_assoc();

        // Eliminar ítems asociados
        $sqlEliminarItems = "DELETE FROM factura_boleta_detalle WHERE id_factura = ?";
        $stmtEliminarItems = $enlace->prepare($sqlEliminarItems);
        $stmtEliminarItems->bind_param('i', $factura['id_factura']);
        $stmtEliminarItems->execute();
        $stmtEliminarItems->close();

        // Eliminar factura
        $sqlEliminarFactura = "DELETE FROM factura_boleta WHERE id_factura = ?";
        $stmtEliminarFactura = $enlace->prepare($sqlEliminarFactura);
        $stmtEliminarFactura->bind_param('i', $factura['id_factura']);
        if ($stmtEliminarFactura->execute()) {
            echo json_encode(['success' => true, 'message' => 'Factura eliminada correctamente.']);
        } else {
            throw new Exception("Error al eliminar la factura.");
        }
        $stmtEliminarFactura->close();
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    } finally {
        $enlace->close();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Número de factura no proporcionado.']);
}
?>
