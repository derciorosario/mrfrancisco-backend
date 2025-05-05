const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Volunteer = sequelize.define('Volunteer', {
  logo_filename:{
    type: DataTypes.STRING,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_pt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role_en: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    set(value) {
        this.setDataValue('date_of_birth', value === "" || value === undefined ? null : value);
    }
  },
  phone: {
    type: DataTypes.STRING,
  },
  whatsapp_contact: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue:'pending'
  },
  email: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  description_pt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'volunteers',
});

module.exports = Volunteer;
