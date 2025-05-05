// models/Event.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // your db connection

const Event = sequelize.define('Event', {
  title_pt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title_en: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.TIME,
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
  description_pt: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description_en: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'events'
});

module.exports = Event;
