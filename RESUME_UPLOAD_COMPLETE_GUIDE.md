# Resume Upload Feature - Complete Implementation Guide

## ✅ Implementation Summary

The resume upload feature is now **fully implemented and ready to test**. Here's what was added:

### Files Modified:
1. ✅ `backend/package.json` - Added multer dependency
2. ✅ `backend/server.js` - Added static file serving and uploads directory creation
3. ✅ `backend/controllers/studentController.js` - Added upload and delete handlers
4. ✅ `backend/routes/studentRoutes.js` - Added upload routes with multer config
5. ✅ `frontend/api.js` - Added uploadResume() and deleteResume() methods
6. ✅ `frontend/student-dashboard.js` - Updated profile UI with upload form
7. ✅ `backend/.gitignore` - Added uploads/ directory exclusion

## 🎯 Features Implemented

### Student Features:
- 📤 Upload PDF resumes (max 5MB)
- 🔄 Replace existing resume
- 🗑️ Delete resume with confirmation
- 📄 View/download uploaded resume
- ✅ Real-time status display (uploaded/not uploaded)
- 📱 Responsive UI for all devices

### Backend Features:
- Multer file upload middleware
- PDF validation (MIME type check)
- File size validation (5MB limit)
- Unique filename generation: `resume_<student_id>_<timestamp>.pdf`
- Automatic uploads directory creation
- Database integration with MySQL
- Static file serving for resume downloads

## 🚀 How to Test

### Step 1: Start the Server
```bash
cd backend
npm run dev
```

Expected output:
```
Database connected successfully
Server running on port 5000
```

### Step 2: Login as Student
1. Open the app in browser
2. Go to **Student Login**
3. Enter student credentials

### Step 3: Test Resume Upload
1. Click **My Profile**
2. Scroll down to the Resume section
3. Click **📤 Upload Resume**
4. Select a PDF file from your computer
5. Verify:
   - ✅ Success message appears
   - ✅ Status changes to "Resume uploaded"
   - ✅ "View Resume" link appears
   - ✅ Button changes to "📄 Replace Resume"
   - ✅ "🗑️ Delete Resume" button appears

### Step 4: Test Replace Resume
1. Click **📄 Replace Resume**
2. Select a different PDF file
3. Verify:
   - ✅ Old file is replaced
   - ✅ New filename appears
   - ✅ Success message shown

### Step 5: Test Delete Resume
1. Click **🗑️ Delete Resume**
2. Confirm in the dialog
3. Verify:
   - ✅ Resume status returns to "Resume not uploaded"
   - ✅ Buttons reset to "📤 Upload Resume"
   - ✅ File is deleted from server

### Step 6: Test Validation
1. Try uploading a non-PDF file (e.g., .doc, .txt)
   - ✅ Should show: "Only PDF files are allowed"
2. Try uploading a file > 5MB
   - ✅ Should show: "File size must not exceed 5MB"
3. Try uploading without selecting a file
   - ✅ Should show: "Please select a file"

## 📁 Database Integration

The resume upload uses the **existing** `resume_link` column:

```sql
-- Resume is stored as a file path in the resume_link column
UPDATE student SET resume_link = '/uploads/resume_1_1681234567890.pdf' WHERE student_id = 1;
```

### Example Resume Links:
```
/uploads/resume_1_1681234567890.pdf
/uploads/resume_2_1681234568901.pdf
/uploads/resume_3_1681234569912.pdf
```

## 🗂️ File Storage

### Directory Structure:
```
backend/
├── uploads/                    (AUTO-CREATED)
│   └── resume_1_1681234567890.pdf
│   └── resume_2_1681234568901.pdf
│   └── ...
├── server.js                   (MODIFIED - serves /uploads)
├── controllers/
├── routes/
└── package.json
```

**Note:** The `uploads/` directory is:
- ✅ Auto-created on first upload
- ✅ Excluded from git (.gitignore)
- ✅ Served via `/uploads` route
- ✅ Publicly accessible for downloads

## 🔐 Security

✅ **File Type Validation:**
- Client-side: Only accept .pdf files
- Server-side: Check MIME type = application/pdf

✅ **File Size Limits:**
- Maximum 5MB per file
- Enforced both client and server

✅ **Authentication:**
- JWT token required for upload/delete
- Only own resume can be modified

✅ **Unique Filenames:**
- Format: `resume_<student_id>_<timestamp>.pdf`
- Prevents conflicts and overwriting

✅ **Directory Security:**
- `/uploads` folder not in web root
- Files served via Express middleware
- Proper CORS headers applied

## 📝 API Endpoints

### Upload Resume
```
POST /api/students/:id/upload-resume
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

Request Body:
  - resume: File (PDF, max 5MB)

Response (Success):
{
  "message": "Resume uploaded successfully",
  "data": {
    "student_id": 1,
    "resume_link": "/uploads/resume_1_1681234567890.pdf",
    "filename": "resume_1_1681234567890.pdf"
  }
}

Response (Error):
{
  "message": "Only PDF files are allowed"
}
```

### Delete Resume
```
DELETE /api/students/:id/delete-resume
Authorization: Bearer {jwt_token}

Response (Success):
{
  "message": "Resume deleted successfully"
}

Response (Error):
{
  "message": "No resume uploaded"
}
```

### Download Resume
```
GET /uploads/resume_1_1681234567890.pdf

Opens/downloads the PDF file in browser
```

## 🐛 Troubleshooting

### Issue: "Module not found: multer"
**Solution:** 
```bash
cd backend
npm install multer
```

### Issue: File upload fails silently
**Check:**
1. Is the server running? (`npm run dev`)
2. Is the token valid? (Login again)
3. Is the file a valid PDF?
4. Is the file < 5MB?

### Issue: Can't access `/uploads` directory
**Solution:** Verify server.js has:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

### Issue: Resume not showing after upload
**Solution:**
1. Check browser DevTools console for errors
2. Refresh the page (F5)
3. Check database: `SELECT resume_link FROM student WHERE student_id = ?`

### Issue: Can't delete resume
**Check:**
1. Are you authenticated? (Check token)
2. Does the resume exist? (Check resume_link in DB)
3. Check file permissions on `uploads/` directory

## 🔍 Verification Checklist

- [ ] Server starts without errors
- [ ] "Upload Resume" button appears in profile
- [ ] Can upload a PDF file
- [ ] Status shows "Resume uploaded"
- [ ] "View Resume" link works
- [ ] Can click and download the resume
- [ ] Can replace with a new resume
- [ ] Can delete the resume
- [ ] Non-PDF files are rejected
- [ ] Files > 5MB are rejected
- [ ] Page refresh persists the resume status
- [ ] Works on mobile devices
- [ ] Proper error messages shown

## 📊 Database Schema

### Student Table
```sql
CREATE TABLE student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    branch VARCHAR(50) NOT NULL,
    batch INT NOT NULL,
    cgpa DECIMAL(3,2),
    resume_link VARCHAR(255),    -- ← Stores file path
    password VARCHAR(100) NOT NULL
);
```

**Example Row:**
```sql
| student_id | roll_no | name | email | phone | branch | batch | cgpa | resume_link | password |
|:----------:|:-------:|:----:|:-----:|:-----:|:------:|:-----:|:----:|:-----------:|:--------:|
| 1 | BCS001 | John Doe | john@college.com | 9876543210 | CS | 2024 | 8.50 | /uploads/resume_1_1681234567890.pdf | hashed_password |
| 2 | BCS002 | Jane Smith | jane@college.com | 9876543211 | CS | 2024 | 8.75 | NULL | hashed_password |
```

## 🎯 How It Works (End-to-End)

### Upload Flow:
```
1. Student selects PDF file
2. Frontend validates (type, size)
3. File sent to /api/students/:id/upload-resume
4. Multer saves to backend/uploads/
5. Backend stores file path in DB
6. Frontend shows success & updates UI
7. Resume accessible via /uploads/resume_*.pdf
```

### Delete Flow:
```
1. Student clicks Delete Resume
2. Confirmation dialog shown
3. DELETE request sent to /api/students/:id/delete-resume
4. Backend deletes file from filesystem
5. Backend clears resume_link in DB
6. Frontend updates UI
```

## ⚙️ Configuration

### File Upload Settings (in studentRoutes.js):
```javascript
// Size limit: 5MB
limits: {
  fileSize: 5 * 1024 * 1024
}

// File filter: PDF only
fileFilter: (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
}

// Filename format
filename: (req, file, cb) => {
  const studentId = req.params.id;
  const timestamp = Date.now();
  cb(null, `resume_${studentId}_${timestamp}.pdf`);
}
```

## 📱 Frontend UI Components

### Resume Section (in My Profile):
```
┌─────────────────────────────────────────┐
│ Resume                                  │
│ [● Resume uploaded]                     │
│ File: [View Resume]                     │
│                                         │
│ [📄 Replace Resume] [🗑️ Delete Resume]  │
│ PDF format only • Maximum 5MB           │
└─────────────────────────────────────────┘
```

Or if not uploaded:
```
┌─────────────────────────────────────────┐
│ Resume                                  │
│ [● Resume not uploaded]                 │
│                                         │
│ [📤 Upload Resume]                      │
│ PDF format only • Maximum 5MB           │
└─────────────────────────────────────────┘
```

## 🚢 Production Deployment

Before deploying to production:

1. **Backup uploads directory:**
   ```bash
   cp -r backend/uploads backend/uploads.backup
   ```

2. **Set file size limit at proxy level** (nginx/Apache)

3. **Enable HTTPS** for secure file transmission

4. **Configure CDN** if serving many resume files

5. **Add monitoring** for upload failures

6. **Regular cleanup** of old resume files (optional)

## 📞 Support

If you encounter issues:
1. Check the console (F12) for error messages
2. Check network tab to see API responses
3. Check server logs for backend errors
4. Verify MySQL connection is working
5. Check file permissions on uploads directory

---

**Status:** ✅ Ready for Testing
**Last Updated:** April 15, 2026
