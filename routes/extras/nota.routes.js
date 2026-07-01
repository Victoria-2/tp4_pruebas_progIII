const { Router } = require('express')
const rutas = Router()
const {
  getAllNotas,
  getNotaById,
  postNota,
  getNotaMateria,
  getTopNotes
} = require('../../controllers/extras/notas.controller')

rutas.get('/', getAllNotas)
rutas.get('/join', getNotaMateria)
rutas.get('/top/:idMateria', getTopNotes)
rutas.get('/:id', getNotaById)
rutas.post('/', postNota)

module.exports = rutas
