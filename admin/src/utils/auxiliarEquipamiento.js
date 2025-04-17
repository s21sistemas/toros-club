export const generarEquipamientoBool = (equipoNombre) => {
  return equipoNombre.reduce(
    (acc, nombre) => {
      acc[nombre] = true
      return acc
    },
    {
      casco: false,
      hombreras: false,
      guardas: false,
      uniforme_entrenamiento: false,
      jersey: false,
      shorts: false,
      leggings: false
    }
  )
}
