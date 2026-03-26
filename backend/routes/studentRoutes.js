const express = require('express');
const studentController = require('../controllers/studentController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by ID
router.get('/:id', studentController.getStudentById);

// Update student profile
router.put('/:id', authenticate, studentController.updateStudentProfile);

// Delete student
router.delete('/:id', authenticate, authorizeRole(['admin']), studentController.deleteStudent);

module.exports = router;
