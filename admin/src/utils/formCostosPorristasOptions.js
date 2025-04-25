export const formOptions = {
  generalFields: [
    {
      required: true,
      type: 'async',
      label: 'Temporada *',
      name: 'temporadaId'
    },
    {
      required: true,
      type: 'number',
      step: '0.01',
      label: 'Costo de inscripción *',
      name: 'inscripcion'
    },
    {
      required: true,
      type: 'number',
      step: '0.01',
      label: 'Costo de coaching *',
      name: 'coaching'
    }
  ]
}
