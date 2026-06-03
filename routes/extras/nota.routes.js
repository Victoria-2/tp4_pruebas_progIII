const { Router } = require('express')
const rutas = Router()
const {
  getAllNotas,
  getNotaById,
  postNota
} = require('../../controllers/extras/notas.controller')

rutas.get('/', getAllNotas)
rutas.get('/:id', getNotaById)
rutas.post('/', postNota)

module.exports = rutas
