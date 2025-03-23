const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      throw new Error('No Authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    const user = await User.findOne({ _id: decoded._id });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Autenticação necessária' });
  }
};

const isDocente = async (req, res, next) => {
  if (req.user.role !== 'docente') {
    return res.status(403).json({ message: 'Acesso negado: apenas docentes podem realizar esta ação' });
  }
  next();
};

module.exports = { auth, isDocente };