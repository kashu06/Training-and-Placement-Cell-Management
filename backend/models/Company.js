const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  company_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  company_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true
  },
  phone: {
    type: DataTypes.STRING(15)
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'company',
  timestamps: false
});

module.exports = Company;
