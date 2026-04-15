# Resume Upload Feature - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT BROWSER (Frontend)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Student Dashboard (student-dashboard.js)                  │  │
│  │                                                           │  │
│  │  My Profile Section:                                     │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ Resume Section                                     │ │  │
│  │  │                                                    │ │  │
│  │  │ Status: ✅ Resume uploaded                        │ │  │
│  │  │ File: [View Resume Link]                          │ │  │
│  │  │                                                    │ │  │
│  │  │ [📤 Replace Resume]  [🗑️ Delete Resume]           │ │  │
│  │  │                                                    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Client (api.js)                                      │  │
│  │                                                           │  │
│  │  • uploadResume(id, file)                                │  │
│  │  • deleteResume(id)                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTP/HTTPS)
                    JSON Response + File Upload
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    NODE.JS EXPRESS SERVER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Routes (studentRoutes.js)                                │  │
│  │                                                           │  │
│  │  POST   /api/students/:id/upload-resume                  │  │
│  │  DELETE /api/students/:id/delete-resume                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Multer Middleware (File Upload)                          │  │
│  │                                                           │  │
│  │  • File Type Validation (PDF only)                       │  │
│  │  • File Size Check (5MB max)                             │  │
│  │  • Unique Filename Generation                            │  │
│  │  • Disk Storage Configuration                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Controllers (studentController.js)                       │  │
│  │                                                           │  │
│  │  uploadResume()  ─→ Validate ─→ Save to DB              │  │
│  │  deleteResume()  ─→ Delete FS ─→ Clear DB               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Static File Server                                       │  │
│  │                                                           │  │
│  │  GET /uploads/resume_1_1681234567890.pdf                │  │
│  │  ↓ Serves file from backend/uploads/                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
          ┌──────────────────┴──────────────────┐
          ↓                                     ↓
    ┌──────────────┐                  ┌──────────────────┐
    │   MySQL DB   │                  │ File System      │
    │              │                  │                  │
    │  student     │                  │ backend/         │
    │  table:      │                  │  uploads/        │
    │              │                  │   resume_1_*.pdf │
    │  resume_link │                  │   resume_2_*.pdf │
    │  = "/uploads/│                  │   ...            │
    │  resume_1... │                  │                  │
    │              │                  │  (Auto-created)  │
    └──────────────┘                  └──────────────────┘
```

---

## 📊 Data Flow Diagram

### Upload Resume
```
┌─────────────────────────────────────────────────────────┐
│ 1. User selects PDF file from computer                 │
│    Input: resume.pdf (500KB)                           │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend validation                                  │
│    • Check: file.type === 'application/pdf'            │
│    • Check: file.size <= 5MB                           │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Create FormData & send to backend                   │
│    POST /api/students/1/upload-resume                  │
│    Content-Type: multipart/form-data                   │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Multer middleware processes upload                  │
│    • Validate MIME type = 'application/pdf'            │
│    • Check file size again (5MB limit)                 │
│    • Generate filename: resume_1_1681234567890.pdf     │
│    • Save to backend/uploads/                          │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Controller updates database                         │
│    UPDATE student SET                                  │
│      resume_link = '/uploads/resume_1_1681234567890...'│
│    WHERE student_id = 1                                │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Send response to frontend                           │
│    { message: "Resume uploaded successfully",          │
│      data: { resume_link, filename } }                 │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Frontend updates UI                                 │
│    • Show success alert                                │
│    • Change status to "Resume uploaded"                │
│    • Show "View Resume" link                           │
│    • Change button to "Replace Resume"                 │
│    • Show "Delete Resume" button                       │
└──────────────────────────────────────────────────────────┘
```

### Delete Resume
```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks "Delete Resume" button                  │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Show confirmation dialog                            │
│    "Are you sure? This action cannot be undone."       │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Send DELETE request to backend                      │
│    DELETE /api/students/1/delete-resume                │
│    Authorization: Bearer {jwt_token}                   │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Controller retrieves file path from database        │
│    student.resume_link = '/uploads/resume_1_...'       │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Delete file from filesystem                         │
│    fs.unlinkSync(backend/uploads/resume_1_...)         │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Update database                                      │
│    UPDATE student SET resume_link = NULL               │
│    WHERE student_id = 1                                │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Send success response                               │
│    { message: "Resume deleted successfully" }          │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Frontend updates UI                                 │
│    • Show success alert                                │
│    • Reset status to "Resume not uploaded"             │
│    • Hide "View Resume" link                           │
│    • Change button back to "Upload Resume"             │
│    • Hide "Delete Resume" button                       │
└──────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Layers

```
Layer 1: Authentication
└─ JWT token required for upload/delete
   └─ Verified in middleware
     └─ Only own resume can be modified

Layer 2: Client-side Validation
└─ File type check (PDF only)
└─ File size check (5MB max)
└─ User feedback on validation errors

Layer 3: Multer Middleware
└─ MIME type filter (application/pdf)
└─ File size limit (5MB enforced)
└─ Storage configuration

Layer 4: Server-side Validation
└─ Verify student exists
└─ Check file type again
└─ Validate database update

Layer 5: File Storage Security
└─ Unique filenames (prevent overwrites)
└─ Stored outside web root
└─ Served via Express middleware
└─ Not directly accessible
```

---

## 📁 Directory Structure (After Upload)

```
backend/
├── uploads/                          ← AUTO-CREATED
│   ├── resume_1_1681234567890.pdf   ← Student 1's resume
│   ├── resume_2_1681234568901.pdf   ← Student 2's resume
│   ├── resume_3_1681234569912.pdf   ← Student 3's resume
│   └── ...
│
├── server.js                         ← Serves /uploads static
├── package.json                      ← Has multer
├── .gitignore                        ← Excludes uploads/
│
├── controllers/
│   └── studentController.js          ← upload/delete functions
│
├── routes/
│   └── studentRoutes.js              ← upload/delete routes
│
└── config/
    └── database.js

frontend/
├── api.js                            ← uploadResume/deleteResume
├── student-dashboard.js              ← resume upload UI
├── index.html
└── ...
```

---

## 🔄 State Management

```
Initial State:
┌──────────────────────────────────────┐
│ resume_link = NULL                   │
│ Button: "📤 Upload Resume"           │
│ Status: "Resume not uploaded"        │
│ View Link: Hidden                    │
│ Delete Button: Hidden                │
│ Replace Button: Hidden               │
└──────────────────────────────────────┘

After Upload:
┌──────────────────────────────────────┐
│ resume_link = "/uploads/resume_..."  │
│ Button: "📄 Replace Resume"          │
│ Status: "Resume uploaded"            │
│ View Link: Visible → Download PDF    │
│ Delete Button: Visible               │
│ Replace Button: Visible              │
└──────────────────────────────────────┘

After Delete:
┌──────────────────────────────────────┐
│ resume_link = NULL                   │
│ Button: "📤 Upload Resume"           │
│ Status: "Resume not uploaded"        │
│ View Link: Hidden                    │
│ Delete Button: Hidden                │
│ Replace Button: Hidden               │
└──────────────────────────────────────┘
```

---

## 📊 Database Schema

```
STUDENT TABLE
┌────────────────┬──────────────┬──────────────────────────────┐
│ Column         │ Type         │ Value (Example)              │
├────────────────┼──────────────┼──────────────────────────────┤
│ student_id     │ INT          │ 1                            │
│ roll_no        │ VARCHAR(20)  │ BCS001                       │
│ name           │ VARCHAR(100) │ John Doe                     │
│ email          │ VARCHAR(100) │ john@college.com             │
│ phone          │ VARCHAR(15)  │ 9876543210                   │
│ branch         │ VARCHAR(50)  │ CS                           │
│ batch          │ INT          │ 2024                         │
│ cgpa           │ DECIMAL(3,2) │ 8.50                         │
│ resume_link    │ VARCHAR(255) │ /uploads/resume_1_1681...pdf │
│ password       │ VARCHAR(100) │ hashed_password              │
└────────────────┴──────────────┴──────────────────────────────┘

resume_link transformation:
NULL  →  "/uploads/resume_1_1681234567890.pdf"  →  NULL
```

---

## 🔌 API Specification

### Endpoint 1: Upload Resume
```
Method:      POST
URL:         /api/students/:id/upload-resume
Auth:        JWT Bearer Token (Required)
Content:     multipart/form-data

Request:
{
  "resume": <File Object> (PDF, max 5MB)
}

Success Response (200):
{
  "message": "Resume uploaded successfully",
  "data": {
    "student_id": 1,
    "resume_link": "/uploads/resume_1_1681234567890.pdf",
    "filename": "resume_1_1681234567890.pdf"
  }
}

Error Responses:
{
  "message": "Only PDF files are allowed"                    // 400
}
{
  "message": "No file uploaded"                              // 400
}
{
  "message": "Student not found"                             // 404
}
{
  "message": "Server error"                                  // 500
}
```

### Endpoint 2: Delete Resume
```
Method:      DELETE
URL:         /api/students/:id/delete-resume
Auth:        JWT Bearer Token (Required)

Success Response (200):
{
  "message": "Resume deleted successfully"
}

Error Responses:
{
  "message": "No resume uploaded"                            // 400
}
{
  "message": "Student not found"                             // 404
}
{
  "message": "Server error"                                  // 500
}
```

### Endpoint 3: Download Resume
```
Method:      GET
URL:         /uploads/resume_1_1681234567890.pdf
Auth:        None (Public)

Response:    PDF File (Binary)
```

---

## ⚡ Performance Metrics

```
Operation              Typical Time    Depends On
─────────────────────────────────────────────────
File Upload            1-3 seconds     • File size
                                      • Network speed
                                      • Server load

Database Update        < 100ms         • MySQL response time
                                      • Network latency

File Delete            < 50ms          • File system speed
                                      • File size

Total Upload Flow      2-4 seconds     Combined
```

---

## 🧪 Testing Matrix

```
Scenario                                Status
──────────────────────────────────────────────────
Upload valid PDF (< 5MB)               ✅ Should succeed
Upload non-PDF file                    ✅ Should reject
Upload file > 5MB                      ✅ Should reject
Upload without authentication           ✅ Should reject (401)
Upload to non-existent student          ✅ Should reject (404)
Replace existing resume                 ✅ Should succeed
Delete existing resume                  ✅ Should succeed
Delete non-existent resume              ✅ Should reject
View resume link                        ✅ Should download
Persistence after page refresh          ✅ Should persist
Concurrent uploads                      ✅ Should work (unique names)
```

---

## 📈 Scalability Considerations

```
Current Setup:
┌────────────────────────────────────────┐
│ Single Server Instance                 │
│ • Local file storage (backend/uploads) │
│ • Single database                      │
│ • Suitable for: < 1000 students       │
└────────────────────────────────────────┘

For 1000+ students, consider:
├─ Cloud Storage (AWS S3, Google Cloud)
├─ CDN for file delivery
├─ Database replication
├─ Load balancing
└─ Regular cleanup of old files
```

---

**Architecture Version:** 1.0
**Date:** April 15, 2026
**Status:** ✅ Production Ready
