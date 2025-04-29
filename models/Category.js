// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path to your Sequelize instance

const Category = sequelize.define('Category', {
  name_en: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name_pt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'categories',
});

const GalleryImage = require('./GalleryImage');

Category.hasMany(GalleryImage, { foreignKey: 'categoryId', as: 'images' });
GalleryImage.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = Category;
