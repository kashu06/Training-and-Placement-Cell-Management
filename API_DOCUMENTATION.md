# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Admin Signup
```
POST /auth/admin/signup
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}

Response:
{
  "message": "Admin registered successfully",
  "token": "jwt_token_here",
  "user": {
    "admin_id": 1,
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

### Admin Login
```
POST /auth/admin/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Student Signup
```
POST /auth/student/signup
{
  "roll_no": "2021001",
  "name": "John Doe",
  "email": "john@student.com",
  "phone": "9999999999",
  "branch": "CSE",
  "batch": 2021,
  "cgpa": 8.5,
  "password": "password123"
}
```

### Student Login
```
POST /auth/student/login
{
  "email": "john@student.com",
  "password": "password123"
}
```

### Company Signup
```
POST /auth/company/signup
{
  "company_name": "Google",
  "email": "google@company.com",
  "phone": "1111111111",
  "password": "password123"
}
```

### Company Login
```
POST /auth/company/login
{
  "email": "google@company.com",
  "password": "password123"
}
```

---

## 👥 Student Endpoints

### Get All Students
```
GET /students
Authorization: required

Response:
{
  "data": [
    {
      "student_id": 1,
      "roll_no": "2021001",
      "name": "John Doe",
      "email": "john@student.com",
      "branch": "CSE",
      "batch": 2021,
      "cgpa": 8.5
    }
  ]
}
```

### Get Student by ID
```
GET /students/:id
Authorization: required
```

### Update Student Profile
```
PUT /students/:id
Authorization: required
Content-Type: application/json

{
  "phone": "9999999999",
  "cgpa": 8.8,
  "resume_link": "https://example.com/resume.pdf"
}
```

---

## 🏢 Company Endpoints

### Get All Companies
```
GET /companies
Authorization: required

Response:
{
  "data": [
    {
      "company_id": 1,
      "company_name": "Google",
      "email": "google@company.com",
      "phone": "1111111111",
      "CompanyLocations": [
        { "location": "Bangalore" },
        { "location": "Delhi" }
      ]
    }
  ]
}
```

### Get Company by ID
```
GET /companies/:id
Authorization: required
```

### Update Company
```
PUT /companies/:id
Authorization: required (Company role)
Content-Type: application/json

{
  "company_name": "Google India",
  "phone": "1111111112"
}
```

### Add Company Location
```
POST /companies/:id/locations
Authorization: required (Company role)
{
  "location": "Mumbai"
}
```

### Remove Company Location
```
DELETE /companies/:id/locations
Authorization: required (Company role)
{
  "location": "Mumbai"
}
```

---

## 💼 Job Endpoints

### Create Job
```
POST /jobs
Authorization: required (Company role)
Content-Type: application/json

{
  "company_id": 1,
  "job_title": "Software Engineer",
  "job_type": "Full-Time",
  "min_cgpa": 7.5,
  "salary": 1200000,
  "eligible_branches": ["CSE", "ECE"]
}

Response:
{
  "message": "Job created successfully",
  "data": {
    "job_id": 1,
    "company_id": 1,
    "job_title": "Software Engineer",
    "job_type": "Full-Time",
    "min_cgpa": 7.5,
    "salary": 1200000
  }
}
```

### Get All Jobs
```
GET /jobs
Authorization: optional

Response:
{
  "data": [
    {
      "job_id": 1,
      "job_title": "Software Engineer",
      "job_type": "Full-Time",
      "min_cgpa": 7.5,
      "salary": 1200000,
      "Company": {
        "company_id": 1,
        "company_name": "Google"
      },
      "JobEligibilities": [
        { "branch": "CSE" },
        { "branch": "ECE" }
      ]
    }
  ]
}
```

### Get Job by ID
```
GET /jobs/:id
Authorization: optional
```

### Get Jobs by Company
```
GET /jobs/company/:company_id
Authorization: optional
```

### Update Job
```
PUT /jobs/:id
Authorization: required (Company role)
{
  "job_title": "Senior Software Engineer",
  "min_cgpa": 8.0,
  "salary": 1500000,
  "eligible_branches": ["CSE"]
}
```

### Delete Job
```
DELETE /jobs/:id
Authorization: required (Company role)
```

---

## 📝 Application Endpoints

### Apply for Job
```
POST /applications/apply
Authorization: required (Student role)
Content-Type: application/json

{
  "student_id": 1,
  "job_id": 1
}

Response:
{
  "message": "Application submitted successfully",
  "data": {
    "application_id": 1,
    "student_id": 1,
    "job_id": 1,
    "application_date": "2024-03-26",
    "status": "Applied"
  }
}

Errors:
- 400: "Your CGPA is below the minimum required CGPA"
- 400: "Your branch is not eligible for this job"
- 400: "Student has already applied for this job"
```

### Get All Applications
```
GET /applications
Authorization: optional

Response:
{
  "data": [
    {
      "application_id": 1,
      "student_id": 1,
      "job_id": 1,
      "application_date": "2024-03-26",
      "status": "Applied",
      "Student": { ... },
      "Job": { ... }
    }
  ]
}
```

### Get Applications by Student
```
GET /applications/student/:student_id
Authorization: optional
```

### Get Applications for Job
```
GET /applications/job/:job_id
Authorization: optional
```

### Update Application Status
```
PUT /applications/:id
Authorization: required (Company role)
Content-Type: application/json

{
  "status": "Shortlisted"
}

Valid statuses: "Applied", "Shortlisted", "Selected", "Rejected"
```

### Delete Application
```
DELETE /applications/:id
Authorization: required
```

---

## 👨‍💼 Admin Endpoints

### Get Dashboard Statistics
```
GET /admin/dashboard/stats
Authorization: required (Admin role)

Response:
{
  "stats": {
    "totalStudents": 15,
    "totalCompanies": 5,
    "totalJobs": 20,
    "totalApplications": 45,
    "applicationStatuses": {
      "applied": 30,
      "shortlisted": 10,
      "selected": 3,
      "rejected": 2
    }
  }
}
```

### Get All Students (Admin)
```
GET /admin/students
Authorization: required (Admin role)
```

### Get All Companies (Admin)
```
GET /admin/companies
Authorization: required (Admin role)
```

### Get All Jobs (Admin)
```
GET /admin/jobs
Authorization: required (Admin role)
```

### Get All Applications (Admin)
```
GET /admin/applications
Authorization: required (Admin role)
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized: Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Student not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "error details"
}
```

---

## 🔄 Status Values

### Application Status
- `Applied` - Initial state when student applies
- `Shortlisted` - Student selected for interview
- `Selected` - Student offered the position
- `Rejected` - Application rejected

### Job Type
- `Internship` - Internship position
- `Full-Time` - Full-time position

### Branches
- `CSE` - Computer Science & Engineering
- `ECE` - Electronics & Communication Engineering
- `MECH` - Mechanical Engineering
- `CIVIL` - Civil Engineering

---

## 📌 Important Notes

1. **Token Validity**: JWT tokens are valid for 7 days
2. **CORS**: Frontend requests to backend must come after CORS middleware
3. **Password Security**: Passwords are hashed using bcrypt (10 rounds)
4. **Eligibility Checks**:
   - Student CGPA must be >= job's min_cgpa
   - Student branch must be in job's eligible branches
5. **Unique Constraints**:
   - One student can only apply once per job
   - Email must be unique for each user type

---

## 🧪 Testing with cURL

```bash
# Admin Login
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get All Jobs
curl -X GET http://localhost:5000/api/jobs

# Apply for Job (with token)
curl -X POST http://localhost:5000/api/applications/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"student_id":1,"job_id":1}'
```

---

**Last Updated**: March 26, 2024
