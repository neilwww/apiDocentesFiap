const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User Posts API',
    version: '1.0.0',
    description: 'API para gerenciamento de conteúdo para Docentes',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://opensource.org/licenses/MIT'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};