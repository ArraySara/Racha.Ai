<?php
include 'base.php';

header('Content-Type: application/json');

$conn = getConnection();
$metodo = $_SERVER['REQUEST_METHOD'];

function listarProdutosComprados($conn)
{
    $id_pagante = $_GET['id_pagante'] ?? '';

    if (empty($id_pagante)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Pagante não identificado!']);
        return;
    }

    $stmt = $conn->prepare("
        SELECT nome, quantidade, preco, (quantidade * preco) AS total
        FROM produto_comprado
        WHERE id_pagante = ?
    ");
    $stmt->bind_param("i", $id_pagante);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $produtos = [];

    while ($linha = $resultado->fetch_assoc()) {
        $produtos[] = $linha;
    }

    echo json_encode($produtos);
    $stmt->close();
}

switch ($metodo) {
    case 'GET':
        listarProdutosComprados($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido!']);
        break;
}

mysqli_close($conn);
