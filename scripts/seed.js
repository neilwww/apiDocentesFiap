const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Clear existing data
const clearDatabase = async () => {
  // Drop the entire database instead of just removing documents
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`Dropped collection: ${collection.collectionName}`);
    }
    console.log('Database cleared completely');
  } catch (error) {
    console.log('Database is already empty or error dropping collections:', error.message);
    // Continue with normal delete operations as fallback
    await User.deleteMany({});
    await Post.deleteMany({});
  }
};

// Create sample users
const createUsers = async () => {
  const hashedPassword = await bcrypt.hash('password123', 8);
  
  const users = [
    {
      username: 'professor1',
      email: 'professor1@example.com',
      password: hashedPassword,
      name: 'Professor Silva',
      role: 'docente'
    },
    {
      username: 'professor2',
      email: 'professor2@example.com',
      password: hashedPassword,
      name: 'Professora Oliveira',
      role: 'docente'
    },
    {
      username: 'aluno1',
      email: 'aluno1@example.com',
      password: hashedPassword,
      name: 'João Aluno',
      role: 'aluno'
    },
    {
      username: 'aluno2',
      email: 'aluno2@example.com',
      password: hashedPassword,
      name: 'Maria Estudante',
      role: 'aluno'
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users created`);
  return createdUsers;
};

// Create sample posts
const createPosts = async (users) => {
  const docentes = users.filter(user => user.role === 'docente');
  
  const posts = [
    {
      title: 'Introdução ao Node.js',
      content: 'Node.js é um ambiente de execução JavaScript que permite executar aplicações JavaScript no servidor. Nesta aula, vamos aprender os conceitos básicos de Node.js e como criar uma aplicação simples.',
      author: docentes[0]._id,
      tags: ['nodejs', 'javascript', 'backend'],
      authorType: 'docente'
    },
    {
      title: 'Express.js: Criando APIs REST',
      content: 'Express é um framework web rápido, flexível e minimalista para Node.js. Nesta aula, vamos aprender a criar APIs REST usando Express e MongoDB.',
      author: docentes[0]._id,
      tags: ['express', 'api', 'rest', 'nodejs'],
      authorType: 'docente'
    },
    {
      title: 'Bancos de Dados NoSQL: MongoDB',
      content: 'MongoDB é um banco de dados NoSQL orientado a documentos. Nesta aula, vamos explorar como modelar dados no MongoDB e como realizar operações CRUD básicas.',
      author: docentes[1]._id,
      tags: ['mongodb', 'nosql', 'database'],
      authorType: 'docente'
    },
    {
      title: 'Autenticação com JWT',
      content: 'JSON Web Tokens (JWT) são um método compacto e seguro para transferir informações entre partes como um objeto JSON. Nesta aula, vamos implementar autenticação usando JWT em nossa API.',
      author: docentes[1]._id,
      tags: ['jwt', 'authentication', 'security'],
      authorType: 'docente'
    },
    {
      title: 'Docker para Desenvolvimento',
      content: 'Docker é uma plataforma que facilita a criação e administração de ambientes isolados. Nesta aula, vamos aprender a usar Docker para desenvolvimento de aplicações Node.js.',
      author: docentes[0]._id,
      tags: ['docker', 'containers', 'devops'],
      authorType: 'docente'
    }
  ];

  const createdPosts = await Post.insertMany(posts);
  console.log(`${createdPosts.length} posts created`);
};

// Run the seeding process
const seedDatabase = async () => {
  try {
    await clearDatabase();
    const users = await createUsers();
    await createPosts(users);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();