const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const Job = sequelize.define('Job', {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Company,
      key: 'company_id'
    },
    onDelete: 'CASCADE'
  },
  job_title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  job_type: {
    type: DataTypes.ENUM('Internship', 'Full-Time'),
    allowNull: false
  },
  min_cgpa: {
    type: DataTypes.DECIMAL(3, 2),
    validate: {
      min: 0,
      max: 10
    }
  },
  salary: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'job',
  timestamps: false
});

Job.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(Job, { foreignKey: 'company_id' });

module.exports = Job;
