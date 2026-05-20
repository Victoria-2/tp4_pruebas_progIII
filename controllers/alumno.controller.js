const fs = require('fs').promises
// const { stringify } = require('querystring')
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

    return res.status(200).json(alumnoEncontrado)
  } catch (error) {
    console.log(error)
    return res.status(500).JSON({
      error: 'No se pudo obtener el datalle del alumno con legajo n° {legajo}'
    })
  }
}
const putAlumnoByLegajo = async (req, res) => {
  const { legajo } = req.params
  try {
    const { nombre, apellido, email, isActive } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const index = alumnos.findIndex(
      (alumnoI) => alumnoI.legajo === Number(legajo)
    )

    console.log(`El index del alumno encontrado fue el siguiente: ${index}`)

    if (index === -1) {
      console.log(`No existe el alumno con legajo n° ${legajo}`)
      return res.status(404).json({
        msg: `No se encontró en la datebase el alumno con legajo n° ${legajo}`
      })
    }

    const alumnoActual = alumnos[index]

    const alumnoModificacion = new AlumnoModel(
      alumnoActual.nombre,
      alumnoActual.apellido,
      alumnoActual.email,
      alumnoActual.legajo,
      alumnoActual.fechaAlta,
      alumnoActual.modificacion,
      alumnoActual.isActive
    )

    // COnfirmamos si envíaron modificaciones nuevas
    if (nombre) alumnoModificacion.setNombre(nombre)
    if (apellido) alumnoModificacion.setApellido(apellido)
    if (email) alumnoModificacion.setEmail(email)
    if (isActive !== undefined) alumnoModificacion.setIsActive(isActive)
    alumnoModificacion.setModificacion(new Date().toISOString().split('T')[0])

    alumnos[index] = alumnoModificacion.getAllAttributes()

    await fs.writeFile(
      './data/alumnos.json',
      JSON.stringify(alumnos, null, 2),
      'utf8'
    )

    return res.status(200).json({
      msg: 'Se modificaron correctamente los datos!',
      alumnoModificado: alumnos[index]
    })
    /* a */
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: `No se pudo modificar el alumno con legajo n° ${legajo}`
    })
  }
}

const postAlumno = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    let nuevoLegajo = 0

    if (alumnos) {
      const legajos = alumnos.map((alumno) => alumno.legajo)
      nuevoLegajo = Math.max(...legajos) + 1
      console.log(`Nuevo legajo creado: ${nuevoLegajo} `)
    }

    const nuevoAlumno = new AlumnoModel(nombre, apellido, email, nuevoLegajo)
    alumnos.push(nuevoAlumno.getAllAttributes())

    await fs.writeFile(
      './data/alumnos.json',
      JSON.stringify(alumnos, null, 2),
      'utf8'
    )

    return res.status(201).json({
      msg: 'Se modificaron correctamente los datos!',
      nuevoAlumno: nuevoAlumno.getAllAttributes()
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'Error en dar de alta un nuevo alumno'
    })
  }
}

const deleteAlumnoByLegajo = async (req, res) => {
  try {
    const { legajo } = req.params

    const data = await fs.readFile('./data/alumnos.json', 'utf8')
    const alumnos = JSON.parse(data)

    const index = alumnos.findIndex(
      (alumnoI) => alumnoI.legajo === Number(legajo)
    )

    if (index === -1) {
      return res.status(404).json({
        msg: 'No se encontró el alumno'
      })
    }

    const alumnoEliminado = alumnos[index]

    alumnos.splice(index, 1)

    await fs.writeFile(
      './data/alumnos.json',
      JSON.stringify(alumnos, null, 2),
      'utf8'
    )

    return res.status(200).json({
      msg: `Se eliminó correctamente el alumno con el lejajo n° ${legajo}`,
      alumnoEliminado
    })
  } catch (error) {
    console.errorg(error)
    return res.status(500).json({
      error: 'No se pudo eliminar el alumno',
      mensajeOriginalDeJavaScript: error.message,
      stackTrace: error.stack
    })
  }
}

module.exports = {
  getAlumnoAll,
  getAlumnoByLegajo,
  postAlumno,
  putAlumnoByLegajo,
  deleteAlumnoByLegajo
}
