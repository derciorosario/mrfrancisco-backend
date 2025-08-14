const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Homily = sequelize.define('Homily', {
  title_pt: {
    type: DataTypes.STRING,
    allowNull: true
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
  display_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  youtube_link: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  }
}, {
  tableName: 'homilies',
  timestamps: true
});

module.exports = Homily;