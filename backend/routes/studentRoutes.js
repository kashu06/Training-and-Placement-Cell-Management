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
    // Create unique filename: resume_<student_id>.pdf
    const studentId = req.params.id;
    const timestamp = Date.now();
    cb(null, `resume_${studentId}_${timestamp}.pdf`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
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

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by ID
router.get('/:id', studentController.getStudentById);

// Upload resume
router.post('/:id/upload-resume', authenticate, upload.single('resume'), studentController.uploadResume);

// Delete resume
router.delete('/:id/delete-resume', authenticate, studentController.deleteResume);

// Update student profile
router.put('/:id', authenticate, studentController.updateStudentProfile);

// Delete student
router.delete('/:id', authenticate, authorizeRole(['admin']), studentController.deleteStudent);

module.exports = router;

