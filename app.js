require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'https://gesnutri-bba2e.web.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'GestNutri API rodando!' });
});

module.exports = app;