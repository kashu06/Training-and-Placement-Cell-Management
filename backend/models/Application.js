const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Job = require('./Job');

const Application = sequelize.define('Application', {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: 'student_id'
    },
    onDelete: 'CASCADE'
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: 'job_id'
    },
    onDelete: 'CASCADE'
  },
  application_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('Applied', 'Shortlisted', 'Selected', 'Rejected'),
    defaultValue: 'Applied'
  }
}, {
  tableName: 'application',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'job_id']
    }
  ]
});

Application.belongsTo(Student, { foreignKey: 'student_id' });
Application.belongsTo(Job, { foreignKey: 'job_id' });
Student.hasMany(Application, { foreignKey: 'student_id' });
Job.hasMany(Application, { foreignKey: 'job_id' });

module.exports = Application;
