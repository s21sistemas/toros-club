export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'text',
      label: 'Nombre de temporada *',
      name: 'temporada'
    },
    {
      required: true,
      type: 'select',
      label: 'Estado de la temporada *',
      name: 'estado_temporada',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'Activa', label: 'Activa' },
        { value: 'Finalizada', label: 'Finalizada' }
      ]
    },
    {
      required: true,
      type: 'date',
      label: 'Fecha de inicio *',
      name: 'fecha_inicio'
    },
    {
      required: true,
      type: 'date',
      label: 'Fecha de fin *',
      name: 'fecha_fin'
    }
  ]
}
