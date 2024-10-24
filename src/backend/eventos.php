<?php
include 'base.php';

header('Content-Type: application/json');

$conn = getConnection();
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo == 'GET') {
    $query = "SELECT * FROM Evento";
    $resultado = mysqli_query($conn, $query);
    $eventos = [];

    while ($linha = mysqli_fetch_assoc($resultado)) {
        $eventos[] = $linha;
    }

    echo json_encode($eventos);
}

if ($metodo == 'POST') {
    $nome = $_POST['nome'];
    $endereco = $_POST['endereco'];
    $data_evento = $_POST['data_evento'];
    $query = "INSERT INTO Evento (nome, data_criacao, data_evento, endereco, tem_taxa_garcom) VALUES ('$nome', NOW(), '$data_evento', '$endereco', 0)";
    mysqli_query($conn, $query);
    echo json_encode(['mensagem' => 'Evento adicionado com sucesso']);
}

if ($metodo == 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'];
    $query = "DELETE FROM Evento WHERE id = $id";
    mysqli_query($conn, $query);
    echo json_encode(['mensagem' => 'Evento deletado com sucesso']);
}

if ($metodo == 'PUT') {
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'];
    $nome = $data['nome'];
    $endereco = $data['endereco'];
    $data_evento = $data['data_evento'];
    $query = "UPDATE Evento SET nome = '$nome', endereco = '$endereco', data_evento = '$data_evento' WHERE id = $id";
    mysqli_query($conn, $query);
    echo json_encode(['mensagem' => 'Evento atualizado com sucesso']);
}

mysqli_close($conn);
?>