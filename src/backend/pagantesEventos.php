<?php
include 'base.php';

header('Content-Type: application/json');

$conn = getConnection();
$metodo = $_SERVER['REQUEST_METHOD'];

function adicionarPagantes($conn)
{
    $id_evento = $_POST['id_evento'] ?? '';
    $pagantes = $_POST['pagantes'] ?? '';

    if (empty($id_evento) || empty($pagantes)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Evento não identificado!']);
        return;
    }

    $listaPagantes = json_decode($pagantes, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Erro na decodificação do JSON: ' . json_last_error_msg()]);
        return;
    }

    if (!is_array($listaPagantes) || empty($listaPagantes)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Formato inválido para lista de pagantes!']);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO pagante_evento (nome, id_evento) VALUES (?, ?)");
    if ($stmt === false) {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro na preparação da consulta: ' . $conn->error]);
        return;
    }

    foreach ($listaPagantes as $pagante) {
        if (!isset($pagante['nome'])) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Nome do pagante não encontrado!']);
            return;
        }

        $nome = $pagante['nome'];
        if ($stmt->bind_param("si", $nome, $id_evento) === false) {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao vincular parâmetros: ' . $stmt->error]);
            return;
        }

        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao adicionar pagante: ' . $stmt->error]);
            $stmt->close();
            return;
        }
    }

    echo json_encode(['mensagem' => 'Pagantes adicionados com sucesso!']);
    $stmt->close();
}

function removerPagantePorId($conn)
{
    $id_pagante = $_POST['id_pagante'] ?? '';

    if (empty($id_pagante)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Falhou, pagante não identificado!']);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM pagante_evento WHERE id = ?");
    $stmt->bind_param("i", $id_pagante);

    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Pagante removido com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao remover pagante!']);
    }

    $stmt->close();
}

function removerPagantesPorEvento($conn)
{
    $id_evento = $_POST['id_evento'] ?? '';

    if (empty($id_evento)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Evento não identificado!']);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM pagante_evento WHERE id_evento = ?");
    $stmt->bind_param("i", $id_evento);

    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Todos os pagantes removidos com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao remover pagantes!']);
    }

    $stmt->close();
}

function listarPagantesPorEvento($conn)
{
    $id_evento = $_GET['id_evento'] ?? '';

    if (empty($id_evento)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Evento não identificado!']);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM pagante_evento WHERE id_evento = ?");
    $stmt->bind_param("i", $id_evento);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $pagantes = [];

    while ($linha = $resultado->fetch_assoc()) {
        $pagantes[] = $linha;
    }

    echo json_encode($pagantes);
    $stmt->close();
}

function editarNomePagante($conn)
{
    $id_pagante = $_POST['id_pagante'] ?? '';
    $novo_nome = $_POST['novo_nome'] ?? '';

    if (empty($id_pagante) || empty($novo_nome)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Pagante não identificado!']);
        return;
    }

    $stmt = $conn->prepare("UPDATE pagante_evento SET nome = ? WHERE id = ?");
    $stmt->bind_param("si", $novo_nome, $id_pagante);

    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Nome do pagante atualizado com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao atualizar o nome do pagante!']);
    }

    $stmt->close();
}

switch ($metodo) {
    case 'POST':
        if (isset($_POST['acao'])) {
            switch ($_POST['acao']) {
                case 'adicionar':
                    adicionarPagantes($conn);
                    break;
                case 'remover':
                    removerPagantePorId($conn);
                    break;
                case 'removerPorEvento':
                    removerPagantesPorEvento($conn);
                    break;
                case 'editar':
                    editarNomePagante($conn);
                    break;
                default:
                    http_response_code(400);
                    echo json_encode(['mensagem' => 'Ação inválida!']);
                    break;
            }
        }
        break;
    case 'GET':
        listarPagantesPorEvento($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido!']);
        break;
}

mysqli_close($conn);
