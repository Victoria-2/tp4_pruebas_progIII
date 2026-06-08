const express = require('express')
const cors = require('cors')
require('dotenv').config()
const errorHandler = require('../middleware/error-handler.middleware')
const { sequelize } = require('../models/n-index.model')
const { establecerCardinalidad } = require('../models/cardinalidades.model')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.connectToDataBase()
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
  }

  middleware() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  rutas() {
    this.app.use('/alumnos', require('../routes/alumno.routes'))
    /*
    this.app.use('/materias', require('../routes/extra/materia.routes')) */
    this.app.use('/notas', require('../routes/extras/nota.routes'))
    /* this.app.use('/profesores', require('../routes/extra/profesor.routes'))
     */
  }

  async connectToDataBase() {
    try {
      establecerCardinalidad()
      console.log(
        'Cardinalidad y relaciones entre trablas establecidas correctamente'
      )

      await sequelize.sync({ alter: false })
      console.log('Database sincronizada correctamente')
    } catch (error) {
      console.error('Error en la conexión a la DB: ', error)
    }
  }

  errorHandlerGlobal() {
    this.app.use((err, req, res, next) => {
      console.error(err.stack)
      return res.status(404).json({ msg: 'Error. Pagina no encontrada' })
    })
    this.app.use(errorHandler)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`La API esta escuchando el el puerto: ${this.port}`)
    })
  }
}

module.exports = Server
