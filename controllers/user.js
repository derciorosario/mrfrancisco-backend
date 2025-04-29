const User = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email} });
      if (!user) {
        return res.status(404).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },   
        process.env.JWT_SECRET,              
        { expiresIn: '90d' }                 
      );
      
      return res.status(200).json({ token:token });
  
    } catch (error) {

      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });

    }


};


const getUserData = async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log(req.user)
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const responseData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {login,getUserData};
