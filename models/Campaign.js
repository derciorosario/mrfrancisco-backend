// models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust this path to your sequelize instance

const Campaign=sequelize.define('Campaign', {
  insert_amount_raised_manually: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  raised:{
    type: DataTypes.BIGINT,
    allowNull: true,
    set(value) {
      this.setDataValue('raised', value == "" || value == undefined ? 0 : value);
    }
  },
  title_pt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title_en: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  goal_pt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  goal_en: {
    type: DataTypes.STRING,
    allowNull: true,
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
    set(value) {
      this.setDataValue('goal', value == "" || value == undefined ? 0 : value);
    }
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
const CampaignImage = require('./CampaignImage');
Campaign.hasMany(Donation, { foreignKey: 'campaign_id', as: 'donations' });
Donation.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign' });

Campaign.hasMany(CampaignImage, { foreignKey: 'campaign_id', as: 'images' });
CampaignImage.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'Campaign' });


module.exports = Campaign;
