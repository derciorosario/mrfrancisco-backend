const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Audio = sequelize.define('Audio', {
  title_pt: { 
    type: DataTypes.STRING, 
    allowNull: true,
  },
  title_en: { 
    type: DataTypes.STRING, 
    allowNull: true
  },
  description_pt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  filename: { 
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Duration in seconds'
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'File size in bytes'
  },
  format: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Audio format (mp3, wav, etc.)'
  },
  display_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  }
}, {
  tableName: 'audios',
  timestamps: true
});

module.exports = Audio;