// models/Donation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust to your database config

const Donation = sequelize.define('Donation', {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_method:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  proof: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'donations'
});



module.exports = Donation;
