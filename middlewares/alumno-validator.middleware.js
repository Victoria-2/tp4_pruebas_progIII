const validatePutAlumno = (req, res, next) => {
  const { nombre, apellido, email, isActive } = req.body
  const errors = []

  if (
    nombre !== undefined &&
    (typeof nombre !== 'string' || !isNaN(Number(nombre)))
  ) {
    errors.push('El campo "nombre" debe ser una cadena de texto válida.')
  }

  if (
    apellido !== undefined &&
    (typeof apellido !== 'string' || !isNaN(Number(apellido)))
  ) {
    errors.push('El campo "apellido" debe ser una cadena de texto válida.')
  }
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    errors.push('El campo "isActive" debe ser estrictamente true o false.')
  }

  if (
    email !== undefined &&
    (typeof email !== 'string' || !isNaN(Number(apellido)))
  ) {
    errors.push('El campo "email" debe ser una cadena de texto válida.')
  }

  if (errors.length > 0) {
    return res.status(400).json({
      msg: 'Datos de petición inválidos',
      errors
    })
  }

  // ✅ Si todo está bien, pasamos al controlador con next()
  next()
}

module.exports = { validatePutAlumno }
