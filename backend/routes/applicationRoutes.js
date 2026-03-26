const express = require('express');
const applicationController = require('../controllers/applicationController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Apply for job
router.post('/apply', authenticate, authorizeRole(['student']), applicationController.applyForJob);

// Get all applications
router.get('/', applicationController.getAllApplications);

// Get applications by student
router.get('/student/:student_id', applicationController.getApplicationsByStudent);

// Get applications for job
router.get('/job/:job_id', applicationController.getApplicationsForJob);

// Update application status
router.put('/:id', authenticate, authorizeRole(['company']), applicationController.updateApplicationStatus);

// Delete application
router.delete('/:id', authenticate, applicationController.deleteApplication);

module.exports = router;
