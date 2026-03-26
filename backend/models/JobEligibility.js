const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Job = require('./Job');

const JobEligibility = sequelize.define('JobEligibility', {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Job,
      key: 'job_id'
    },
    onDelete: 'CASCADE'
  },
  branch: {
    type: DataTypes.STRING(50),
    primaryKey: true
  }
}, {
  tableName: 'job_eligibility',
  timestamps: false
});

JobEligibility.belongsTo(Job, { foreignKey: 'job_id' });
Job.hasMany(JobEligibility, { foreignKey: 'job_id' });

module.exports = JobEligibility;
