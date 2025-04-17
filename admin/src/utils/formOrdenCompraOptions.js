export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Selecciona al proveedor',
      name: 'proveedorId'
    },
    {
      required: true,
      type: 'async',
      label: 'Selecciona el banco',
      name: 'bancoId'
    },
    {
      required: true,
      type: 'async',
      label: 'Selecciona el articulo',
      name: 'articuloId'
    },
    {
      required: true,
      type: 'number',
      label: 'Cantidad de artículos',
      name: 'cantidad_articulos'
    },
    {
      required: true,
      type: 'number',
      label: 'Precio por artículo',
      name: 'precio_articulo'
    }
  ],
  opcSelect: [
    { value: '', label: 'Selecciona una opción' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagada', label: 'Pagada' },
    { value: 'cancelada', label: 'Cancelada' }
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
