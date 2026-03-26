const express = require('express');
const companyController = require('../controllers/companyController');
const { authenticate, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all companies
router.get('/', companyController.getAllCompanies);

// Get company by ID
router.get('/:id', companyController.getCompanyById);

// Update company
router.put('/:id', authenticate, authorizeRole(['company']), companyController.updateCompany);

// Add location
router.post('/:id/locations', authenticate, authorizeRole(['company']), companyController.addLocation);

// Remove location
router.delete('/:id/locations', authenticate, authorizeRole(['company']), companyController.removeLocation);

// Delete company
router.delete('/:id', authenticate, authorizeRole(['admin', 'company']), companyController.deleteCompany);

module.exports = router;
