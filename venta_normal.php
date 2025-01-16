<?php
header('Content-Type: application/json'); // Configurar respuesta como JSON

// Configurar CORS
header('Access-Control-Allow-Origin: http://localhost:3000'); // Cambiar si el frontend está en otro dominio
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Métodos permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true'); // Permitir credenciales

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir el archivo de conexión a la base de datos
include('conexion.php');

// Iniciar sesión
session_start();
if (!isset($_SESSION['id_usuario'])) {
    $_SESSION['id_usuario'] = 1; // ID de usuario fijo para pruebas
}

// Verificar si el formulario fue enviado por método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['accion'])) {
        echo json_encode(['success' => false, 'message' => 'Acción no especificada.']);
        exit();
    }

    $accion = $_POST['accion'];

    try {
        // *** Buscar cliente por RUT ***
        if ($accion === 'buscarCliente') {
            $rutCliente = trim($_POST['rut_cliente']);
            $consultaCliente = "SELECT * FROM clientes WHERE rut_cliente = ?";
            $stmt = mysqli_prepare($enlace, $consultaCliente);
            mysqli_stmt_bind_param($stmt, 's', $rutCliente);
            mysqli_stmt_execute($stmt);
            $resultado = mysqli_stmt_get_result($stmt);

            if ($resultado && mysqli_num_rows($resultado) > 0) {
                $cliente = mysqli_fetch_assoc($resultado);
                echo json_encode(['success' => true, 'cliente' => $cliente]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Cliente no encontrado.']);
            }
            exit();
        }

        // *** Guardar cliente ingresado manualmente ***
        if ($accion === 'guardarCliente') {
            $rut = trim($_POST['rut_cliente']);
            $nombre = trim($_POST['nombre_cliente']);
            $correo = trim($_POST['correo_cliente']);
            $telefono = trim($_POST['telefono_cliente']);

            $verificarCliente = "SELECT COUNT(*) AS total FROM clientes WHERE rut_cliente = ?";
            $stmtVerificar = mysqli_prepare($enlace, $verificarCliente);
            mysqli_stmt_bind_param($stmtVerificar, 's', $rut);
            mysqli_stmt_execute($stmtVerificar);
            $resultado = mysqli_stmt_get_result($stmtVerificar);
            $existe = mysqli_fetch_assoc($resultado)['total'];

            if ($existe == 0) {
                $insertarCliente = "INSERT INTO clientes (rut_cliente, nombre_cliente, correo_cliente, telefono_cliente) VALUES (?, ?, ?, ?)";
                $stmtInsertar = mysqli_prepare($enlace, $insertarCliente);
                mysqli_stmt_bind_param($stmtInsertar, 'ssss', $rut, $nombre, $correo, $telefono);
                mysqli_stmt_execute($stmtInsertar);
                echo json_encode(['success' => true, 'message' => 'Cliente creado con éxito.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'El cliente ya existe.']);
            }
            exit();
        }

        // *** Agregar producto al carrito ***
        if ($accion === 'agregarProducto') {
            $codigoProducto = trim($_POST['codigo_producto']);
            $cantidad = (int)$_POST['cantidad'];

            $consultaProducto = "SELECT codigo_producto, nombre, valor_neto, stock FROM producto WHERE codigo_producto = ?";
            $stmtProducto = mysqli_prepare($enlace, $consultaProducto);
            mysqli_stmt_bind_param($stmtProducto, 's', $codigoProducto);
            mysqli_stmt_execute($stmtProducto);
            $resultado = mysqli_stmt_get_result($stmtProducto);

            if ($resultado && mysqli_num_rows($resultado) > 0) {
                $producto = mysqli_fetch_assoc($resultado);

                if ($cantidad <= $producto['stock']) {
                    echo json_encode(['success' => true, 'producto' => $producto, 'cantidad' => $cantidad]);
                } else {
                    echo json_encode(['success' => false, 'message' => "Stock insuficiente. Solo quedan {$producto['stock']} unidades."]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Código de producto no encontrado.']);
            }
            exit();
        }

        // *** Agregar producto a fiado ***
        if ($accion === 'agregarFiado') {
            $rutCliente = trim($_POST['rut_cliente']);
            $codigoProducto = trim($_POST['codigo_producto']);
            $cantidad = (int)$_POST['cantidad'];

            if (!$rutCliente || !$codigoProducto || $cantidad <= 0) {
                echo json_encode(['success' => false, 'message' => 'Datos insuficientes o inválidos.']);
                exit();
            }

            // Verificar cliente
            $consultaCliente = "SELECT id_cliente FROM clientes WHERE rut_cliente = ?";
            $stmtCliente = mysqli_prepare($enlace, $consultaCliente);
            mysqli_stmt_bind_param($stmtCliente, 's', $rutCliente);
            mysqli_stmt_execute($stmtCliente);
            $resultadoCliente = mysqli_stmt_get_result($stmtCliente);

            if ($resultadoCliente && mysqli_num_rows($resultadoCliente) > 0) {
                $cliente = mysqli_fetch_assoc($resultadoCliente);
                $idCliente = $cliente['id_cliente'];

                // Verificar producto
                $consultaProducto = "SELECT stock FROM producto WHERE codigo_producto = ?";
                $stmtProducto = mysqli_prepare($enlace, $consultaProducto);
                mysqli_stmt_bind_param($stmtProducto, 's', $codigoProducto);
                mysqli_stmt_execute($stmtProducto);
                $resultadoProducto = mysqli_stmt_get_result($stmtProducto);

                if ($resultadoProducto && mysqli_num_rows($resultadoProducto) > 0) {
                    $producto = mysqli_fetch_assoc($resultadoProducto);

                    if ($producto['stock'] >= $cantidad) {
                        // Insertar en fiado
                        $insertarFiado = "INSERT INTO fiado (id_cliente, codigo_producto, cantidad_fiada, estado_fiado) VALUES (?, ?, ?, 'al debe')";
                        $stmtFiado = mysqli_prepare($enlace, $insertarFiado);
                        mysqli_stmt_bind_param($stmtFiado, 'isi', $idCliente, $codigoProducto, $cantidad);
                        if (mysqli_stmt_execute($stmtFiado)) {
                            // Actualizar stock
                            $actualizarStock = "UPDATE producto SET stock = stock - ? WHERE codigo_producto = ?";
                            $stmtStock = mysqli_prepare($enlace, $actualizarStock);
                            mysqli_stmt_bind_param($stmtStock, 'is', $cantidad, $codigoProducto);
                            mysqli_stmt_execute($stmtStock);

                            echo json_encode(['success' => true, 'message' => 'Producto agregado a fiado correctamente.']);
                        } else {
                            echo json_encode(['success' => false, 'message' => 'Error al registrar el fiado.']);
                        }
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Stock insuficiente.']);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => 'Producto no encontrado.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Cliente no encontrado.']);
            }
            exit();
        }

        // *** Realizar el pago ***
        if ($accion === 'pagar') {
            $productos = json_decode($_POST['productos'], true);
            $rutCliente = trim($_POST['rut_cliente']);

            $consultaCliente = "SELECT id_cliente FROM clientes WHERE rut_cliente = ?";
            $stmtCliente = mysqli_prepare($enlace, $consultaCliente);
            mysqli_stmt_bind_param($stmtCliente, 's', $rutCliente);
            mysqli_stmt_execute($stmtCliente);
            $resultadoCliente = mysqli_stmt_get_result($stmtCliente);

            if ($resultadoCliente && mysqli_num_rows($resultadoCliente) > 0) {
                $cliente = mysqli_fetch_assoc($resultadoCliente);
                $idCliente = $cliente['id_cliente'];

                // Insertar venta
                $insertarVenta = "INSERT INTO venta (rut_cliente) VALUES (?)";
                $stmtVenta = mysqli_prepare($enlace, $insertarVenta);
                mysqli_stmt_bind_param($stmtVenta, 's', $rutCliente);
                mysqli_stmt_execute($stmtVenta);
                $idVenta = mysqli_insert_id($enlace);

                // Insertar productos en detalles de la venta
                foreach ($productos as $producto) {
                    $consultaProducto = "SELECT valor_neto FROM producto WHERE codigo_producto = ?";
                    $stmtProducto = mysqli_prepare($enlace, $consultaProducto);
                    mysqli_stmt_bind_param($stmtProducto, 's', $producto['codigo_producto']);
                    mysqli_stmt_execute($stmtProducto);
                    $resultadoProducto = mysqli_stmt_get_result($stmtProducto);

                    if ($resultadoProducto && mysqli_num_rows($resultadoProducto) > 0) {
                        $productoDB = mysqli_fetch_assoc($resultadoProducto);
                        $valorNeto = $productoDB['valor_neto'];

                        $insertarDetalle = "INSERT INTO venta_detalle (id_venta, codigo_producto, valor_neto, cantidad) VALUES (?, ?, ?, ?)";
                        $stmtDetalle = mysqli_prepare($enlace, $insertarDetalle);
                        mysqli_stmt_bind_param($stmtDetalle, 'isdi', $idVenta, $producto['codigo_producto'], $valorNeto, $producto['cantidad']);
                        mysqli_stmt_execute($stmtDetalle);

                        // Actualizar stock
                        $actualizarStock = "UPDATE producto SET stock = stock - ? WHERE codigo_producto = ?";
                        $stmtStock = mysqli_prepare($enlace, $actualizarStock);
                        mysqli_stmt_bind_param($stmtStock, 'is', $producto['cantidad'], $producto['codigo_producto']);
                        mysqli_stmt_execute($stmtStock);
                    }
                }

                echo json_encode(['success' => true, 'message' => 'Pago realizado con éxito y stock actualizado.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Cliente no encontrado.']);
            }
            exit();
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Solicitud no válida.']);
    exit();
}
