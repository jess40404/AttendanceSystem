<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit();
}

require_once 'server.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$name     = trim($data['name'] ?? '');
$email    = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = $data['password'] ?? '';

if (strlen($name) < 5) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name must be at least 5 characters long."]);
    exit();
}

if (!$email) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please enter a valid email address."]);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters long."]);
    exit();
}

$checkStmt = $conn->prepare("SELECT id FROM admins WHERE email = ?");
if (!$checkStmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Unable to prepare the signup request. Check that database.sql was imported."]);
    $conn->close();
    exit();
}
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "An account with this email already exists."]);
    $checkStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

$password_hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Unable to prepare the account request. Check that database.sql was imported."]);
    $conn->close();
    exit();
}
$stmt->bind_param("sss", $name, $email, $password_hash);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Account created successfully! You can now sign in."
    ]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to create account. Please try again later."]);
}

$stmt->close();
$conn->close();
?>