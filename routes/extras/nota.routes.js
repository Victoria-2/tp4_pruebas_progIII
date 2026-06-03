const { Router } = require('express')
const rutas = Router()
const {
  getAllNotas,
  getNotaById
} = require('../../controllers/extras/notas.controller')

rutas.get('/', getAllNotas)
rutas.get('/:id', getNotaById)

module.exports = rutas
