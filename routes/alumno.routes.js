const { Router } = require('express')
const {
  validateInputAlumno
} = require('../middleware/alumno-validator.middleware')
const {
  getAlumnoAll,
  getAlumnoById,
  postNewAlumno,
  putAlumnoBylegajo,
  deleteAlumnoByLegajo
} = require('../controllers/alumno.controller')

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoById)
rutas.post('/', validateInputAlumno, postNewAlumno)
rutas.put('/:legajo', validateInputAlumno, putAlumnoBylegajo)
rutas.delete('/:legajo', deleteAlumnoByLegajo)

module.exports = rutas
