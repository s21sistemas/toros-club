export const mergeMeses = (original, nuevo) => {
  const meses = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ]

  // Convertir original a objeto para fácil acceso por mes
  const mapaOriginal = original.reduce((acc, item) => {
    acc[item.month] = item
    return acc
  }, {})

  // Crear nuevo objeto combinado
  const combinado = {}

  meses.forEach((mes) => {
    const originalMes = mapaOriginal[mes] || {
      month: mes,
      jugadores: 0,
      porristas: 0
    }
    const nuevoMes = nuevo[mes] || {}

    combinado[mes] = {
      month: mes,
      jugadores: originalMes.jugadores + (nuevoMes.jugadores || 0),
      porristas: originalMes.porristas + (nuevoMes.porristas || 0)
    }
  })

  // Devolver como array ordenado por los meses
  return meses.map((mes) => combinado[mes])
}
