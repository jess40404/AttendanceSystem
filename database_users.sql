-- User-side database for the Student Portal.
-- Import this file in phpMyAdmin to create the attendance_system_users database.
CREATE DATABASE IF NOT EXISTS attendance_system_users
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE attendance_system_users;

-- Each profile is linked to its matching row in attendance_system.students.
CREATE TABLE IF NOT EXISTS students (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_student_id INT UNSIGNED NOT NULL UNIQUE,
  student_number VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(30) DEFAULT '',
  class_code VARCHAR(60) NOT NULL,
  year_level VARCHAR(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_user_students_class (class_code)
);

-- Persistent records used by Attendance History on the student side.
CREATE TABLE IF NOT EXISTS attendance (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_attendance_id BIGINT UNSIGNED NOT NULL UNIQUE,
  student_id INT UNSIGNED NOT NULL,
  admin_subject_id INT UNSIGNED NOT NULL,
  class_code VARCHAR(60) NOT NULL,
  subject_name VARCHAR(190) NOT NULL,
  attendance_date DATE NOT NULL,
  check_in_time DATETIME NULL,
  status ENUM('Present', 'Late', 'Absent') NOT NULL DEFAULT 'Present',
  source VARCHAR(30) NOT NULL DEFAULT 'student-portal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_subject_date (student_id, admin_subject_id, attendance_date),
  KEY idx_user_attendance_history (student_id, attendance_date),
  CONSTRAINT fk_user_attendance_student FOREIGN KEY (student_id)
    REFERENCES students(id) ON DELETE CASCADE
);

-- Audit trail for check-in attempts made in the user portal.
CREATE TABLE IF NOT EXISTS attendance_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  attendance_id BIGINT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  scanned_at DATETIME NOT NULL,
  status ENUM('Present', 'Late', 'Absent') NOT NULL,
  source VARCHAR(30) NOT NULL DEFAULT 'student-portal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user_logs_student_scanned (student_id, scanned_at),
  CONSTRAINT fk_user_logs_attendance FOREIGN KEY (attendance_id)
    REFERENCES attendance(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_logs_student FOREIGN KEY (student_id)
    REFERENCES students(id) ON DELETE CASCADE
);
