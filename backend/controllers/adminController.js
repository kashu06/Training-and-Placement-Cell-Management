const { Admin, Student, Company, Job, Application } = require('../models');

// ==================== GET DASHBOARD STATS ====================
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalCompanies = await Company.count();
    const totalJobs = await Job.count();
    const totalApplications = await Application.count();

    const applicationStats = await Application.findAll({
      attributes: ['status'],
      raw: true
    });

    const statusCount = {
      applied: 0,
      shortlisted: 0,
      selected: 0,
      rejected: 0
    };

    applicationStats.forEach(app => {
      if (app.status === 'Applied') statusCount.applied++;
      else if (app.status === 'Shortlisted') statusCount.shortlisted++;
      else if (app.status === 'Selected') statusCount.selected++;
      else if (app.status === 'Rejected') statusCount.rejected++;
    });

    res.status(200).json({
      stats: {
        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications,
        applicationStatuses: statusCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET ALL STUDENTS ====================
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({ data: students });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET ALL COMPANIES ====================
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json({ data: companies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET ALL JOBS ====================
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [{ model: Company, attributes: ['company_name'] }]
    });
    res.status(200).json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET ALL APPLICATIONS ====================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        { model: Student, attributes: { exclude: ['password'] } },
        {
          model: Job,
          include: [{ model: Company, attributes: ['company_name'] }]
        }
      ]
    });
    res.status(200).json({ data: applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllStudents,
  getAllCompanies,
  getAllJobs,
  getAllApplications
};
