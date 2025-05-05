// models/Contact.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contact = sequelize.define('Contact', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'contacts'
});

module.exports = Contact;