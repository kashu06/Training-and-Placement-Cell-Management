const { Job, JobEligibility, Company, Application } = require('../models');
const { Op } = require('sequelize');

// ==================== CREATE JOB ====================
const createJob = async (req, res) => {
  try {
    const { company_id, job_title, job_type, min_cgpa, salary, eligible_branches } = req.body;

    if (!company_id || !job_title || !job_type) {
      return res.status(400).json({ message: 'Company ID, job title, and job type are required' });
    }

    const company = await Company.findByPk(company_id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const job = await Job.create({
      company_id,
      job_title,
      job_type,
      min_cgpa: min_cgpa || 0,
      salary: salary || null
    });

    // Add eligible branches if provided
    if (eligible_branches && Array.isArray(eligible_branches)) {
      for (const branch of eligible_branches) {
        await JobEligibility.create({
          job_id: job.job_id,
          branch
        });
      }
    }

    res.status(201).json({
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET ALL JOBS ====================
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        {
          model: Company,
          attributes: { exclude: ['password'] }
        },
        {
          model: JobEligibility,
          attributes: ['branch']
        }
      ]
    });
    res.status(200).json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET JOB BY ID ====================
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: Company,
          attributes: { exclude: ['password'] }
        },
        {
          model: JobEligibility,
          attributes: ['branch']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ data: job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== GET JOBS BY COMPANY ====================
const getJobsByCompany = async (req, res) => {
  try {
    const { company_id } = req.params;

    const jobs = await Job.findAll({
      where: { company_id },
      include: [
        { model: JobEligibility, attributes: ['branch'] }
      ]
    });

    res.status(200).json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== UPDATE JOB ====================
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { job_title, min_cgpa, salary, eligible_branches } = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job_title) job.job_title = job_title;
    if (min_cgpa !== undefined) job.min_cgpa = min_cgpa;
    if (salary !== undefined) job.salary = salary;

    await job.save();

    // Update eligible branches if provided
    if (eligible_branches && Array.isArray(eligible_branches)) {
      await JobEligibility.destroy({ where: { job_id: id } });
      for (const branch of eligible_branches) {
        await JobEligibility.create({
          job_id: id,
          branch
        });
      }
    }

    res.status(200).json({
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DELETE JOB ====================
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.destroy();

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getJobsByCompany,
  updateJob,
  deleteJob
};
