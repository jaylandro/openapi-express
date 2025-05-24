// server.js
const express = require('express');
const OpenAPIBBackend = require('openapi-backend').default;
const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const file  = fs.readFileSync('./openapi.yaml', 'utf8')
const jsonOpenAPIFile = YAML.parse(file)

const app = express();

const api = new OpenAPIBBackend({
  definition: jsonOpenAPIFile,
  handlers: {
    getHello: async (c, req, res) => {
      res.status(200).send('Hello, world!');
    },
    getGoodbye: async (c, req, res) => {
      res.status(200).send('Goodbye!');
    },
    validationFail: async (c, req, res) => {
      res.status(400).json({ err: c.validation.errors });
    },
    notFound: async (c, req, res) => res.status(404).json({ err: 'not found' }),
  },
});

api.init();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(jsonOpenAPIFile));
app.use((req, res, next) => {
  api.handleRequest(req, req, res).then(() => next()).catch(next);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});