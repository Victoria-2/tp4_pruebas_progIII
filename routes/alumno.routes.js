const { Router } = require('express')
const {
  getAlumnoAll,
  getAlumnoByLegajo,
  // postAlumno,
  putAlumnoByLegajo /*,
  deleteAlumnoByLegajo */
} = require('../controllers/alumno.controller')

const rutas = Router()

rutas.get('/', getAlumnoAll)
rutas.get('/:legajo', getAlumnoByLegajo)
// rutas.post('/', postAlumno)
rutas.put('/:legajo', putAlumnoByLegajo)
// rutas.delete('/:legajo', deleteAlumnoByLegajo)

module.exports = rutas
