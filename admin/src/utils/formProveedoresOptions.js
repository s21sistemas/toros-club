export const formOptions = {
  proveedorFields: [
    {
      required: true,
      type: 'text',
      label: 'Nombre',
      name: 'nombre'
    },
    {
      required: true,
      type: 'number',
      label: 'Límite de crédito',
      name: 'limite_credito'
    }
  ],

  contactoFields: [
    {
      required: true,
      type: 'text',
      label: 'Nombre de contacto',
      name: 'nombre_contacto'
    },
    { required: true, type: 'number', label: 'Teléfono', name: 'telefono' },
    { required: true, type: 'number', label: 'Celular', name: 'celular' },
    { required: true, type: 'text', label: 'Calle', name: 'calle' },
    { required: true, type: 'text', label: 'Número', name: 'numero' },
    { required: true, type: 'text', label: 'Colonia', name: 'colonia' },
    { required: true, type: 'number', label: 'Código postal', name: 'cp' },
    { required: true, type: 'text', label: 'Ciudad', name: 'ciudad' },
    { required: true, type: 'text', label: 'Estado', name: 'estado' }
  ],

  datosFiscalesField: [
    { required: true, type: 'text', label: 'RFC', name: 'rfc' },
    { required: true, type: 'text', label: 'Razón', name: 'razon' },
    {
      required: true,
      type: 'text',
      label: 'Nombre comercial',
      name: 'nombre_comercial'
    },
    { required: true, type: 'text', label: 'Calle', name: 'calle' },
    { required: true, type: 'text', label: 'Número', name: 'numero' },
    { required: true, type: 'text', label: 'Colonia', name: 'colonia' },
    { required: true, type: 'number', label: 'Código postal', name: 'cp' },
    { required: true, type: 'text', label: 'Ciudad', name: 'ciudad' },
    { required: true, type: 'text', label: 'Estado', name: 'estado' }
  ]
}
