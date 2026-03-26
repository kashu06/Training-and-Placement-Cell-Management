const express = require('express');
const jobController = require('../controllers/jobController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Create job
router.post('/', authenticate, authorizeRole(['company']), jobController.createJob);

// Get all jobs
router.get('/', jobController.getAllJobs);

// Get job by ID
router.get('/:id', jobController.getJobById);

// Get jobs by company
router.get('/company/:company_id', jobController.getJobsByCompany);

// Update job
router.put('/:id', authenticate, authorizeRole(['company']), jobController.updateJob);

// Delete job
router.delete('/:id', authenticate, authorizeRole(['company']), jobController.deleteJob);

module.exports = router;
