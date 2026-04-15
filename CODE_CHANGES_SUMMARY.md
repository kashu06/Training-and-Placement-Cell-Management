# Code Changes Summary

## Files Modified (7 Total)

### 1. backend/package.json
**Added multer dependency:**
```json
"multer": "^1.4.5-lts.1"
```

---

### 2. backend/server.js
**Added:**
- Imports: `path`, `fs`
- Auto-create uploads directory
- Serve static files from /uploads

```javascript
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

---

### 3. backend/.gitignore
**Added:**
```
uploads/
```

---

### 4. backend/controllers/studentController.js
**Added 2 new functions:**

```javascript
// ==================== UPLOAD RESUME ====================
const uploadResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    student.resume_link = filePath;
    await student.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      data: {
        student_id: student.student_id,
        resume_link: student.resume_link,
        filename: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DELETE RESUME ====================
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.resume_link) {
      return res.status(400).json({ message: 'No resume uploaded' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', student.resume_link);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update database
    student.resume_link = null;
    await student.save();

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Updated exports
module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentProfile,
  deleteStudent,
  uploadResume,        // NEW
  deleteResume         // NEW
};
```

---

### 5. backend/routes/studentRoutes.js
**Added multer config and 2 new routes:**

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const studentController = require('../controllers/studentController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const studentId = req.params.id;
    const timestamp = Date.now();
    cb(null, `resume_${studentId}_${timestamp}.pdf`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// NEW ROUTES:
router.post('/:id/upload-resume', authenticate, upload.single('resume'), studentController.uploadResume);
router.delete('/:id/delete-resume', authenticate, studentController.deleteResume);
```

---

### 6. frontend/api.js
**Added 2 new methods:**

```javascript
async uploadResume(id, file) {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const options = {
      method: 'POST',
      headers: {
        ...(this.token && { 'Authorization': `Bearer ${this.token}` })
      },
      body: formData
    };

    const response = await fetch(`${API_BASE_URL}/students/${id}/upload-resume`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload resume');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

async deleteResume(id) {
  try {
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };

    const response = await fetch(`${API_BASE_URL}/students/${id}/delete-resume`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete resume');
    }

    return data;
  } catch (error) {
    throw error;
  }
}
```

---

### 7. frontend/student-dashboard.js
**Updated showStudentProfile() function and added 2 handler functions:**

```javascript
// UPDATED: showStudentProfile() now includes resume section with:
// - Status badge (uploaded/not uploaded)
// - Upload button
// - View Resume link (if uploaded)
// - Replace Resume button (if uploaded)
// - Delete Resume button (if uploaded)

// NEW: handleResumeUpload()
async function handleResumeUpload(event) {
  const files = event.target.files;
  
  if (!files || files.length === 0) {
    showAlert('Please select a file', 'error');
    return;
  }

  const file = files[0];

  // Validate file type
  if (file.type !== 'application/pdf') {
    showAlert('Only PDF files are allowed', 'error');
    document.getElementById('resume-file-input').value = '';
    return;
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    showAlert('File size must not exceed 5MB', 'error');
    document.getElementById('resume-file-input').value = '';
    return;
  }

  try {
    const response = await api.uploadResume(currentUser.student_id, file);
    showAlert('Resume uploaded successfully!', 'success');
    showStudentProfile(document.getElementById('section-content'));
  } catch (error) {
    showAlert(error.message || 'Failed to upload resume', 'error');
    document.getElementById('resume-file-input').value = '';
  }
}

// NEW: deleteStudentResume()
async function deleteStudentResume() {
  if (!confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
    return;
  }

  try {
    await api.deleteResume(currentUser.student_id);
    showAlert('Resume deleted successfully', 'success');
    showStudentProfile(document.getElementById('section-content'));
  } catch (error) {
    showAlert(error.message || 'Failed to delete resume', 'error');
  }
}
```

---

## Dependencies

### Added:
- `multer@^1.4.5-lts.1` - File upload middleware for Node.js

### Already Present (Used):
- `express` - Web framework
- `sequelize` - ORM for MySQL
- `mysql2` - MySQL driver
- `cors` - Cross-origin resource sharing

---

## Database Schema (No Changes Required)

The existing `resume_link` VARCHAR(255) column in the `student` table is used to store file paths:

```sql
-- Before upload
resume_link = NULL

-- After upload
resume_link = "/uploads/resume_1_1681234567890.pdf"
```

---

## API Endpoints Added

### 1. Upload Resume
```
POST /api/students/:id/upload-resume
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}
```

### 2. Delete Resume
```
DELETE /api/students/:id/delete-resume
Authorization: Bearer {jwt_token}
```

---

## How It Works

### Upload Flow:
```
Frontend (UI) 
  ↓ (user clicks button)
File Input (browser native)
  ↓ (user selects PDF)
handleResumeUpload() - validation
  ↓ (checks type, size)
api.uploadResume() - FormData
  ↓ (sends to backend)
POST /api/students/:id/upload-resume
  ↓ (multer middleware)
Multer diskStorage
  ↓ (saves file)
backend/uploads/resume_1_1681234567890.pdf
  ↓
studentController.uploadResume()
  ↓ (updates database)
student.resume_link = "/uploads/resume_1_1681234567890.pdf"
  ↓
Database (MySQL)
  ↓
Frontend receives response
  ↓
UI Updates to show "Resume uploaded"
```

---

## Testing Commands

```bash
# Check multer is installed
npm list multer

# Start server
npm run dev

# Check uploads directory created
ls -la backend/uploads/

# View database
mysql -u root -p
SELECT student_id, resume_link FROM student;
```

---

## File Locations Reference

- **Frontend HTML**: `frontend/index.html`
- **Frontend JS**: `frontend/student-dashboard.js`
- **Frontend API**: `frontend/api.js`
- **Backend Controller**: `backend/controllers/studentController.js`
- **Backend Routes**: `backend/routes/studentRoutes.js`
- **Backend Server**: `backend/server.js`
- **Uploaded Files**: `backend/uploads/resume_*.pdf`

---

## Rollback Instructions (if needed)

If you need to undo changes:

```bash
# Restore original files from git
git checkout backend/package.json backend/server.js backend/.gitignore
git checkout backend/controllers/studentController.js backend/routes/studentRoutes.js
git checkout frontend/api.js frontend/student-dashboard.js

# Remove uploads directory
rm -rf backend/uploads

# Reinstall dependencies
npm install
```

---

**Implementation Date:** April 15, 2026
**Status:** ✅ Complete and Ready for Testing
