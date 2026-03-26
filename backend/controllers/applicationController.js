const { Application, Job, Student, JobEligibility, Company } = require('../models');

// ==================== APPLY FOR JOB ====================
const applyForJob = async (req, res) => {
  try {
    const { student_id, job_id } = req.body;

    if (!student_id || !job_id) {
      return res.status(400).json({ message: 'Student ID and Job ID are required' });
    }

    // Check if student exists
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if job exists
    const job = await Job.findByPk(job_id, {
      include: [{ model: JobEligibility }]
    });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if student already applied
    const existingApplication = await Application.findOne({
      where: { student_id, job_id }
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'Student has already applied for this job' });
    }

    // Check CGPA eligibility
    if (job.min_cgpa && student.cgpa < job.min_cgpa) {
      return res.status(400).json({
        message: `Your CGPA (${student.cgpa}) is below the minimum required CGPA (${job.min_cgpa})`
      });
    }

    // Check branch eligibility
    const eligibleBranches = job.JobEligibilities.map(e => e.branch);
    if (eligibleBranches.length > 0 && !eligibleBranches.includes(student.branch)) {
      return res.status(400).json({
        message: `Your branch (${student.branch}) is not eligible for this job. Eligible branches: ${eligibleBranches.join(', ')}`
      });
    }

    // Create application
    const application = await Application.create({
      student_id,
      job_id,
      application_date: new Date(),
      status: 'Applied'
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Student has already applied for this job' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET ALL APPLICATIONS ====================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        {
          model: Student,
          attributes: { exclude: ['password'] }
        },
        {
          model: Job,
          attributes: ['job_id', 'job_title', 'job_type', 'salary'],
          include: [{ model: Company, attributes: ['company_name'] }]
        }
      ]
    });
    res.status(200).json({ data: applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET APPLICATIONS BY STUDENT ====================
const getApplicationsByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

    const applications = await Application.findAll({
      where: { student_id },
      include: [
        {
          model: Job,
          attributes: ['job_id', 'job_title', 'job_type', 'salary', 'min_cgpa'],
          include: [{ model: Company, attributes: ['company_name', 'email'] }]
        }
      ]
    });

    res.status(200).json({ data: applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET APPLICATIONS FOR JOB ====================
const getApplicationsForJob = async (req, res) => {
  try {
    const { job_id } = req.params;

    const applications = await Application.findAll({
      where: { job_id },
      include: [
        {
          model: Student,
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.status(200).json({ data: applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== UPDATE APPLICATION STATUS ====================
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Applied', 'Shortlisted', 'Selected', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DELETE APPLICATION ====================
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await application.destroy();

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyForJob,
  getAllApplications,
  getApplicationsByStudent,
  getApplicationsForJob,
  updateApplicationStatus,
  deleteApplication
};
