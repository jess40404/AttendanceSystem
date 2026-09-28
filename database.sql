CREATE DATABASE IF NOT EXISTS attendance_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE attendance_system;

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) DEFAULT '',
  position VARCHAR(120) DEFAULT 'Administrator',
  department VARCHAR(120) DEFAULT 'Management',
  location VARCHAR(190) DEFAULT 'Riverside High School, Philippines',
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL AFTER email;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS subjects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  class_code VARCHAR(60) NOT NULL,
  schedule VARCHAR(120) NOT NULL,
  room_location VARCHAR(120) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  present_window SMALLINT UNSIGNED NOT NULL DEFAULT 10,
  late_window SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  auto_close_qr TINYINT(1) NOT NULL DEFAULT 1,
  late_threshold SMALLINT UNSIGNED NOT NULL DEFAULT 3,
  absent_threshold SMALLINT UNSIGNED NOT NULL DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration support for installations created before a subject code existed.
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS class_code VARCHAR(60) NOT NULL DEFAULT '' AFTER name;
UPDATE subjects SET class_code = CONCAT('SUBJECT-', id) WHERE class_code = '';

CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_number VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) DEFAULT '',
  class_code VARCHAR(60) NOT NULL,
  year_level VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  attendance_date DATE NOT NULL,
  check_in_time DATETIME NULL,
  status ENUM('Present', 'Late', 'Absent') NOT NULL DEFAULT 'Present',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_student_subject_date (student_id, subject_id, attendance_date),
  KEY idx_attendance_student_history (student_id, attendance_date),
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  attendance_id BIGINT UNSIGNED NULL,
  student_id INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  scanned_at DATETIME NOT NULL,
  status ENUM('Present', 'Late', 'Absent') NOT NULL,
  source VARCHAR(30) NOT NULL DEFAULT 'qr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_attendance_logs_student_scanned (student_id, scanned_at),
  CONSTRAINT fk_logs_attendance FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE SET NULL,
  CONSTRAINT fk_logs_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_logs_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qr_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subject_id INT UNSIGNED NOT NULL,
  session_token VARCHAR(80) NOT NULL UNIQUE,
  starts_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_qr_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

INSERT INTO admins (name, email, password_hash, phone, position, department, location, bio)
SELECT 'Admin User', 'admin@school.com', '$2y$10$p2yYX8pFgbQMYZaz77cSOOiGn1dJ3KNUM/UUvLw4Zs9fvpgB.ZrMa', '09123456789', 'Administrator', 'Management', 'Riverside High School, Philippines', 'Dedicated education administrator managing class attendance and student records.'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admin@school.com');

UPDATE admins SET password_hash = '$2y$10$p2yYX8pFgbQMYZaz77cSOOiGn1dJ3KNUM/UUvLw4Zs9fvpgB.ZrMa'
WHERE email = 'admin@school.com' AND (password_hash IS NULL OR password_hash = '');

INSERT INTO subjects (name, class_code, schedule, room_location, start_time, end_time)
SELECT 'Application Development & Emerging Tech', 'CCSIT 207', '08:00 AM - 10:00 AM', 'Lab 3', '08:00:00', '10:00:00'
WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE class_code = 'CCSIT 207');

INSERT INTO students (student_number, name, email, phone, class_code, year_level)
SELECT * FROM (SELECT '2024-0001', 'John Doe', 'john.doe@student.com', '09123456789', 'CS101', '1st Year') AS seed
WHERE NOT EXISTS (SELECT 1 FROM students WHERE student_number = '2024-0001')
UNION ALL
SELECT * FROM (SELECT '2024-0002', 'Jane Smith', 'jane.smith@student.com', '09987654321', 'IT204', '2nd Year') AS seed
WHERE NOT EXISTS (SELECT 1 FROM students WHERE student_number = '2024-0002')
UNION ALL
SELECT * FROM (SELECT '2024-0003', 'Miguel Reyes', 'miguel.reyes@student.com', '09555123456', 'CS301', '3rd Year') AS seed
WHERE NOT EXISTS (SELECT 1 FROM students WHERE student_number = '2024-0003')
UNION ALL
SELECT * FROM (SELECT '2024-0004', 'Angela Pascual', 'angela.pascual@student.com', '09112223344', 'CCSIT207', '4th Year') AS seed
WHERE NOT EXISTS (SELECT 1 FROM students WHERE student_number = '2024-0004');

INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status)
SELECT s.id, sub.id, '2026-08-01', '2026-08-01 13:45:00', 'Present'
FROM students s CROSS JOIN subjects sub WHERE s.student_number = '2024-0001'
AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.student_id=s.id AND a.subject_id=sub.id AND a.attendance_date='2026-08-01');
INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status)
SELECT s.id, sub.id, '2026-08-01', '2026-08-01 13:52:00', 'Late'
FROM students s CROSS JOIN subjects sub WHERE s.student_number = '2024-0002'
AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.student_id=s.id AND a.subject_id=sub.id AND a.attendance_date='2026-08-01');
INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status)
SELECT s.id, sub.id, '2026-08-01', '2026-08-01 13:53:00', 'Present'
FROM students s CROSS JOIN subjects sub WHERE s.student_number = '2024-0003'
AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.student_id=s.id AND a.subject_id=sub.id AND a.attendance_date='2026-08-01');
INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status)
SELECT s.id, sub.id, '2026-08-02', '2026-08-02 13:40:00', 'Present'
FROM students s CROSS JOIN subjects sub WHERE s.student_number = '2024-0004'
AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.student_id=s.id AND a.subject_id=sub.id AND a.attendance_date='2026-08-02');
INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status)
SELECT s.id, sub.id, '2026-08-02', '2026-08-02 14:10:00', 'Late'
FROM students s CROSS JOIN subjects sub WHERE s.student_number = '2024-0001'
AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.student_id=s.id AND a.subject_id=sub.id AND a.attendance_date='2026-08-02');
INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status)
SELECT s.id, sub.id, '2026-08-05', '2026-08-05 13:44:00', 'Present'
FROM students s CROSS JOIN subjects sub WHERE s.student_number = '2024-0002'
AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.student_id=s.id AND a.subject_id=sub.id AND a.attendance_date='2026-08-05');
INSERT INTO attendance (student_id, subject_id, attendance_date, check_in_time, status)
SELECT s.id, sub.id, '2026-08-08', '2026-08-08 13:46:00', 'Present'
FROM students s CROSS JOIN subjects sub WHERE s.student_number = '2024-0003'
AND NOT EXISTS (SELECT 1 FROM attendance a WHERE a.student_id=s.id AND a.subject_id=sub.id AND a.attendance_date='2026-08-08');

INSERT INTO attendance_logs (attendance_id, student_id, subject_id, scanned_at, status)
SELECT a.id, a.student_id, a.subject_id, a.check_in_time, a.status FROM attendance a
WHERE NOT EXISTS (SELECT 1 FROM attendance_logs l WHERE l.attendance_id = a.id);
