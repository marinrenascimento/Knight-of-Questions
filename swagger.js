import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Knight of Questions API',
    description: 'API para a plataforma de estudos gamificada Knight of Questions'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger_output.json';
const routes = ['./index.js'];

swaggerAutogen()(outputFile, routes, doc);
