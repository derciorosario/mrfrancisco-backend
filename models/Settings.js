  const { DataTypes } = require('sequelize');
  const sequelize = require('../config/db');
  
  const Settings = sequelize.define('Settings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: false
      }
  }, {
    timestamps: true,
    tableName: 'settings',
  });
  
  module.exports = Settings;
  
  