# Training & Placement Cell Management System

A complete, fully functional web application for managing training and placement activities in educational institutions.

## 🎯 Features

### Student Features
- User registration and login
- View all available jobs/internships
- Apply for jobs (with eligibility validation)
- Track application status
- Update profile (CGPA, resume link, contact info)

### Company Features
- User registration and login
- Post new job openings
- Add eligibility criteria (branches, CGPA)
- View applicants for each job
- Update application status (Shortlisted, Selected, Rejected)
- Manage company locations

### Admin Features
- Login and access admin dashboard
- View all statistics (students, companies, jobs, applications)
- Monitor all students
- Monitor all companies
- Monitor all job postings
- Track all applications

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (v14 or higher) - Download from https://nodejs.org/
- **MySQL Server** (v5.7 or higher) - Download from https://www.mysql.com/
- **A code editor** (VS Code recommended)
- **Git** (optional)

## 🚀 Installation & Setup

### Step 1: Install MySQL and Create Database

1. **Install MySQL Server** if not already installed
2. Open **MySQL Command Line Client** or use a tool like **MySQL Workbench**
3. Run the following SQL commands to create the database and tables:

```sql
CREATE DATABASE IF NOT EXISTS training_placement_db;
USE training_placement_db;

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
    phone VARCHAR(15),
    password VARCHAR(100) NOT NULL
);

CREATE TABLE company_location (
    company_id INT,
    location VARCHAR(100),
    PRIMARY KEY(company_id, location),
    FOREIGN KEY (company_id)
        REFERENCES company(company_id)
        ON DELETE CASCADE
);

-- ================= JOB TABLE =================
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
```

### Step 2: Setup Backend

1. Open terminal/command prompt and navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the .env file:
   - The `.env` file is already created in the `backend` folder
   - Edit it with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=training_placement_db
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key_12345_change_this
   PORT=5000
   NODE_ENV=development
   ```
   
   **Replace:**
   - `your_mysql_password_here` with your actual MySQL password
   - `your_jwt_secret_key_12345_change_this` with a secure secret key

4. Start the backend server:
```bash
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
Database connected successfully
Server running on port 5000
```

### Step 3: Setup Frontend

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Start a local web server (you need to serve files via HTTP, not file://):
   
   **Option A: Using Python (if Python is installed)**
   ```bash
   python -m http.server 8000
   ```
   
   **Option B: Using Node.js (npx)**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: Using Live Server (VS Code Extension)**
   - Install "Live Server" extension in VS Code
   - Right-click `index.html` and select "Open with Live Server"

3. Open browser and go to:
   - `http://localhost:8000` (if using Python/Node.js)
   - Server will auto-open if using Live Server

## 📝 Sample Data (Optional)

To populate with sample data, run these SQL commands after creating the database:

```sql
-- Sample Admin
INSERT INTO admin (name, email, password) VALUES 
('Admin User', 'admin@tpo.com', '$2b$10$VYb7SH...'); -- Use bcrypt hashed password

-- Sample Students
INSERT INTO student (roll_no, name, email, phone, branch, batch, cgpa, password) VALUES 
('2021001', 'Akshay Kumar', 'akshay@student.com', '9999999999', 'CSE', 2021, 8.5, 'hashed_password'),
('2021002', 'Priya Singh', 'priya@student.com', '9999999998', 'ECE', 2021, 7.8, 'hashed_password'),
('2021003', 'Rajesh Patel', 'rajesh@student.com', '9999999997', 'MECH', 2021, 7.2, 'hashed_password');

-- Sample Companies
INSERT INTO company (company_name, email, phone, password) VALUES 
('Google', 'google@company.com', '1111111111', 'hashed_password'),
('Microsoft', 'microsoft@company.com', '2222222222', 'hashed_password'),
('Amazon', 'amazon@company.com', '3333333333', 'hashed_password');

-- Sample Jobs
INSERT INTO job (company_id, job_title, job_type, min_cgpa, salary) VALUES 
(1, 'Software Engineer', 'Full-Time', 7.5, 1200000),
(2, 'Data Analyst', 'Full-Time', 7.0, 1000000),
(3, 'Summer Intern', 'Internship', 6.5, 50000);

-- Sample Job Eligibility
INSERT INTO job_eligibility (job_id, branch) VALUES 
(1, 'CSE'),
(1, 'ECE'),
(2, 'CSE'),
(3, 'CSE'),
(3, 'ECE');
```

Note: For production, passwords should be hashed using bcrypt. For testing, you can use the application's signup to create actual users.

## 🔑 Default Test Credentials

After signup, use the credentials you created. Or create test accounts through the web interface:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Student Account:**
- Email: student@example.com
- Roll No: 2021001
- Password: student123

**Company Account:**
- Email: company@example.com
- Password: company123

## 🌐 Application URLs

- **Frontend**: http://localhost:8000
- **API Base**: http://localhost:5000/api

## 📖 API Endpoints

### Authentication
- `POST /api/auth/admin/signup` - Admin registration
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/signup` - Student registration
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/company/signup` - Company registration
- `POST /api/auth/company/login` - Company login

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student profile

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get company by ID
- `PUT /api/companies/:id` - Update company
- `POST /api/companies/:id/locations` - Add location

### Jobs
- `POST /api/jobs` - Create job (Company only)
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job (Company only)
- `DELETE /api/jobs/:id` - Delete job (Company only)

### Applications
- `POST /api/applications/apply` - Apply for job
- `GET /api/applications` - Get all applications
- `GET /api/applications/student/:student_id` - Get student's applications
- `GET /api/applications/job/:job_id` - Get applicants for job
- `PUT /api/applications/:id` - Update application status (Company only)

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/students` - Get all students
- `GET /api/admin/companies` - Get all companies
- `GET /api/admin/jobs` - Get all jobs
- `GET /api/admin/applications` - Get all applications

## 🔒 Authentication

- JWT (JSON Web Tokens) based authentication
- Tokens valid for 7 days
- Password hashing using bcrypt
- Role-based access control (RBAC)

Token is stored in browser's localStorage and sent with each request via Authorization header:
```
Authorization: Bearer <token>
```

## 📂 Project Structure

```
tpo website/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── companyController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Student.js
│   │   ├── Company.js
│   │   ├── CompanyLocation.js
│   │   ├── Job.js
│   │   ├── JobEligibility.js
│   │   ├── Application.js
│   │   └── index.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── index.html
    ├── styles.css
    ├── api.js
    ├── app.js
    ├── student-dashboard.js
    ├── company-dashboard.js
    └── admin-dashboard.js
```

## 🛠️ Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure database `training_placement_db` exists

### Port Already In Use
- Backend (5000): `npm start` won't work if port 5000 is busy
  - Change PORT in `.env` file
- Frontend (8000): Change port in http-server or Live Server settings

### CORS Error
- Ensure backend is running on http://localhost:5000
- Frontend should make requests to this URL

### Token Expired
- Clear localStorage and login again
- Tokens are valid for 7 days

## 🔄 Development Workflow

1. **Make changes to backend**:
   - Edit files in `backend/` folder
   - Server will need restart if using `npm start`
   - Use `npm run dev` if nodemon is configured for auto-restart

2. **Make changes to frontend**:
   - Edit files in `frontend/` folder
   - Browser will auto-refresh if using Live Server
   - Manual refresh needed if using http-server

## 📚 Further Customization

### Add More Branches
Edit in `student-dashboard.js` and `company-dashboard.js`:
```javascript
<option value="BIO">BIO</option>
<option value="CHEM">CHEM</option>
```

### Change Theme Colors
Edit `frontend/styles.css`:
```css
.btn-primary {
    background-color: #667eea; /* Change this color */
}
```

### Add More Job Types
Update in `company-dashboard.js`:
```javascript
<option value="Contract">Contract</option>
<option value="Part-Time">Part-Time</option>
```

## 🚀 Deployment

To deploy this application:

1. **Backend**: Deploy to Heroku, AWS, or any Node.js hosting
   - Set environment variables on hosting platform
   - Use managed MySQL database

2. **Frontend**: Deploy to Netlify, Vercel, or GitHub Pages
   - Update `API_BASE_URL` in `api.js` to production backend URL

## 📄 License

This project is created for educational purposes.

## 🤝 Support

For issues or questions, please check:
- Console errors (F12 in browser)
- Server logs in terminal
- Database connection status

---

**Last Updated**: 2024
**Version**: 1.0.0
