// server.js
const express = require('express');
const OpenAPIBBackend = require('openapi-backend').default;

const app = express();

const api = new OpenAPIBBackend({
  definition: 'openapi.yaml',
  handlers: {
    getHello: async (c, req, res) => {
      res.status(200).send('Hello, world!');
    },
    validationFail: async (c, req, res) => {
      res.status(400).json({ err: c.validation.errors });
    },
    notFound: async (c, req, res) => res.status(404).json({ err: 'not found' }),
  },
});

api.init();
app.use(express.json());
app.use((req, res, next) => {
  api.handleRequest(req, req, res).then(() => next()).catch(next);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});