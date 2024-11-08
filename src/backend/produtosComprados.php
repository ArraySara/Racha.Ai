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
        SELECT id, nome, quantidade, preco, (quantidade * preco) AS total
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

function criarProduto($conn)
{
    $nome = $_POST['nome'] ?? '';
    $preco = $_POST['preco'] ?? 0;
    $quantidade = $_POST['quantidade'] ?? 0;
    $id_pagante = $_POST['id_pagante'] ?? '';

    if (empty($id_pagante) && $id_pagante < 0) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Pagante não identificado!']);
        return;
    }

    if (empty($nome) || $preco < 0 || $quantidade < 0) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Dados inválidos!']);
        return;
    }

    $stmt = $conn->prepare("
        INSERT INTO produto_comprado (nome, preco, quantidade, id_pagante)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("sdii", $nome, $preco, $quantidade, $id_pagante);
    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Produto criado com sucesso!', 'id' => $stmt->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao criar produto!']);
    }
    $stmt->close();
}

function editarProduto($conn)
{
    $id = $_POST['id'] ?? '';
    $nome = $_POST['nome'] ?? '';
    $preco = $_POST['preco'] ?? 0;
    $quantidade = $_POST['quantidade'] ?? 0;
    $id_pagante = $_POST['id_pagante'] ?? '';

    if (empty($id_pagante)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Pagante não identificado!']);
        return;
    }

    if (empty($id) || empty($nome) || $preco < 0 || $quantidade < 0) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Dados inválidos!']);
        return;
    }

    $stmt = $conn->prepare("
        UPDATE produto_comprado
        SET nome = ?, preco = ?, quantidade = ?, id_pagante = ?
        WHERE id = ?
    ");
    $stmt->bind_param("sdiii", $nome, $preco, $quantidade, $id_pagante, $id);
    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Produto editado com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao editar produto!']);
    }
    $stmt->close();
}

function removerProduto($conn)
{
    $id = $_POST['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Produto não identificado!']);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM produto_comprado WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Produto removido com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao remover produto!']);
    }
    $stmt->close();
}

function removerProdutosPorPagante($conn)
{
    $id_pagante = $_POST['id_pagante'] ?? '';

    if (empty($id_pagante)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Pagante não identificado!']);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM produto_comprado WHERE id_pagante = ?");
    $stmt->bind_param("i", $id_pagante);

    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Todos os produtos foram removidos com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao remover os produtos!']);
    }

    $stmt->close();
}

switch ($metodo) {
    case 'GET':
        listarProdutosComprados($conn);
        break;
    case 'POST':
        if (isset($_POST['acao'])) {
            switch ($_POST['acao']) {
                case 'criar':
                    criarProduto($conn);
                    break;
                case 'editar':
                    editarProduto($conn);
                    break;
                case 'remover':
                    removerProduto($conn);
                    break;
                case 'remover-por-pagante':
                    removerProdutosPorPagante($conn);
                    break;
                default:
                    http_response_code(400);
                    echo json_encode(['mensagem' => 'Ação não reconhecida!']);
                    break;
            }
        } else {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Ação não especificada!']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido!']);
        break;
}

mysqli_close($conn);
