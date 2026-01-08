// backend/scripts/init-db.js
const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');
const Address = require('../src/models/Address');

const initDatabase = async () => {
  try {
    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos sincronizada');
    
    // Aquí podrías agregar datos iniciales si quieres
    console.log('📊 Base de datos lista para usar');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
};

initDatabase();