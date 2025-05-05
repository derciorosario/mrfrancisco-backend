const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Donation = require('./Donation');

const Donor = sequelize.define('Donor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'donors',
});

Donor.hasMany(Donation, { foreignKey: 'donor_id', as: 'donations' });
Donation.belongsTo(Donor, { foreignKey: 'donor_id', as: 'donor' });

module.exports = Donor;
