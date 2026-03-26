# Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js installed
- MySQL Server running

### Step 1: Create Database (2 minutes)

1. Open MySQL and paste this:

```sql
CREATE DATABASE IF NOT EXISTS training_placement_db;
USE training_placement_db;

CREATE TABLE admin (admin_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(100) NOT NULL);
CREATE TABLE student (student_id INT AUTO_INCREMENT PRIMARY KEY, roll_no VARCHAR(20) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, phone VARCHAR(15), branch VARCHAR(50) NOT NULL, batch INT NOT NULL, cgpa DECIMAL(3,2), resume_link VARCHAR(255), password VARCHAR(100) NOT NULL);
CREATE TABLE company (company_id INT AUTO_INCREMENT PRIMARY KEY, company_name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE, phone VARCHAR(15), password VARCHAR(100) NOT NULL);
CREATE TABLE company_location (company_id INT, location VARCHAR(100), PRIMARY KEY(company_id, location), FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE);
CREATE TABLE job (job_id INT AUTO_INCREMENT PRIMARY KEY, company_id INT NOT NULL, job_title VARCHAR(100) NOT NULL, job_type ENUM('Internship', 'Full-Time') NOT NULL, min_cgpa DECIMAL(3,2), salary INT, FOREIGN KEY (company_id) REFERENCES company(company_id) ON DELETE CASCADE);
CREATE TABLE job_eligibility (job_id INT, branch VARCHAR(50), PRIMARY KEY(job_id, branch), FOREIGN KEY (job_id) REFERENCES job(job_id) ON DELETE CASCADE);
CREATE TABLE application (application_id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, job_id INT NOT NULL, application_date DATE, status ENUM('Applied', 'Shortlisted', 'Selected', 'Rejected') DEFAULT 'Applied', FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE, FOREIGN KEY (job_id) REFERENCES job(job_id) ON DELETE CASCADE, UNIQUE (student_id, job_id));
```

### Step 2: Setup Backend (2 minutes)

```bash
cd backend
npm install
npm start
```

Wait for: "Server running on port 5000"

### Step 3: Setup Frontend (1 minute)

Open new terminal:

```bash
cd frontend
npx http-server -p 8000
```

Or use Live Server in VS Code.

### Step 4: Open Browser

Go to: **http://localhost:8000**

---

## 🧪 Test It

### Admin Login
1. Click "Admin" button
2. Click "Sign Up"
3. Create account with any email/password
4. Login and see Admin Dashboard

### Student Signup & Apply
1. Click "Student" button
2. Click "Sign Up"
3. Fill details (Roll No: 2021001, Branch: CSE, CGPA: 8.5, etc.)
4. Login to see Student Dashboard

### Company Post Job
1. Click "Company" button  
2. Click "Sign Up"
3. Login to see Company Dashboard
4. Click "Post New Job"
5. Fill job details and submit

### Student Apply for Job
1. Open Student Dashboard (different browser/window)
2. Click "View Jobs"
3. Click "Apply" on any job
4. Check "My Applications" to see status

### Company Check Applicants
1. Go to Company Dashboard
2. Click "View Applicants"
3. Change status (Shortlisted, Selected, Rejected)

---

## 📍 Important Points

- **Backend must be running** on http://localhost:5000
- **Frontend must be served via HTTP** (not file://)
- **MySQL must be running** before starting backend
- All passwords are hashed using bcrypt
- Tokens expire in 7 days

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | Check MySQL is running, verify .env credentials |
| "Port 5000 already in use" | Change PORT in .env file |
| "Cannot GET /api/..." | Backend not running, check terminal |
| "CORS error" | Update `API_BASE_URL` in frontend/api.js |
| "Login fails" | Create new account via signup, don't use same credentials |

---

## 🎓 What Works

✅ Student signup/login & profile management  
✅ Company signup/login & job posting  
✅ Job application with eligibility checks  
✅ Admin dashboard with statistics  
✅ Application status updates  
✅ JWT authentication & authorization  
✅ Responsive UI  

---

**Ready? Go to http://localhost:8000** 🚀
