import fs from 'fs/promises'
import path from 'path'
import { InterfaceNota } from '../../interfaces/nota.interface'
import { CalculosNotas } from '../../utils/generarNum'

const jsonPath = path.resolve(__dirname, '../../data/extras/sys-notas.json')
type InputNota = Omit<InterfaceNota, 'id'>

export class NotaModel {
  static async findAll(): Promise<InterfaceNota[]> {
    const data = await fs.readFile(jsonPath, 'utf8')
    const notas: InterfaceNota[] = JSON.parse(data)
    return notas
  }

  static async findById(id: number): Promise<InterfaceNota | undefined> {
    const notas = await this.findAll()
    return notas.find((n) => n.id === id)
  }

  static async create(notaInput: InputNota): Promise<void> {
    const notas = await this.findAll()
    const nuevoId = CalculosNotas.newId(notas, 'id')

    const nuevaNota: InterfaceNota = {
      id: nuevoId,
      ...notaInput
    }

    notas.push(nuevaNota)
    await fs.writeFile(jsonPath, JSON.stringify(notas, null, 2), 'utf8')
  }

  static async findLastOne(): Promise<InterfaceNota | undefined> {
    const notas = await this.findAll()

    if (notas.length === 0) return undefined

    return notas[notas.length - 1]
  }
}
