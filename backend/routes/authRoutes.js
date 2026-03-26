const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Admin routes
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/login', authController.adminLogin);

// Student routes
router.post('/student/signup', authController.studentSignup);
router.post('/student/login', authController.studentLogin);

// Company routes
router.post('/company/signup', authController.companySignup);
router.post('/company/login', authController.companyLogin);

module.exports = router;
