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

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentProfile,
  deleteStudent
};
