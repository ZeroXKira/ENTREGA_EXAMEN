<?php
session_start();
include('conexion.php');

// Configurar encabezados CORS
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar conexión
if (!$enlace) {
    header('Content-Type: application/json');
    echo json_encode(["success" => false, "message" => "Error en la conexión a la base de datos: " . mysqli_connect_error()]);
    exit();
}

// Obtener acción del cliente
$accion = $_POST['accion'] ?? 'listar';

// Listar fiados
if ($accion === 'listar') {
    $sql = "
    SELECT 
        f.id_fiado,
        c.rut_cliente,
        c.nombre_cliente,
        p.codigo_producto,
        p.nombre AS nombre_producto,
        p.valor_neto, -- Usamos 'valor_neto'
        f.cantidad_fiada,
        f.estado_fiado,
        f.fecha_fiado
    FROM fiado f
    LEFT JOIN producto p ON f.codigo_producto = p.codigo_producto
    LEFT JOIN clientes c ON f.id_cliente = c.id_cliente
    ORDER BY f.fecha_fiado DESC
    ";

    $resultado = mysqli_query($enlace, $sql);

    if (!$resultado) {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "Error en la consulta SQL: " . mysqli_error($enlace)]);
        exit();
    }

    $fiados = [];
    while ($fila = mysqli_fetch_assoc($resultado)) {
        $valor_neto = isset($fila['valor_neto'], $fila['cantidad_fiada']) 
            ? $fila['valor_neto'] * $fila['cantidad_fiada'] 
            : 0;
        $iva = $valor_neto * 0.19;
        $total = $valor_neto + $iva;

        $fila['valor_neto_total'] = $valor_neto;
        $fila['iva'] = $iva;
        $fila['total'] = $total;

        $fiados[] = $fila;
    }

    header('Content-Type: application/json');
    echo json_encode($fiados);
    mysqli_close($enlace);
    exit();
}

// Marcar como pagado y eliminar
if ($accion === 'marcarPagado') {
    $id_fiado = $_POST['id_fiado'] ?? null;

    if ($id_fiado) {
        $sql = "DELETE FROM fiado WHERE id_fiado = ?";
        $stmt = mysqli_prepare($enlace, $sql);
        mysqli_stmt_bind_param($stmt, 'i', $id_fiado);

        if (mysqli_stmt_execute($stmt)) {
            header('Content-Type: application/json');
            echo json_encode(["success" => true, "message" => "Fiado marcado como pagado y eliminado."]);
        } else {
            header('Content-Type: application/json');
            echo json_encode(["success" => false, "message" => "Error al eliminar el fiado: " . mysqli_error($enlace)]);
        }
    } else {
        header('Content-Type: application/json');
        echo json_encode(["success" => false, "message" => "ID del fiado no proporcionado."]);
    }

    mysqli_close($enlace);
    exit();
}
?>
