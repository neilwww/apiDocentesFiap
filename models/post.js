const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único gerado automaticamente pelo MongoDB
 *         title:
 *           type: string
 *           description: Título da postagem
 *         content:
 *           type: string
 *           description: Conteúdo da postagem
 *         author:
 *           type: string
 *           description: ID do usuário que criou a postagem
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de tags associadas à postagem
 *         likes:
 *           type: number
 *           description: Número de curtidas da postagem
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da postagem
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização da postagem
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         title: Introdução ao Node.js
 *         content: Nesta aula vamos aprender os conceitos básicos de Node.js
 *         author: 60d21b4667d0d8992e610c80
 *         tags: [nodejs, javascript, backend]
 *         likes: 5
 *         createdAt: 2023-06-01T12:00:00.000Z
 *         updatedAt: 2023-06-01T12:00:00.000Z
 */

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: {
    type: Number,
    default: 0
  },
  authorType: {
    type: String,
    enum: ['docente', 'aluno'],
    default: 'docente'
  }
}, {
  timestamps: true
});

// Índice para facilitar a busca por palavras-chave no título e conteúdo
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);