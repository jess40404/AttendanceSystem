<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit(); }
require_once 'server.php';
require_once 'user_database.php';

function body(): array { return json_decode(file_get_contents('php://input'), true) ?: []; }
function respond($data, int $status = 200): void { http_response_code($status); echo json_encode($data); exit(); }
function clean($value): string { return trim((string)($value ?? '')); }
function dateValue($value): string { return preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) ? $value : date('Y-m-d'); }
function hasTable(mysqli $connection, string $table): bool { $safe = $connection->real_escape_string($table); return $connection->query("SHOW TABLES LIKE '{$safe}'")->num_rows > 0; }

function mirrorUserStudent(array $student): int {
    $userConn = openUserDatabase();
    $stmt = $userConn->prepare('INSERT INTO students (admin_student_id, student_number, name, email, phone, class_code, year_level) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE student_number=VALUES(student_number), name=VALUES(name), email=VALUES(email), phone=VALUES(phone), class_code=VALUES(class_code), year_level=VALUES(year_level)');
    $stmt->bind_param('issssss', $student['id'], $student['studentNumber'], $student['name'], $student['email'], $student['phone'], $student['enrollment'], $student['year']);
    if (!$stmt->execute()) throw new RuntimeException('Unable to save the user profile database record.');
    $lookup = $userConn->prepare('SELECT id FROM students WHERE admin_student_id=?');
    $lookup->bind_param('i', $student['id']); $lookup->execute();
    $record = $lookup->get_result()->fetch_assoc(); $userConn->close();
    return (int)$record['id'];
}

function mirrorUserAttendance(int $adminStudentId, int $adminAttendanceId, int $adminSubjectId, string $classCode, string $subjectName, string $date, string $checkIn, string $status): void {
    $userConn = openUserDatabase();
    $lookup = $userConn->prepare('SELECT id FROM students WHERE admin_student_id=?');
    $lookup->bind_param('i', $adminStudentId); $lookup->execute(); $student = $lookup->get_result()->fetch_assoc();
    if (!$student) throw new RuntimeException('Student profile is missing from attendance_system_users. Save the student profile again.');
    $userStudentId = (int)$student['id'];
    $stmt = $userConn->prepare("INSERT INTO attendance (admin_attendance_id, student_id, admin_subject_id, class_code, subject_name, attendance_date, check_in_time, status, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'student-portal')");
    $stmt->bind_param('iiisssss', $adminAttendanceId, $userStudentId, $adminSubjectId, $classCode, $subjectName, $date, $checkIn, $status);
    if (!$stmt->execute()) throw new RuntimeException('Unable to save the user attendance record.');
    $userAttendanceId = $userConn->insert_id;
    $log = $userConn->prepare("INSERT INTO attendance_logs (attendance_id, student_id, scanned_at, status, source) VALUES (?, ?, ?, ?, 'student-portal')");
    $log->bind_param('iiss', $userAttendanceId, $userStudentId, $checkIn, $status); $log->execute();
    $userConn->close();
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($action === 'students') {
        if ($method === 'GET') {
            $search = '%' . clean($_GET['search'] ?? '') . '%';
            $stmt = $conn->prepare('SELECT id, student_number AS studentNumber, name, email, phone, class_code AS enrollment, year_level AS year FROM students WHERE name LIKE ? OR email LIKE ? OR student_number LIKE ? OR class_code LIKE ? ORDER BY name');
            $stmt->bind_param('ssss', $search, $search, $search, $search); $stmt->execute();
            respond(['status' => 'success', 'students' => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
        }
        $data = body();
        if ($method === 'POST') {
            $stmt = $conn->prepare('INSERT INTO students (student_number, name, email, phone, class_code, year_level) VALUES (?, ?, ?, ?, ?, ?)');
            $studentNumber = clean($data['studentNumber'] ?? ('2026-' . random_int(1000, 9999)));
            $stmt->bind_param('ssssss', $studentNumber, $data['name'], $data['email'], $data['phone'], $data['enrollment'], $data['year']);
            if (!$stmt->execute()) respond(['status'=>'error','message'=>'Unable to add student. Email or student number may already exist.'], 409);
            respond(['status'=>'success','message'=>'Student added successfully.'], 201);
        }
        $id = (int)($_GET['id'] ?? $data['id'] ?? 0);
        if ($method === 'PUT') {
            $stmt = $conn->prepare('UPDATE students SET student_number=?, name=?, email=?, phone=?, class_code=?, year_level=? WHERE id=?');
            $stmt->bind_param('ssssssi', $data['studentNumber'], $data['name'], $data['email'], $data['phone'], $data['enrollment'], $data['year'], $id);
            $stmt->execute(); respond(['status'=>'success','message'=>'Student updated successfully.']);
        }
        if ($method === 'DELETE') {
            $stmt = $conn->prepare('DELETE FROM students WHERE id=?'); $stmt->bind_param('i', $id); $stmt->execute(); respond(['status'=>'success','message'=>'Student deleted successfully.']);
        }
    }

    if ($action === 'attendance' && $method === 'GET') {
        $search = '%' . clean($_GET['search'] ?? '') . '%';
        $stmt = $conn->prepare("SELECT a.id, s.name AS studentName, s.class_code AS class, DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS date, DATE_FORMAT(a.check_in_time, '%h:%i %p') AS time, a.status FROM attendance a JOIN students s ON s.id=a.student_id JOIN subjects sub ON sub.id=a.subject_id WHERE s.name LIKE ? OR s.class_code LIKE ? ORDER BY a.attendance_date DESC, a.check_in_time DESC");
        $stmt->bind_param('ss', $search, $search); $stmt->execute(); respond(['status'=>'success','attendance'=>$stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
    }

    // Student portal: student registration is stored in the same students table
    // displayed by the administrator. Attendance history is read from attendance.
    if ($action === 'student-register' && $method === 'POST') {
        $data = body();
        $studentNumber = clean($data['studentNumber'] ?? '');
        $name = clean($data['name'] ?? '');
        $email = filter_var(clean($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $phone = clean($data['phone'] ?? '');
        $enrollment = clean($data['enrollment'] ?? '');
        $year = clean($data['year'] ?? '');
        if (!$studentNumber || !$name || !$email || !$enrollment || !$year) respond(['status' => 'error', 'message' => 'Complete all required registration fields.'], 422);
        $id = (int)($data['id'] ?? 0);
        if ($id) {
            $stmt = $conn->prepare('UPDATE students SET student_number=?, name=?, email=?, phone=?, class_code=?, year_level=? WHERE id=?');
            $stmt->bind_param('ssssssi', $studentNumber, $name, $email, $phone, $enrollment, $year, $id);
            if (!$stmt->execute()) respond(['status' => 'error', 'message' => 'Unable to update profile. Student number or email may already exist.'], 409);
        } else {
            $stmt = $conn->prepare('INSERT INTO students (student_number, name, email, phone, class_code, year_level) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->bind_param('ssssss', $studentNumber, $name, $email, $phone, $enrollment, $year);
            if (!$stmt->execute()) respond(['status' => 'error', 'message' => 'Unable to register. Student number or email may already exist.'], 409);
            $id = $conn->insert_id;
        }
        $stmt = $conn->prepare('SELECT id, student_number AS studentNumber, name, email, phone, class_code AS enrollment, year_level AS year FROM students WHERE id=?');
        $stmt->bind_param('i', $id); $stmt->execute();
        $student = $stmt->get_result()->fetch_assoc();
        mirrorUserStudent($student);
        respond(['status' => 'success', 'student' => $student]);
    }

    if ($action === 'student-portal' && $method === 'GET') {
        $studentId = (int)($_GET['studentId'] ?? 0);
        $stmt = $conn->prepare('SELECT id, student_number AS studentNumber, name, email, phone, class_code AS enrollment, year_level AS year FROM students WHERE id=?');
        $stmt->bind_param('i', $studentId); $stmt->execute(); $student = $stmt->get_result()->fetch_assoc();
        if (!$student) respond(['status' => 'error', 'message' => 'Student profile not found. Please register your profile.'], 404);
        // Some existing installations predate subjects.class_code. Use a stable
        // generated label so the portal works with both database versions.
        $subjects = $conn->query("SELECT id, CONCAT('SUBJECT-', id) AS classCode, name, schedule, room_location AS roomLocation FROM subjects ORDER BY id")->fetch_all(MYSQLI_ASSOC);
        // History and weighted attendance score come from attendance_system_users.
        mirrorUserStudent($student);
        $userConn = openUserDatabase();
        $userStudentStmt = $userConn->prepare('SELECT id FROM students WHERE admin_student_id=?');
        $userStudentStmt->bind_param('i', $studentId); $userStudentStmt->execute(); $userStudent = $userStudentStmt->get_result()->fetch_assoc();
        if (!$userStudent) respond(['status' => 'error', 'message' => 'Student profile is not yet available in attendance_system_users. Save the profile once to synchronize it.'], 404);
        $userStudentId = (int)$userStudent['id'];
        $historyStmt = $userConn->prepare("SELECT id, DATE_FORMAT(attendance_date, '%Y-%m-%d') AS date, DATE_FORMAT(check_in_time, '%h:%i %p') AS time, status, class_code AS classCode, subject_name AS subjectName FROM attendance WHERE student_id=? ORDER BY attendance_date DESC, check_in_time DESC");
        $historyStmt->bind_param('i', $userStudentId); $historyStmt->execute(); $history = $historyStmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $summaryStmt = $userConn->prepare("SELECT COUNT(*) AS total, COALESCE(SUM(status='Present'),0) AS present, COALESCE(SUM(status='Late'),0) AS late, COALESCE(SUM(status='Absent'),0) AS absent, COALESCE((SUM(CASE status WHEN 'Present' THEN 1 WHEN 'Late' THEN .5 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 0) AS rate FROM attendance WHERE student_id=?");
        $summaryStmt->bind_param('i', $userStudentId); $summaryStmt->execute(); $summary = $summaryStmt->get_result()->fetch_assoc(); $userConn->close();
        respond(['status' => 'success', 'student' => $student, 'subjects' => $subjects, 'history' => $history, 'summary' => $summary]);
    }

    if ($action === 'student-checkin' && $method === 'POST') {
        $data = body(); $studentId = (int)($data['studentId'] ?? 0); $sessionToken = clean($data['sessionToken'] ?? '');
        if (!$studentId || !$sessionToken) respond(['status' => 'error', 'message' => 'Student and active QR session are required for check-in.'], 422);
        $sessionStmt = $conn->prepare('SELECT subject_id FROM qr_sessions WHERE session_token=? AND is_active=1 AND starts_at<=NOW() AND expires_at>=NOW() LIMIT 1');
        $sessionStmt->bind_param('s', $sessionToken); $sessionStmt->execute(); $session = $sessionStmt->get_result()->fetch_assoc();
        if (!$session) respond(['status' => 'error', 'message' => 'This QR session is invalid or expired. Scan the current administrator QR code.'], 410);
        $subjectId = (int)$session['subject_id'];
        $studentStmt = $conn->prepare('SELECT id FROM students WHERE id=?');
        $studentStmt->bind_param('i', $studentId); $studentStmt->execute();
        if (!$studentStmt->get_result()->fetch_assoc()) respond(['status' => 'error', 'message' => 'Student profile was not found. Register before checking in.'], 404);
        $subjectStmt = $conn->prepare('SELECT name, start_time, present_window, late_window FROM subjects WHERE id=?'); $subjectStmt->bind_param('i', $subjectId); $subjectStmt->execute(); $subject = $subjectStmt->get_result()->fetch_assoc();
        if (!$subject) respond(['status' => 'error', 'message' => 'Class session was not found.'], 404);
        $now = new DateTime(); $today = $now->format('Y-m-d'); $classStart = new DateTime($today . ' ' . $subject['start_time']);
        $presentUntil = (clone $classStart)->modify('+' . (int)$subject['present_window'] . ' minutes');
        $lateUntil = (clone $classStart)->modify('+' . (int)$subject['late_window'] . ' minutes');
        $status = $now <= $presentUntil ? 'Present' : ($now <= $lateUntil ? 'Late' : 'Absent');
        $checkIn = $now->format('Y-m-d H:i:s');
        $stmt = $conn->prepare('INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('iisss', $studentId, $subjectId, $today, $checkIn, $status);
        if (!$stmt->execute()) respond(['status' => 'error', 'message' => 'You have already checked in for this class today.'], 409);
        $attendanceId = $conn->insert_id;
        if (hasTable($conn, 'attendance_logs')) {
            $log = $conn->prepare("INSERT INTO attendance_logs (attendance_id, student_id, subject_id, scanned_at, status, source) VALUES (?, ?, ?, ?, ?, 'student-portal')");
            $log->bind_param('iiiss', $attendanceId, $studentId, $subjectId, $checkIn, $status); $log->execute();
        }
        mirrorUserAttendance($studentId, $attendanceId, $subjectId, 'SUBJECT-' . $subjectId, $subject['name'], $today, $checkIn, $status);
        respond(['status' => 'success', 'message' => "Check-in saved as {$status}.", 'statusValue' => $status], 201);
    }

    if ($action === 'reports' && $method === 'GET') {
        $start = dateValue($_GET['start'] ?? date('Y-m-01')); $end = dateValue($_GET['end'] ?? date('Y-m-d'));
        $stmt = $conn->prepare("SELECT s.student_number AS studentId, s.name, a.attendance_date AS date, DATE_FORMAT(a.check_in_time, '%h:%i %p') AS time, sub.name AS subject, CASE WHEN a.status='Present' THEN 'On Time' ELSE a.status END AS status FROM attendance a JOIN students s ON s.id=a.student_id JOIN subjects sub ON sub.id=a.subject_id WHERE a.attendance_date BETWEEN ? AND ? ORDER BY a.attendance_date, a.check_in_time");
        $stmt->bind_param('ss', $start, $end); $stmt->execute(); respond(['status'=>'success','logs'=>$stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
    }

    if ($action === 'settings') {
        if ($method === 'GET') {
            $result = $conn->query('SELECT * FROM subjects ORDER BY id LIMIT 1'); respond(['status'=>'success','settings'=>$result->fetch_assoc()]);
        }
        $data = body();
        $stmt = $conn->prepare('UPDATE subjects SET name=?, schedule=?, room_location=?, start_time=?, end_time=?, present_window=?, late_window=?, auto_close_qr=?, late_threshold=?, absent_threshold=? ORDER BY id LIMIT 1');
        $present = (int)$data['presentWindow']; $late = (int)$data['lateWindow']; $auto = (int)!empty($data['autoCloseQr']); $lateThreshold = (int)$data['lateThreshold']; $absentThreshold = (int)$data['absentThreshold'];
        $stmt->bind_param('ssssiiiiii', $data['subjectName'], $data['classSchedule'], $data['roomLocation'], $data['classStartTime'], $data['classEndTime'], $present, $late, $auto, $lateThreshold, $absentThreshold); $stmt->execute(); respond(['status'=>'success','message'=>'Settings saved successfully.']);
    }

    if ($action === 'profile') {
        if ($method === 'GET') { $result = $conn->query('SELECT * FROM admins ORDER BY id LIMIT 1'); respond(['status'=>'success','profile'=>$result->fetch_assoc()]); }
        $data = body(); $stmt = $conn->prepare('UPDATE admins SET name=?, email=?, phone=?, position=?, department=?, bio=? ORDER BY id LIMIT 1');
        $name = clean(($data['firstName'] ?? '') . ' ' . ($data['lastName'] ?? '')); $stmt->bind_param('ssssss', $name, $data['email'], $data['phone'], $data['position'], $data['department'], $data['bio']); $stmt->execute(); respond(['status'=>'success','message'=>'Profile updated successfully.']);
    }

    if ($action === 'qr-session' && $method === 'GET') {
        $token = clean($_GET['token'] ?? '');
        if (!$token) respond(['status' => 'error', 'message' => 'QR session token is required.'], 422);
        $stmt = $conn->prepare("SELECT qs.subject_id AS subjectId, s.name AS subjectName, CONCAT('SUBJECT-', s.id) AS classCode, s.schedule FROM qr_sessions qs JOIN subjects s ON s.id=qs.subject_id WHERE qs.session_token=? AND qs.is_active=1 AND qs.starts_at<=NOW() AND qs.expires_at>=NOW() LIMIT 1");
        $stmt->bind_param('s', $token); $stmt->execute(); $session = $stmt->get_result()->fetch_assoc();
        if (!$session) respond(['status' => 'error', 'message' => 'This QR session is invalid or expired. Scan the current administrator QR code.'], 410);
        respond(['status' => 'success', 'session' => $session]);
    }

    if ($action === 'qr-session' && $method === 'POST') {
        $subject = $conn->query('SELECT id, start_time, end_time FROM subjects ORDER BY id LIMIT 1')->fetch_assoc();
        $token = bin2hex(random_bytes(16)); $starts = date('Y-m-d H:i:s'); $expires = date('Y-m-d') . ' ' . $subject['end_time'];
        $conn->query('UPDATE qr_sessions SET is_active=0 WHERE is_active=1'); $stmt = $conn->prepare('INSERT INTO qr_sessions (subject_id, session_token, starts_at, expires_at) VALUES (?, ?, ?, ?)'); $stmt->bind_param('isss', $subject['id'], $token, $starts, $expires); $stmt->execute(); respond(['status'=>'success','sessionId'=>$token,'expiresAt'=>$expires]);
    }

    respond(['status'=>'error','message'=>'Unknown API action.'], 404);
} catch (Throwable $error) {
    respond(['status'=>'error','message'=>'Server error: ' . $error->getMessage()], 500);
}
