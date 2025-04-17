export const determineCategory = (sexo, fechaNacimiento) => {
  const fechaNac = new Date(fechaNacimiento)
  const ahora = new Date()
  const añoActual = ahora.getFullYear()
  const edad = añoActual - fechaNac.getFullYear()
  const mesNacimiento = fechaNac.getMonth() + 1
  const añoNacimiento = fechaNac.getFullYear()

  if (sexo === 'hombre') {
    if (
      añoNacimiento === añoActual - 17 ||
      (añoNacimiento === añoActual - 16 && mesNacimiento <= 6)
    ) {
      return 'BT - juvenil'
    } else if (
      (añoNacimiento === añoActual - 16 && mesNacimiento >= 7) ||
      (añoNacimiento === añoActual - 15 && mesNacimiento <= 12)
    ) {
      return 'JR - juvenil'
    } else if (
      (añoNacimiento === añoActual - 14 && mesNacimiento >= 1) ||
      (añoNacimiento === añoActual - 13 && mesNacimiento <= 6)
    ) {
      return 'MG - juvenil'
    } else if (
      (añoNacimiento === añoActual - 13 && mesNacimiento >= 7) ||
      (añoNacimiento === añoActual - 12 && mesNacimiento <= 12)
    ) {
      return 'PW - juvenil'
    }

    if (
      añoNacimiento === añoActual - 11 ||
      (añoNacimiento === añoActual - 10 && mesNacimiento <= 6)
    ) {
      return 'As - flag_infantil_varonil'
    } else if (
      (añoNacimiento === añoActual - 10 && mesNacimiento >= 7) ||
      (añoNacimiento === añoActual - 9 && mesNacimiento <= 12)
    ) {
      return 'Hs - flag_infantil_varonil'
    } else if (
      (añoNacimiento === añoActual - 8 && mesNacimiento >= 1) ||
      (añoNacimiento === añoActual - 7 && mesNacimiento <= 6)
    ) {
      return 'js - flag_infantil_varonil'
    } else if (
      (añoNacimiento === añoActual - 7 && mesNacimiento >= 7) ||
      (añoNacimiento === añoActual - 6 && mesNacimiento <= 12)
    ) {
      return 'Ms (NC) - flag_infantil_varonil'
    } else {
      return 'Sin categoría asignada'
    }
  } else if (sexo === 'mujer') {
    if (edad === 17 || edad === 16) {
      return 'Master Flag - flag_femenil'
    } else if (edad === 15 || edad === 14) {
      return 'Flag Junior - flag_femenil'
    } else if (edad === 13 || edad === 12) {
      return 'Flag Juvenil - flag_femenil'
    } else if (edad === 11 || edad === 10) {
      return 'Flag Infantil - flag_femenil'
    } else if (edad === 9 || edad === 8) {
      return 'Baby Flag - flag_femenil'
    } else if (edad === 7 || edad === 6) {
      return 'Mini Flag (N/C) - flag_femenil'
    } else {
      return 'Sin categoría asignada'
    }
  }

  return null
}
