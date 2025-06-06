export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Selecciona al jugador',
      name: 'jugadorId'
    },
    {
      required: true,
      type: 'number',
      label: 'Peso (kg)',
      name: 'peso'
    },
    {
      required: true,
      type: 'select',
      label: 'Selecciona el tipo de categoría',
      name: 'tipo_categoria',
      opcSelect: [
        { label: 'Selecciona una opción', value: '' },
        { label: 'Equipado', value: 'Equipado' },
        { label: 'Flag', value: 'Flag' }
      ]
    }
  ]
}
