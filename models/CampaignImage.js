// models/CampaignImage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path to your Sequelize instance

const CampaignImage = sequelize.define('CampaignImage', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title_en: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title_pt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'campaign_images',
});

module.exports = CampaignImage;
