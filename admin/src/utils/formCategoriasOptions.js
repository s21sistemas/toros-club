export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Selecciona la temporada correspondiente *',
      name: 'temporadaId'
    },
    {
      required: true,
      type: 'text',
      label: 'Nombre completo de la categoría *',
      name: 'nombre_categoria'
    },
    {
      required: true,
      type: 'date',
      label: 'Fecha de nacimiento mínima *',
      name: 'fecha_inicio'
    },
    {
      required: true,
      type: 'date',
      label: 'Fecha de nacimiento máxima *',
      name: 'fecha_fin'
    },
    {
      required: true,
      type: 'select',
      label: 'Sexo *',
      name: 'sexo',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'hombre', label: 'Hombre' },
        { value: 'mujer', label: 'Mujer' }
      ]
    }
  ]
}
