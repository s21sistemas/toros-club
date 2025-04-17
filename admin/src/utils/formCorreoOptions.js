export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Correo electrónico',
      name: 'correoId'
    },
    {
      required: true,
      type: 'text',
      label: 'Asunto',
      name: 'asunto'
    },
    {
      required: true,
      type: 'textarea',
      label: 'Mensaje',
      name: 'mensaje'
    }
  ]
}
