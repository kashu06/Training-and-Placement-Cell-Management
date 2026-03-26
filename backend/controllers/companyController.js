const { Company, CompanyLocation } = require('../models');

// ==================== GET ALL COMPANIES ====================
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: CompanyLocation, attributes: ['location'] }]
    });
    res.status(200).json({ data: companies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET COMPANY BY ID ====================
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: CompanyLocation, attributes: ['location'] }]
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ data: company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== UPDATE COMPANY ====================
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, phone } = req.body;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company_name) company.company_name = company_name;
    if (phone) company.phone = phone;

    await company.save();

    res.status(200).json({
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== ADD COMPANY LOCATION ====================
const addLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await CompanyLocation.create({
      company_id: id,
      location
    });

    res.status(201).json({ message: 'Location added successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Location already exists for this company' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DELETE COMPANY LOCATION ====================
const removeLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const result = await CompanyLocation.destroy({
      where: {
        company_id: id,
        location
      }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({ message: 'Location removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DELETE COMPANY ====================
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.destroy();

    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  updateCompany,
  addLocation,
  removeLocation,
  deleteCompany
};
