export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'text',
      label: 'Nombre de artículo',
      name: 'nombre'
    },
    {
      required: true,
      type: 'number',
      label: 'Precio de compra',
      name: 'precio_compra'
    },
    {
      required: true,
      type: 'number',
      label: 'Precio de venta',
      name: 'precio_venta'
    },
    {
      required: true,
      type: 'number',
      label: 'Precio de reposición',
      name: 'precio_reposicion'
    },
    {
      required: true,
      type: 'select',
      label: '¿El artículo es para equipar?',
      name: 'articulo_equipar',
      opcSelect: [
        { label: 'Selecciona una opción', value: '' },
        { label: 'SI', value: 'SI' },
        { label: 'NO', value: 'NO' }
      ]
    }
  ]
}
