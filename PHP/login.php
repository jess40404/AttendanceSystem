<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'server.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$email    = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

if (!$email || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email or missing credentials."]);
    exit();
}

$stmt = $conn->prepare("SELECT id, name, email, password_hash FROM admins WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Unable to prepare the login request. Check that database.sql was imported."]);
    $conn->close();
    exit();
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password_hash'])) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "id"    => $user['id'],
                "name"  => $user['name'],
                "email" => $user['email']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
    }
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
}

$stmt->close();
$conn->close();
?>