CREATE DATABASE IF NOT EXISTS training_placement_db;
USE training_placement_db;


DROP TABLE IF EXISTS application;
DROP TABLE IF EXISTS job_eligibility;
DROP TABLE IF EXISTS job;
DROP TABLE IF EXISTS company_location;
DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS admin;
-- ================= ADMIN TABLE =================
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- ================= STUDENT TABLE =================
CREATE TABLE student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    branch VARCHAR(50) NOT NULL,
    batch INT NOT NULL,
    cgpa DECIMAL(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
    resume_link VARCHAR(255),
    password VARCHAR(100) NOT NULL
);

-- ================= COMPANY TABLE =================
CREATE TABLE company (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15)
);


CREATE TABLE company_location (
    company_id INT,
    location VARCHAR(100),

    PRIMARY KEY(company_id, location),

    FOREIGN KEY (company_id)
        REFERENCES company(company_id)
        ON DELETE CASCADE
);

CREATE TABLE job (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    job_type ENUM('Internship', 'Full-Time') NOT NULL,
    min_cgpa DECIMAL(3,2) CHECK (min_cgpa >= 0 AND min_cgpa <= 10),
    salary INT,

    FOREIGN KEY (company_id)
        REFERENCES company(company_id)
        ON DELETE CASCADE
);


CREATE TABLE job_eligibility (
    job_id INT,
    branch VARCHAR(50),

    PRIMARY KEY(job_id, branch),

    FOREIGN KEY (job_id)
        REFERENCES job(job_id)
        ON DELETE CASCADE
);

-- ================= APPLICATION TABLE =================
CREATE TABLE application (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    job_id INT NOT NULL,
    application_date DATE,
    status ENUM('Applied', 'Shortlisted', 'Selected', 'Rejected') DEFAULT 'Applied',

    FOREIGN KEY (student_id)
        REFERENCES student(student_id)
        ON DELETE CASCADE,

    FOREIGN KEY (job_id)
        REFERENCES job(job_id)
        ON DELETE CASCADE,

    UNIQUE (student_id, job_id)
);

SHOW TABLES;