const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./Company');

const CompanyLocation = sequelize.define('CompanyLocation', {
  company_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Company,
      key: 'company_id'
    },
    onDelete: 'CASCADE'
  },
  location: {
    type: DataTypes.STRING(100),
    primaryKey: true
  }
}, {
  tableName: 'company_location',
  timestamps: false
});

CompanyLocation.belongsTo(Company, { foreignKey: 'company_id' });
Company.hasMany(CompanyLocation, { foreignKey: 'company_id' });

module.exports = CompanyLocation;
