const { Router } = require('express')
const {
  getAlumnoAll,
  getAlumnoById
} = require('../controllers/alumno.controller')

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoByLegajo)
rutas.post('/', postAlumno)
rutas.put('/:legajo', putAlumnoByLegajo)
rutas.put('/:legajo', deleteAlumnoByLegajo)

module.exports = rutas
