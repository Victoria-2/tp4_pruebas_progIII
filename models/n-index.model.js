const { Sequelize } = require('sequelize')
const config = require('../n-config/n-database.config')

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

// inicializar conexión a DB con sequelize

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions
  }
)

const verificarConexion = async () => {
  try {
    await sequelize.authenticate()
    console.log(`Conectado con éxito a las tablas en: ${dbConfig.host}`)
  } catch (error) {
    console.error('Error en la base de datos: ', error.message)
  }
}

verificarConexion()

module.exports = {
  sequelize,
  Sequelize
}
