const fs = require('fs').promises
const path = require('path')
const { AlumnoModel } = require('../models/alumno.model')

const getAlumnoAll = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    return res.status(200).json(alumnos)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'No se puedieron obtener los datos de los alumnos' })
  }
}

const getAlumnoByLegajo = async (req, res) => {
  try {
    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const { legajo } = req.params

    const legajoId = alumnos.find(
      (a) => a.legajo /* .toString() */ === Number(legajo)
    )

    if (!legajoId) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    return res.status(200).json(legajoId)
  } catch (error) {
    console.log(error)
    return res.status(500).JSON({
      error: 'No se pudo obtener el datalle del alumno con legajo n° {legajo}'
    })
  }
}

// const postAlumno = async (req, res) => {}

// const putAlumnoByLegajo = async (req, res) => {}

// const deleteAlumnoByLegajo = async (req, res) => {}

// ◆ POST /alumnos (Crear Alumno)
const postAlumno = async (req, res) => {
  try {
    const { legajo, nombre, apellido, email } = req.body

    // 1. Validar campos obligatorios (HTTP 400)
    if (!legajo || !nombre || !apellido || !email) {
      return res
        .status(400)
        .json({
          error:
            'Todos los campos (legajo, nombre, apellido, email) son obligatorios.'
        })
    }

    const data = await fs.readFile(jsonPath, 'utf8')
    const alumnos = JSON.parse(data)

    // 2. Validar duplicados (HTTP 409)
    const existe = alumnos.some((a) => a.legajo === Number(legajo))
    if (existe) {
      return res
        .status(409)
        .json({ error: `El legajo n° ${legajo} ya se encuentra registrado.` })
    }

    // 3. Crear instancias usando el modelo e inicializar fechas
    const fechaActual = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const nuevoAlumnoInstancia = new AlumnoModel(
      nombre,
      apellido,
      email,
      Number(legajo),
      fechaActual,
      fechaActual,
      true // isActive por defecto
    )

    // 4. Extraer objeto plano e insertar en el array
    const nuevoAlumnoPlano = nuevoAlumnoInstancia.getAllAttributes()
    alumnos.push(nuevoAlumnoPlano)

    // 5. Guardar los cambios en el archivo
    await fs.writeFile(jsonPath, JSON.stringify(alumnos, null, 2), 'utf8')

    return res
      .status(201)
      .json({ msg: 'Alumno registrado con éxito', data: nuevoAlumnoPlano })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'Error interno al registrar el alumno' })
  }
}

// ◆ PUT /alumnos/:legajo (Modificar Alumno)
const putAlumnoByLegajo = async (req, res) => {
  try {
    const { legajo } = req.params
    const { nombre, apellido, email, isActive } = req.body

    const data = await fs.readFile(jsonPath, 'utf8')
    const alumnos = JSON.parse(data)

    // 1. Buscar el índice del alumno (HTTP 404)
    const index = alumnos.findIndex((a) => a.legajo === Number(legajo))
    if (index === -1) {
      return res
        .status(404)
        .json({
          error: `No se puede modificar: no existe el alumno con legajo ${legajo}`
        })
    }

    // 2. Mantener datos viejos si no se envían nuevos en el body
    const alumnoActual = alumnos[index]
    const nombreModificado = nombre || alumnoActual.nombre
    const apellidoModificado = apellido || alumnoActual.apellido
    const emailModificado = email || alumnoActual.email
    const statusModificado =
      isActive !== undefined ? isActive : alumnoActual.isActive

    const fechaModificacion = new Date().toISOString().split('T')[0]

    // 3. Re-instanciar el modelo para pasar las validaciones del negocio
    const alumnoModificadoInstancia = new AlumnoModel(
      nombreModificado,
      apellidoModificado,
      emailModificado,
      alumnoActual.legajo, // El legajo no se puede cambiar
      alumnoActual.fechaAlta, // Mantiene la fecha original
      fechaModificacion,
      statusModificado
    )

    // 4. Actualizar el array de datos con el objeto literal plano
    alumnos[index] = alumnoModificadoInstancia.getAllAttributes()

    // 5. Persistir en el JSON
    await fs.writeFile(jsonPath, JSON.stringify(alumnos, null, 2), 'utf8')

    return res
      .status(200)
      .json({ msg: 'Alumno actualizado con éxito', data: alumnos[index] })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'Error interno al modificar el alumno' })
  }
}

// ◆ DELETE /alumnos/:legajo (Eliminar Alumno)
const deleteAlumnoByLegajo = async (req, res) => {
  try {
    const { legajo } = req.params

    const data = await fs.readFile(jsonPath, 'utf8')
    const alumnos = JSON.parse(data)

    // 1. Verificar existencia antes de filtrar (HTTP 404)
    const existe = alumnos.some((a) => a.legajo === Number(legajo))
    if (!existe) {
      return res
        .status(404)
        .json({
          error: `No se puede eliminar: el alumno con legajo ${legajo} no existe.`
        })
    }

    // 2. Filtrar para remover el registro (Eliminación física)
    const listaFiltrada = alumnos.filter((a) => a.legajo !== Number(legajo))

    // 3. Escribir los cambios en el archivo
    await fs.writeFile(jsonPath, JSON.stringify(listaFiltrada, null, 2), 'utf8')

    return res
      .status(200)
      .json({
        msg: `El alumno con legajo ${legajo} fue eliminado correctamente del sistema.`
      })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ error: 'Error interno al eliminar el alumno' })
  }
}

module.exports = {
  getAlumnoAll,
  getAlumnoBylegajo,
  postAlumno,
  putAlumnoByLegajo,
  deleteAlumnoByLegajo
}
