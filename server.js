const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

pool.connect()
  .then(() => {
    console.log('Banco de dados conectado com sucesso!');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar no banco de dados:', error.message);
  });