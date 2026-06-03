const { Router } = require('express')
const rutas = Router()
const { getAllNotas } = require('../../controllers/extras/notas.controller')

rutas.get('/', getAllNotas)

module.exports = rutas
