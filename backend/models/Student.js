const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roll_no: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(15)
  },
  branch: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  batch: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cgpa: {
    type: DataTypes.DECIMAL(3, 2),
    validate: {
      min: 0,
      max: 10
    }
  },
  resume_link: {
    type: DataTypes.STRING(255)
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'student',
  timestamps: false
});

module.exports = Student;
