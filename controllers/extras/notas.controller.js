const fs = require('fs').promises
const { NotaModel } = require('../../models/extras/nota.model')

const getAllNotas = async (req, res, next) => {
  try {
    notas = await NotaModel.findAll()
    return res.status(200).json(notas)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

module.exports = { getAllNotas }
