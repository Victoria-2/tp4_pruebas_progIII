// import fs from 'fs/promises' // sequelize se encarga
// import path from 'path' // no necesitamos leer archivos
import { sequelize } from '../n-index.model'
import { DataTypes, Model, Optional } from 'sequelize'

import { InterfaceNota } from '../../interfaces/nota.interface'
import { MateriaModel } from './materia.model'
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

  static async findAllNotes(): Promise<NotaModel[]> {
    return await NotaModel.findAll()
  }

  static async findById(id: string): Promise<NotaModel | null> {
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

  static async findNoteAndMateria(): Promise<NotaModel[]> {
    return await NotaModel.findAll({
      include: [
        {
          model: MateriaModel
          // attributes ['nombre', 'cuatrimestre']
        }
      ]
    })
  }

  static async findTopNotes(idMateria: string): Promise<NotaModel[]> {
    return await NotaModel.findAll({
      // 1. Filtro
      where: {
        idMateria: idMateria
      },
      // 2. Solo las columnas que me importan de la nota
      attributes: ['legajo', 'nota'],
      // 3. Ordenado de mayor a menor nota
      order: [['nota', 'DESC']],
      // 4. Solo el Top 5
      limit: 5,
      // 5. Acoplamos la tabla materias (JOIN)
      include: [
        {
          model: MateriaModel,
          attributes: ['nombre'] // De la materia solo me interesa el nombre
        }
      ]
    })
  }
}

// vinculamos la tabla sql al modelo
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
    tableName: 'notas', // nombre de la tabla en postgre
    timestamps: true // Para que maneje automáticamente las columnas createdAt y updatedAt
  }
)
