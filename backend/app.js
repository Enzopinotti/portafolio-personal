const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
require('./models/associations'); // Importar las asociaciones

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/usuarios', require('./routes/usuarioRoutes'));
app.use('/proyectos', require('./routes/proyectoRoutes'));
app.use('/skills', require('./routes/skillRoutes'));
app.use('/contacto', require('./routes/mensajeContactoRoutes'));

// Sincronizar con la base de datos
sequelize.sync({ alter: true }).then(() => {
  console.log('Base de datos sincronizada');
  // Iniciar el servidor
  app.listen(3001, () => {
    console.log('Servidor iniciado en el puerto 3001');
  });
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});
