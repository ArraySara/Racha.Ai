<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "racha_ai";

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