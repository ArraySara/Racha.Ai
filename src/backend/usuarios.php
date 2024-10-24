<?php
include 'base.php';

header('Content-Type: application/json');

$conn = getConnection();
$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {
    case 'GET':
        if (isset($_GET['id'])) {
            getUsuarioPorId($conn, $_GET['id']);
        } else {
            getTodosUsuarios($conn);
        }
        break;

    case 'POST':
        if (isset($_POST['acao']) && $_POST['acao'] === 'login') {
            loginUsuario($conn, $_POST['email'], $_POST['senha']);
        } else {
            $id = $_POST['id'] ?? null;
            salvarUsuario($conn, $id, $_POST['nome'], $_POST['email'], $_POST['senha']);
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        if (isset($data['id'])) {
            removerUsuario($conn, $data['id']);
        } else {
            echo json_encode(['mensagem' => 'ID do usuário não fornecido']);
        }
        break;
}

mysqli_close($conn);

function getTodosUsuarios($conn)
{
    $query = "SELECT * FROM usuario";
    $resultado = mysqli_query($conn, $query);
    $usuarios = [];

    while ($linha = mysqli_fetch_assoc($resultado)) {
        $usuarios[] = $linha;
    }

    echo json_encode($usuarios);
}

function getUsuarioPorId($conn, $id)
{
    $query = "SELECT * FROM usuario WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $usuario = mysqli_fetch_assoc($resultado);
        echo json_encode($usuario);
    } else {
        echo json_encode(['mensagem' => 'Usuário não encontrado']);
    }
}

function salvarUsuario($conn, $id, $nome, $email, $senha)
{
    if ($id) {
        if (!empty($senha)) {
            $senhaCriptografada = password_hash($senha, PASSWORD_BCRYPT);
            $query = "UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?";
            $stmt = mysqli_prepare($conn, $query);
            mysqli_stmt_bind_param($stmt, 'sssi', $nome, $email, $senhaCriptografada, $id);
        } else {
            $query = "UPDATE usuario SET nome = ?, email = ? WHERE id = ?";
            $stmt = mysqli_prepare($conn, $query);
            mysqli_stmt_bind_param($stmt, 'ssi', $nome, $email, $id);
        }

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['mensagem' => 'Usuário atualizado com sucesso']);
        } else {
            echo json_encode(['mensagem' => 'Erro ao atualizar usuário']);
        }
    } else {
        $senhaCriptografada = password_hash($senha, PASSWORD_BCRYPT);
        $query = "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conn, $query);
        mysqli_stmt_bind_param($stmt, 'sss', $nome, $email, $senhaCriptografada);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['mensagem' => 'Usuário criado com sucesso']);
        } else {
            echo json_encode(['mensagem' => 'Erro ao criar usuário']);
        }
    }
}

function removerUsuario($conn, $id)
{
    $query = "DELETE FROM usuario WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, 'i', $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['mensagem' => 'Usuário removido com sucesso']);
    } else {
        echo json_encode(['mensagem' => 'Erro ao remover usuário']);
    }
}

function loginUsuario($conn, $email, $senha)
{
    $query = "SELECT * FROM usuario WHERE email = '$email'";
    $resultado = mysqli_query($conn, $query);

    if ($resultado && mysqli_num_rows($resultado) > 0) {
        $usuario = mysqli_fetch_assoc($resultado);

        $loginValido = password_verify($senha, $usuario['senha']) || $senha === $usuario['senha'];

        if ($loginValido) {
            echo json_encode(['mensagem' => 'Login bem-sucedido', 'usuario' => $usuario]);
            return;
        }

        echo json_encode(['mensagem' => 'Senha incorreta']);
    } else {
        echo json_encode(['mensagem' => 'Usuário não encontrado']);
    }
}
