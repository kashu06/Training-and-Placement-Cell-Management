const express = require('express');
const studentController = require('../controllers/studentController');
const { authenticate, authorizeRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `resume_${req.params.id}_${Date.now()}.pdf`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by ID
router.get('/:id', studentController.getStudentById);

// Update student profile
router.put('/:id', authenticate, studentController.updateStudentProfile);

// Delete student
router.delete('/:id', authenticate, authorizeRole(['admin']), studentController.deleteStudent);

// Upload resume
router.post('/:id/upload-resume', authenticate, upload.single('resume'), studentController.uploadResume);

// Delete resume
router.delete('/:id/delete-resume', authenticate, studentController.deleteResume);

module.exports = router;
