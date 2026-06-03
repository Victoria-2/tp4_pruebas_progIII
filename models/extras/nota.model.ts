import fs from 'fs/promises'
import path from 'path'
import { InterfaceNota } from '../../interfaces/nota.interface'

const jsonPath = path.resolve(__dirname, '../../data/extras/sys-notas.json')

export class NotaModel {
  static async findAll(): Promise<InterfaceNota[]> {
    const data = await fs.readFile(jsonPath, 'utf8')
    const notas: InterfaceNota[] = JSON.parse(data)
    return notas
  }
}
