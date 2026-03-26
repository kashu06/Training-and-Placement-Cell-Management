const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard/stats', authenticate, authorizeRole(['admin']), adminController.getDashboardStats);

// Get all students
router.get('/students', authenticate, authorizeRole(['admin']), adminController.getAllStudents);

// Get all companies
router.get('/companies', authenticate, authorizeRole(['admin']), adminController.getAllCompanies);

// Get all jobs
router.get('/jobs', authenticate, authorizeRole(['admin']), adminController.getAllJobs);

// Get all applications
router.get('/applications', authenticate, authorizeRole(['admin']), adminController.getAllApplications);

module.exports = router;
