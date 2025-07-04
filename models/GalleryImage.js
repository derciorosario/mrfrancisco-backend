// models/GalleryImage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path to your Sequelize instance

const GalleryImage = sequelize.define('GalleryImage', {
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
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'gallery_images',
});

module.exports = GalleryImage;
