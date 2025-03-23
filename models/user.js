const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único gerado automaticamente pelo MongoDB
 *         username:
 *           type: string
 *           description: Nome de usuário único
 *         email:
 *           type: string
 *           format: email
 *           description: Email único do usuário
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário (não retornada nas consultas)
 *         role:
 *           type: string
 *           enum: [docente, aluno]
 *           description: Função do usuário no sistema
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da conta
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização da conta
 *       example:
 *         _id: 60d21b4667d0d8992e610c80
 *         username: professor1
 *         email: professor@example.com
 *         name: Professor Silva
 *         role: docente
 *         createdAt: 2023-06-01T12:00:00.000Z
 *         updatedAt: 2023-06-01T12:00:00.000Z
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['docente', 'aluno'],
    default: 'aluno'
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Generate auth token
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  
  user.tokens = user.tokens.concat({ token });
  await user.save();
  
  return token;
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  
  next();
});

// Create a JSON response that doesn't include password and tokens
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  
  delete userObject.password;
  delete userObject.tokens;
  
  return userObject;
};

// Login validation
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Credenciais inválidas');
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error('Credenciais inválidas');
  }
  
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;