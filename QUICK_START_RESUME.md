# Resume Upload Feature - Quick Start

## 🎉 Implementation Complete!

All components are ready. Here's how to start testing immediately:

## ⚡ 30-Second Setup

```bash
# Terminal 1: Start Backend
cd "c:\Users\kashi\OneDrive\Desktop\tpo website\backend"
npm run dev

# Terminal 2: Open Frontend (if needed)
cd "c:\Users\kashi\OneDrive\Desktop\tpo website"
# Open index.html in browser or run your dev server
```

## ✅ What Was Implemented

| Component | Status | Details |
|-----------|--------|---------|
| Backend Upload Endpoint | ✅ | POST /api/students/:id/upload-resume |
| Backend Delete Endpoint | ✅ | DELETE /api/students/:id/delete-resume |
| Static File Serving | ✅ | /uploads folder accessible via /uploads route |
| Database Integration | ✅ | resume_link column in student table |
| Frontend Upload Button | ✅ | "Upload Resume" in student profile |
| File Validation | ✅ | PDF only, max 5MB |
| Status Display | ✅ | "Resume uploaded/not uploaded" badge |
| Download Link | ✅ | "View Resume" link to download file |
| Replace Functionality | ✅ | Change button to "Replace Resume" |
| Delete Functionality | ✅ | "Delete Resume" button with confirmation |

## 🧪 Test Immediately

### Test 1: Upload Resume
1. Login as Student
2. Go to **My Profile**
3. Click **📤 Upload Resume**
4. Select any PDF file
5. ✅ Should show: "Resume uploaded successfully!"
6. ✅ Status changes to "Resume uploaded"
7. ✅ "View Resume" link appears

### Test 2: Validation
Try these invalid uploads:
- Non-PDF file → "Only PDF files are allowed"
- File > 5MB → "File size must not exceed 5MB"
- No file selected → "Please select a file"

### Test 3: Replace & Delete
1. Click **📄 Replace Resume** → Upload new file
2. Click **🗑️ Delete Resume** → Confirm → File deleted
3. Status returns to "Resume not uploaded"

### Test 4: Persistence
1. Upload resume
2. Refresh page (F5)
3. ✅ Resume status should persist

## 📂 How Files Are Stored

```
Location: backend/uploads/resume_<student_id>_<timestamp>.pdf
Example: backend/uploads/resume_1_1681234567890.pdf

Accessible via: http://localhost:5000/uploads/resume_1_1681234567890.pdf
```

## 🔗 Database Update

After upload, the `resume_link` column is updated:

```sql
-- Before
resume_link = NULL

-- After
resume_link = "/uploads/resume_1_1681234567890.pdf"
```

Query in MySQL:
```bash
mysql> SELECT student_id, name, resume_link FROM student WHERE resume_link IS NOT NULL;
```

## 🚀 API Endpoints

### Upload
```
POST /api/students/1/upload-resume
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
  resume: <PDF file>

Response:
{
  "message": "Resume uploaded successfully",
  "data": {
    "student_id": 1,
    "resume_link": "/uploads/resume_1_1681234567890.pdf",
    "filename": "resume_1_1681234567890.pdf"
  }
}
```

### Delete
```
DELETE /api/students/1/delete-resume
Authorization: Bearer {token}

Response:
{
  "message": "Resume deleted successfully"
}
```

## 📁 Files Modified

```
backend/
  ├── package.json                      ← Added multer
  ├── server.js                         ← Added static file serving
  ├── .gitignore                        ← Added uploads/
  ├── controllers/
  │   └── studentController.js          ← Added upload/delete handlers
  └── routes/
      └── studentRoutes.js              ← Added upload/delete routes
      
frontend/
  ├── api.js                            ← Added uploadResume/deleteResume
  └── student-dashboard.js              ← Updated profile UI
```

## 🐛 If Something Doesn't Work

### Server won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check dependencies
npm list multer
```

### Files not uploading
1. Check server console for errors
2. Verify file is a valid PDF
3. Verify file size < 5MB
4. Check authentication token

### Can't see View Resume link
1. Check if resume_link is in database
2. Try: http://localhost:5000/uploads/resume_1_1234567890.pdf
3. Refresh page to reload from server

### Delete doesn't work
1. Verify resume exists (check DB)
2. Check file permissions on backend/uploads/
3. Verify authentication token

## ✨ Features Summary

✅ **Upload**: Drag-drop or click to select PDF
✅ **Validate**: Client + Server validation (type, size)
✅ **Store**: Unique filenames prevent conflicts
✅ **Display**: Status badge and download link
✅ **Replace**: Upload new resume to overwrite
✅ **Delete**: Remove resume with confirmation
✅ **Persist**: Data saved in MySQL
✅ **Serve**: Files accessible via /uploads route
✅ **Secure**: JWT authentication, file validation
✅ **Responsive**: Works on mobile and desktop

## 📊 Testing Checklist

- [ ] Server starts: `npm run dev` ✅
- [ ] Multer installed: `npm list multer` ✅
- [ ] Can upload PDF ✅
- [ ] Status changes to "uploaded" ✅
- [ ] View link works ✅
- [ ] Can replace resume ✅
- [ ] Can delete resume ✅
- [ ] Non-PDF rejected ✅
- [ ] Large files rejected ✅
- [ ] Data persists on page refresh ✅

## 🎯 Next Steps

1. **Start server**: `npm run dev`
2. **Open app**: http://localhost:3000 (or your frontend URL)
3. **Login as student**
4. **Go to My Profile**
5. **Test upload functionality**
6. **Check database**: `SELECT * FROM student WHERE student_id = 1;`

---

**Questions?** Check RESUME_UPLOAD_COMPLETE_GUIDE.md for detailed documentation.
