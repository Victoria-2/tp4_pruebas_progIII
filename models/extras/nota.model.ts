// import fs from 'fs/promises' // sequelize se encarga
// import path from 'path' // no necesitamos leer archivos
import { sequelize } from '../n-index.model'
import { DataTypes, Model, Optional } from 'sequelize'

import { InterfaceNota } from '../../interfaces/nota.interface'
// import { CalculosNotas } from '../../utils/generarNum' // no es necesario porque lo hace la DB

// const jsonPath = path.resolve(__dirname, '../../data/extras/sys-notas.json')
type InputNota = Omit<InterfaceNota, 'id'>
interface NotaCreationAttributes extends Optional<InterfaceNota, 'id'> {}

export class NotaModel
  extends Model<InterfaceNota, NotaCreationAttributes>
  implements InterfaceNota
{
  declare id: number
  declare legajo: number
  declare idMateria: string
  declare nota: number
  declare fecha: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async findAllNotes(): Promise<InterfaceNota[]> {
    return await NotaModel.findAll()
  }

  static async findById(id: number): Promise<NotaModel | null> {
    return await NotaModel.findByPk(id)
  }

  static async createNote(notaInput: InputNota): Promise<NotaModel> {
    return await NotaModel.create(notaInput)
  }

  static async findLastNote(): Promise<NotaModel | null> {
    return await NotaModel.findOne({
      order: [['id', 'DESC']]
    })
  }
}

// vinculamos la tabla de Neon al modelo

NotaModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    legajo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idMateria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'notas', // nombre de la tabla en ´posgres
    timestamps: true // Para que maneje automáticamente las columnas createdAt y updatedAt
  }
)
