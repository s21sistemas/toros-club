export const formOptions = {
  generalFields: [
    { required: true, type: 'text', label: 'Nombre', name: 'nombre' },
    {
      required: true,
      type: 'select-normal',
      label: 'Permisos',
      name: 'permisos',
      opcSelect: [
        { label: 'Consultar', value: 'consultar' },
        { label: 'Agregar', value: 'agregar' },
        { label: 'Actualizar', value: 'actualizar' },
        { label: 'Eliminar', value: 'eliminar' },
        { label: 'Cliente', value: 'cliente' }
      ]
    },
    { required: true, type: 'async-multi', label: 'Accesos', name: 'accesos' }
  ]
}
