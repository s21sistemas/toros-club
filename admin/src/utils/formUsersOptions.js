export const formOptions = {
  generalFields: [
    { required: true, type: 'text', label: 'Nombre', name: 'nombre_completo' },
    { required: true, type: 'text', label: 'Celular', name: 'celular' },
    { required: true, type: 'text', label: 'Ocupación', name: 'ocupacion' },
    { required: true, type: 'email', label: 'Correo', name: 'correo' },
    { required: true, type: 'async', label: 'Rol', name: 'rol_id' }
  ]
}
