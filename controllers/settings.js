// controllers/settingController.js
const Setting = require("../models/Settings");

exports.createDefaultSettings = async () => {
    try {
      const existing = await Setting.findOne();
  
      if (!existing) {
        const defaultSettings = {
          
        };
        await Setting.create({
          settings: defaultSettings
        });
  
        console.log('Default settings created.');
      } else {
        console.log('Default settings already exist.');
      }
    } catch (error) {
      console.error('Error creating default settings:', error.message);
    }
};

exports.upsertSetting = async (req, res) => {
  try {
    const existingSettings=await Setting.findOne()
    await existingSettings.update({
      id: existingSettings.id,
      settings:req.body
    });
    return res.status(200).json({ message:  'Updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get the current settings
exports.getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    return res.status(200).json(setting.settings);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
