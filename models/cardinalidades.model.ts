import { NotaModel } from './extras/nota.model'
import { MateriaModel } from './extras/materia.model'

export const establecerCardinalidad = (): void => {
  NotaModel.belongsTo(MateriaModel, {
    foreignKey: 'idMateria',
    targetKey: 'idMateria'
  })

  MateriaModel.hasMany(NotaModel, {
    foreignKey: 'idMateria',
    sourceKey: 'idMateria'
  })
}
