<?php
include 'base.php';

header('Content-Type: application/json');

$conn = getConnection();
$metodo = $_SERVER['REQUEST_METHOD'];

function listarEventos($conn)
{
    $fk_id_usuario = $_GET['fk_id_usuario'] ?? null;

    if (empty($fk_id_usuario)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'ID do usuário é obrigatório']);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM Evento WHERE fk_id_usuario = ?");
    $stmt->bind_param("i", $fk_id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $eventos = [];

    while ($linha = $resultado->fetch_assoc()) {
        $eventos[] = $linha;
    }

    echo json_encode($eventos);
    $stmt->close();
}

function obterEvento($conn)
{
    $eventoId = $_GET['eventoId'] ?? null;

    if (empty($eventoId)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Identificador do evento é obrigatório!']);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM Evento WHERE id = ?");
    $stmt->bind_param("i", $eventoId);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $evento = $resultado->fetch_assoc();
        echo json_encode($evento);
    } else {
        http_response_code(404);
        echo json_encode(['mensagem' => 'Evento não encontrado!']);
    }

    $stmt->close();
}

function adicionarEvento($conn)
{
    $nome = $_POST['nome'] ?? '';
    $endereco = $_POST['endereco'] ?? '';
    $data_evento = $_POST['data_evento'] ?? '';
    $fk_id_usuario = $_POST['fk_id_usuario'] ?? '';

    if (empty($fk_id_usuario)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Usuário criador não identificado!']);
        return;
    }

    if (empty($nome) || empty($data_evento)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Nome e/ou data do evento são obrigatórios!']);
        return;
    }

    $stmt = $conn->prepare("INSERT INTO Evento (nome, data_criacao, data_evento, endereco, tem_taxa_garcom, fk_id_usuario) VALUES (?, NOW(), ?, ?, 0, ?)");
    $stmt->bind_param("sssi", $nome, $data_evento, $endereco, $fk_id_usuario);

    if ($stmt->execute()) {
        $eventoId = $stmt->insert_id;
        echo json_encode(['mensagem' => 'Evento adicionado com sucesso!', 'eventoId' => $eventoId]);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao adicionar evento!']);
    }

    $stmt->close();
}

function deletarEvento($conn)
{
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['mensagem' => 'Falha ao identificar o evento!']);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM Evento WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['mensagem' => 'Evento deletado com sucesso!']);
    } else {
        http_response_code(500);
        echo json_encode(['mensagem' => 'Erro ao deletar evento!']);
    }

    $stmt->close();
}

switch ($metodo) {
    case 'GET':
        if (isset($_GET['eventoId'])) {
            obterEvento($conn);
        } else {
            listarEventos($conn);
        }
        break;
    case 'POST':
        adicionarEvento($conn);
        break;
    case 'DELETE':
        deletarEvento($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido!']);
        break;
}

mysqli_close($conn);
