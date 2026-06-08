const fs = require('fs').promises
const { NotaModel } = require('../../models/extras/nota.model')

const getAllNotas = async (req, res, next) => {
  try {
    notas = await NotaModel.findAllNotes()
    return res.status(200).json(notas)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getNotaById = async (req, res, next) => {
  try {
    notaEncontrada = await NotaModel.findById(req.params.id)

    if (notaEncontrada === undefined) {
      return res.status(400).json({
        msg: 'No se pudo encontrar la nota con el id $(req.params.id)'
      })
    }

    return res.status(200).json(notaEncontrada)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const postNota = async (req, res, next) => {
  try {
    const { legajo, idMateria, nota, fecha } = req.body

    notaCreada = await NotaModel.createNote({
      legajo: Number(legajo),
      idMateria,
      nota: Number(nota),
      fecha
    })

    return res.status(201).json({
      msg: 'Nota guardada correctamente en el sistema',
      data: notaCreada
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getNotaMateria = async (req, res, next) => {
  try {
    const join = await NotaModel.findNoteAndMateria()
    return res.status(200).json(join)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const getTopNotes = async (req, res, next) => {
  try {
    const { idMateria } = req.params.idMateria

    if (!idMateria) {
      return res.status(400).json({
        msg: 'Falta el parámetro idMateria en la consulta (query).'
      })
    }

    const notas = await NotaModel.findTopNotes(idMateria)
    return res.status(200).json(notas)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = {
  getAllNotas,
  getNotaById,
  postNota,
  getNotaMateria,
  getTopNotes
}
