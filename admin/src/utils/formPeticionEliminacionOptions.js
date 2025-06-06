export const formOptions = {
  generalFields: [
    { required: true, type: 'text', label: 'Email', name: 'email' },
    { required: true, type: 'text', label: 'Razón', name: 'reason' },
    {
      required: true,
      type: 'select',
      label: 'Estatus',
      name: 'status',
      opcSelect: [
        { label: 'Selecciona una opción', value: '' },
        { label: 'Pendiente', value: 'pending' },
        { label: 'Eliminado', value: 'Eliminado' }
      ]
    }
  ]
}
