const { Student } = require('../models');

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

// ==================== GET STUDENT BY ID ====================
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ data: student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== UPDATE STUDENT PROFILE ====================
const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, cgpa, resume_link } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (cgpa !== undefined) {
      if (cgpa < 0 || cgpa > 10) {
        return res.status(400).json({ message: 'CGPA must be between 0 and 10' });
      }
      student.cgpa = cgpa;
    }

    if (phone) student.phone = phone;
    if (resume_link) student.resume_link = resume_link;

    await student.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DELETE STUDENT ====================
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== UPLOAD RESUME ====================
const uploadResume = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check file type (must be PDF)
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    // Find student
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Save the file path to database
    const filePath = `/uploads/${req.file.filename}`;
    student.resume_link = filePath;
    await student.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      data: {
        student_id: student.student_id,
        resume_link: student.resume_link,
        filename: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== DELETE RESUME ====================
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const fs = require('fs');
    const path = require('path');

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.resume_link) {
      return res.status(400).json({ message: 'No resume uploaded' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', student.resume_link);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update database
    student.resume_link = null;
    await student.save();

    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentProfile,
  deleteStudent,
  uploadResume,
  deleteResume
};
