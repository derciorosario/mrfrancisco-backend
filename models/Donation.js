// models/Donation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust to your database config

const Donation = sequelize.define('Donation', {

  payment_method:{
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:'mpesa'
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
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    set(value) {
      this.setDataValue('donor_id', value === "" || value === undefined ? null : value);
    }
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
