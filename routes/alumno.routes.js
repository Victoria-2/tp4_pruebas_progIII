const { Router } = require('express')
const {
  getAlumnoAll,
  getAlumnoByLegajo,
  postAlumno,
  putAlumnoByLegajo,
  deleteAlumnoByLegajo
} = require('../controllers/alumno.controller')
const {
  validatePutAlumno
} = require('../middlewares/alumno-validator.middleware')

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoByLegajo)
rutas.post('/', postAlumno)
rutas.put('/:legajo', validatePutAlumno, putAlumnoByLegajo)
rutas.delete('/:legajo', deleteAlumnoByLegajo)

module.exports = rutas
