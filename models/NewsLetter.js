
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// models/Newsletter.js
const Newsletter = sequelize.define('Newsletter', {
    email: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'newsletters'
  });
  
module.exports = Newsletter;