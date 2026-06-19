import { sequelize } from './n-index.model'
import { DataTypes, Model, Optional } from 'sequelize'
import { InterfaceUser } from '../interfaces/JWT-user.interface'
// JWT
import bcrypt from 'bcryptjs'

type UserInput = Omit<InterfaceUser, 'id'>
interface UserCreationAtributes extends Optional<InterfaceUser, 'id'> {}

export class UserModel
  extends Model<InterfaceUser, UserCreationAtributes>
  implements InterfaceUser
{
  declare id: number
  declare nombre: string
  declare email: string
  declare password: string
  declare readonly createdAt: Date
  declare readonly updatedAt: Date

  static async createUser(userInput: UserInput): Promise<UserModel> {
    return await UserModel.create(userInput)
  }

  static async findById(id: string): Promise<UserModel | null> {
    return await UserModel.findByPk(id)
  }

  static async findByEmail(email: string): Promise<UserModel | null> {
    return await UserModel.findOne({
      where: { email }
    })
  }

  // JWT
  async validatePassword(passwordInput: string): Promise<boolean> {
    return await bcrypt.compare(passwordInput, this.password)
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        // TODO: Hashear la contraseña antes de guardar el usuario.
        // Pista: usar bcrypt.hash() con 10 rondas de salt.
      }
    }
  }
)

/* 

hooks: {
      // 3. TODO resuelto: Hashear antes de guardar en la base de datos
      beforeCreate: async (user: UserModel) => {
        if (user.password) {
          // Generamos el "salt" (bloque de seguridad aleatorio) con 10 rondas
          const salt = await bcrypt.genSalt(10)
          // Reemplazamos la contraseña en texto plano por su versión encriptada (el hash)
          user.password = await bcrypt.hash(user.password, salt)
        }
      }
    }
*/
