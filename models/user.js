const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
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
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  const user = this;
  
  if (user.isModified('password') && user.password) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  
  next();
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  
  delete userObject.password;
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;