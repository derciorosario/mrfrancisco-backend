require('dotenv').config(); 
const { Sequelize } = require('sequelize');

let DB_NAME=process.env.ENV=="local" ? process.env.DEV_DB_NAME : process.env.DB_NAME
let DB_USER=process.env.ENV=="local" ? process.env.DEV_DB_USER : process.env.DB_USER
let DB_PASSWORD=process.env.ENV=="local" ? process.env.DEV_DB_PASSWORD : process.env.DB_PASSWORD
let DB_HOST=process.env.ENV=="local" ? process.env.DEV_DB_HOST : process.env.DB_HOST
let DB_PORT=process.env.ENV=="local" ? process.env.DEV_DB_PORT : process.env.DB_PORT


const sequelize = new Sequelize({
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  dialect: 'mysql',
  logging: console.log, // Enable logging
});



sequelize.options.logging = false; 
module.exports = sequelize;






