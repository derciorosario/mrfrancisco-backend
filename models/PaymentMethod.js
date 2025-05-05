const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentMethod = sequelize.define('PaymentMethod', {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nib: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type:{
    type: DataTypes.TEXT,
    allowNull: false,
  },
  number: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = PaymentMethod;
