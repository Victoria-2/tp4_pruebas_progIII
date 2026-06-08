import { sequelize } from '../n-index.model'
import { DataTypes, Model } from 'sequelize'
import { InterfaceMateria } from '../../interfaces/materia.interface'

export class MateriaModel
  extends Model<InterfaceMateria>
  implements InterfaceMateria
{
  declare idMateria: string
  declare nombre: string
  declare cuatrimestre: number
}

MateriaModel.init(
  {
    idMateria: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cuatrimestre: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'materias',
    timestamps: false
  }
)
