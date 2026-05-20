const fs = require('fs').promises
const path = require('path')
const { AlumnoModel } = require('../models/alumno.model.ts')

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

    const alumnoEncontrado = alumnos.find(
      (a) => a.legajo /* .toString() */ === Number(legajo)
    )

    if (!alumnoEncontrado) {
      return res
        .status(404)
        .json({ msg: `No existe el alumno con el legajo ${legajo}` })
    }

    return res.status(200).json(legajoId)
  } catch (error) {
    console.log(error)
    return res.status(500).JSON({
      error: `No se pudo obtener el datalle del alumno con legajo n° {legajo}`
    })
  }
}

const postAlumno = async (req, res) => {}

const putAlumnoByLegajo = async (req, res) => {
  try {
    const { legajo } = req.params
    const { nombreB, apellidoB, emailB, isActiveB } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const index = alumnos.findIndex((alumnoI) => {
      alumnoI.legajo === Number(legajo)
    })

    console.log(`El index del alumno encontrado fue el siguiente: ${index}`)

    if (index === -1) {
      console.log(
        `No se encontró en la datebase el alumno con legajo n° ${legajo}`
      )
      return res.status(404).JSON({
        msg: `No se encontró en la datebase el alumno con legajo n° ${legajo}`
      })
    }

    const alumnoEncontrado = alumnos[index]

    const alumnoModificacion = new AlumnoModel(
      nombre || alumnoActual.nombre, // Usa el nuevo o el que ya estaba
      apellido || alumnoActual.apellido, // Usa el nuevo o el que ya estaba
      email || alumnoActual.email, // Usa el nuevo o el que ya estaba
      alumnoActual.legajo, // Mantiene el legajo intacto (no se modifica)
      alumnoActual.fechaAlta, // Mantiene la fecha de alta original
      new Date().toISOString().split('T')[0], // Nueva fecha de modificación de hoy
      isActive !== undefined ? isActive : alumnoActual.isActive
    )

    alumnos[index] = alumnoModificacion.getAllAttributes()
    await fs.writeFile(
      './data/alumnos.json',
      JSON.stringify(alumnos, null, 2),
      'utf8'
    )

    /* a */
  } catch (error) {
    console.log(error)
    return res.status(500).JSON({
      error: 'No se pudo modificar el alumno con legajo n° {legajo}'
    })
  }
}

// const deleteAlumnoByLegajo = async (req, res) => {}

module.exports = {
  getAlumnoAll,
  getAlumnoBylegajo,
  // postAlumno,
  putAlumnoByLegajo /*,
  deleteAlumnoByLegajo*/
}
