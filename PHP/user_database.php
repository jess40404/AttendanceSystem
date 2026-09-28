<?php
/** Opens the separate student-portal database after database_users.sql is imported. */
function openUserDatabase(): mysqli {
    $host = getenv('ATTENDANCE_DB_HOST') ?: '127.0.0.1';
    $user = getenv('ATTENDANCE_DB_USER') ?: 'root';
    $password = getenv('ATTENDANCE_DB_PASSWORD') ?: '';
    $port = (int)(getenv('ATTENDANCE_DB_PORT') ?: 3306);
    $conn = new mysqli($host, $user, $password, 'attendance_system_users', $port);
    if ($conn->connect_errno) {
        throw new RuntimeException('Unable to connect to attendance_system_users. Import database_users.sql in phpMyAdmin first.');
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
?>
