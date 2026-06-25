const express = require('express')
const router = express.Router()
const {
  postRegister,
  postLogin,
  getPerfil
} = require('../controllers/authController')
const { verificarToken } = require('../middleware/auth')

// POST /api/auth/register - Registro de usuario (pública)
router.post('/register', postRegister)

// POST /api/auth/login - Inicio de sesión (pública)
router.post('/login', postLogin)

// GET /api/auth/perfil - Obtener perfil (protegida)
router.get('/perfil', verificarToken, getPerfil)

module.exports = router
