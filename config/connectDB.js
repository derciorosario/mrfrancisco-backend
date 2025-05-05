require('dotenv').config(); 
const { restoreFolders } = require('../backup-and-restore');
const User = require('../models/user');
const sequelize = require('./db')
const bcrypt = require('bcrypt');

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    createAdminUser()
    restoreFolders()
    await sequelize.sync()
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


function createAdminUser(){
  (async () => {
    try {
      const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
      const existingAdmin = await User.findOne({ where: { email: adminEmail } });

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

        await User.create({
          name: process.env.DEFAULT_ADMIN_NAME,
          email: adminEmail,
          password: hashedPassword,
          role: 'admin',
        });

        console.log('Default admin user created.');
      } else {
        console.log('Default admin user already exists.');
      }
    } catch (error) {
      console.error('Error creating default admin user:', error);
    }

  })();


}
module.exports=startServer;


