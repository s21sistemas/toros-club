export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Selecciona al usuario *',
      name: 'usuarioId'
    },
    {
      required: true,
      type: 'async',
      label: 'Selecciona al jugador o porrista *',
      name: 'jugadorId'
    },
    {
      required: true,
      type: 'select',
      label: 'Selecciona la tabla *',
      name: 'tabla',
      opcSelect: [
        { label: 'Selecciona una opción', value: '' },
        { label: 'Porrista', value: 'Porrista' },
        { label: 'Jugador', value: 'Jugador' }
      ]
    },
    {
      required: true,
      type: 'text',
      label: 'Concepto *',
      name: 'concepto'
    },
    {
      required: true,
      type: 'date',
      label: 'Fecha de pago *',
      name: 'fecha_pago'
    },
    {
      required: true,
      type: 'number',
      label: 'Total ($) *',
      name: 'total'
    }
  ]
}
