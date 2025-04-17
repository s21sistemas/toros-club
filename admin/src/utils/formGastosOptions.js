export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Selecciona el banco',
      name: 'bancoId'
    },
    {
      required: true,
      type: 'text',
      label: 'Concepto',
      name: 'concepto'
    }
  ],
  opcSelectMetodo: [
    { value: '', label: 'Selecciona una opción' },
    { value: 'transferencia bancaria', label: 'Transferencia bancaria' },
    { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'cheques', label: ' Cheques' }
  ],
  totalConIvaFields: [
    {
      required: true,
      type: 'number',
      label: 'Subtotal',
      name: 'subtotal'
    },
    {
      required: true,
      type: 'number',
      label: 'Total (+IVA)',
      name: 'total'
    }
  ],
  totalSinIvaFields: [
    {
      required: true,
      type: 'number',
      label: 'Total sin IVA',
      name: 'total'
    }
  ]
}
