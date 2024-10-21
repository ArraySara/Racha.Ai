<?php
$servername = "db4free.net";
$username = "rachaai";
$password = "Racha@ai";
$dbname = "teste_rachaai";

function getConnection()
{
    global $servername, $username, $password, $dbname;

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verifica a conexão
    if ($conn->connect_error) {
        die("Falha na conexão: " . $conn->connect_error);
    }

    return $conn;
}
?>