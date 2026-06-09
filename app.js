require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'GestNutri API rodando!' });
});

module.exports = app;