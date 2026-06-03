export abstract class CalculosNotas {
  static newId(array: any[], aBuscar: string): number {
    if (array.length < 0) {
      return 1
    }

    const ultimoElemento = array[array.length - 1]
    const valorActual = ultimoElemento[aBuscar]
    return Number(valorActual) + 1
  }
}
