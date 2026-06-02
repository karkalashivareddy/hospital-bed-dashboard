CREATE DATABASE IF NOT EXISTS hospital_beds;
USE hospital_beds;

-- Beds Table
CREATE TABLE IF NOT EXISTS beds (
  id VARCHAR(36) PRIMARY KEY,
  bedNumber VARCHAR(20) UNIQUE NOT NULL,
  ward VARCHAR(50) NOT NULL,
  status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
  patientId VARCHAR(36),
  doctorId VARCHAR(36),
  admittedDate TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ward (ward),
  INDEX idx_status (status)
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  dateOfBirth DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(50),
  email VARCHAR(100),
  phone VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO beds (id, bedNumber, ward, status) VALUES
('bed_1', 'B101', 'ICU', 'available'),
('bed_2', 'B102', 'ICU', 'available'),
('bed_3', 'B103', 'ICU', 'maintenance'),
('bed_4', 'B201', 'a', 'available'),
('bed_5', 'B202', 'General', 'available'),
('bed_6', 'B203', 'General', 'available'),
('bed_7', 'B301', 'Pediatric', 'available'),
('bed_8', 'B302', 'Pediatric', 'available'),
('bed_9', 'B401', 'Orthopedic', 'available'),
('bed_10', 'B402', 'Orthopedic', 'available'),
('bed_11', 'B501', 'Cardiology', 'available'),
('bed_12', 'B502', 'Cardiology', 'available');
CREATE DATABASE hospital_beds;
USE hospital_beds;