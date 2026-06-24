const express = require('express')
const router = express.Router()
const {
  postRegister,
  postLogin,
  getPerfil,
  getAllUsers
} = require('../controllers/JWT-auth.controller')
const { verificarToken } = require('../middleware/JWT-auth.middleware')

// POST /api/auth/register - Registro de usuario (pública)
router.post('/register', postRegister)

// POST /api/auth/login - Inicio de sesión (pública)
router.post('/login', postLogin)

// GET /api/auth/perfil - Obtener perfil (protegida)
router.get('/perfil', verificarToken, getPerfil)

router.get('/users', getAllUsers)

module.exports = router
