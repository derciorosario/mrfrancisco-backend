
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


// models/Feedback.js
const Feedback = sequelize.define('Feedback', {
    name: { type: DataTypes.STRING, allowNull: false },
    comments: { type: DataTypes.TEXT, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'feedbacks'
  });

  module.exports = Feedback;