<?php
mysqli_report(MYSQLI_REPORT_OFF);

$host = getenv('ATTENDANCE_DB_HOST') ?: '127.0.0.1';
$user = getenv('ATTENDANCE_DB_USER') ?: 'root';
$password = getenv('ATTENDANCE_DB_PASSWORD') ?: '';
$database = getenv('ATTENDANCE_DB_NAME') ?: 'attendance_system';
$port = (int)(getenv('ATTENDANCE_DB_PORT') ?: 3306);

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_errno) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to connect to the attendance database. Start MySQL in XAMPP and import database.sql.',
    ]);
    exit();
}

$conn->set_charset('utf8mb4');
?>