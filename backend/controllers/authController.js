const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin, Student, Company } = require('../models');

const generateToken = (user, role) => {
  return jwt.sign(
    {
      id: user.admin_id || user.student_id || user.company_id,
      email: user.email,
      role: role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ==================== ADMIN SIGNUP ====================
const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(admin, 'admin');
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: { admin_id: admin.admin_id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== ADMIN LOGIN ====================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(admin, 'admin');
    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: { admin_id: admin.admin_id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== STUDENT SIGNUP ====================
const studentSignup = async (req, res) => {
  try {
    const { roll_no, name, email, phone, branch, batch, cgpa, password } = req.body;

    if (!roll_no || !name || !email || !branch || !batch || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const existingRollNo = await Student.findOne({ where: { roll_no } });
    if (existingRollNo) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      roll_no,
      name,
      email,
      phone,
      branch,
      batch,
      cgpa: cgpa || 0,
      password: hashedPassword
    });

    const token = generateToken(student, 'student');
    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: { 
        student_id: student.student_id, 
        name: student.name, 
        email: student.email,
        roll_no: student.roll_no,
        branch: student.branch
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== STUDENT LOGIN ====================
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(student, 'student');
    res.status(200).json({
      message: 'Student login successful',
      token,
      user: { 
        student_id: student.student_id, 
        name: student.name, 
        email: student.email,
        roll_no: student.roll_no,
        branch: student.branch,
        cgpa: student.cgpa
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== COMPANY SIGNUP ====================
const companySignup = async (req, res) => {
  try {
    const { company_name, email, phone, password } = req.body;

    if (!company_name || !email || !password) {
      return res.status(400).json({ message: 'Company name, email, and password are required' });
    }

    const existingCompany = await Company.findOne({ where: { email } });
    if (existingCompany) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.create({
      company_name,
      email,
      phone,
      password: hashedPassword
    });

    const token = generateToken(company, 'company');
    res.status(201).json({
      message: 'Company registered successfully',
      token,
      user: { 
        company_id: company.company_id, 
        company_name: company.company_name, 
        email: company.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== COMPANY LOGIN ====================
const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const company = await Company.findOne({ where: { email } });
    if (!company) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(company, 'company');
    res.status(200).json({
      message: 'Company login successful',
      token,
      user: { 
        company_id: company.company_id, 
        company_name: company.company_name, 
        email: company.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  adminSignup,
  adminLogin,
  studentSignup,
  studentLogin,
  companySignup,
  companyLogin
};
