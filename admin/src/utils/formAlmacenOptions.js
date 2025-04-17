export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Selecciona el articulo',
      name: 'articuloId'
    },
    {
      required: true,
      type: 'text',
      label: 'Concepto',
      name: 'concepto'
    },
    {
      required: true,
      type: 'number',
      label: 'Stock',
      name: 'stock'
    }
  ],
  opcSelect: [
    { value: '', label: 'Selecciona una opción' },
    { value: 'entrada', label: 'Entrada' },
    { value: 'salida', label: 'Salida' }
  ]
}
