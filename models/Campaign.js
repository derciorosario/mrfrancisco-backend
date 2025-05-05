// models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust this path to your sequelize instance

const  Campaign= sequelize.define('Campaign', {
  title_pt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title_en: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_filename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status:{
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:'in-progress'
  },
  description_pt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  goal: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  report_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  youtube_link:{
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'campaigns'
});

const Donation = require('./Donation');
Campaign.hasMany(Donation, { foreignKey: 'campaign_id', as: 'donations' });
Donation.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });


module.exports = Campaign;
