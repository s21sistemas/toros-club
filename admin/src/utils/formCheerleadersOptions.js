export const formOptions = {
  generalFields: [
    { required: true, type: 'text', label: 'Nombre *', name: 'nombre' },
    {
      required: true,
      type: 'text',
      label: 'Apellido paterno *',
      name: 'apellido_p'
    },
    {
      required: true,
      type: 'text',
      label: 'Apellido materno *',
      name: 'apellido_m'
    },
    {
      required: true,
      type: 'select',
      label: 'Sexo *',
      name: 'sexo',
      opcSelect: [{ value: 'mujer', label: 'Mujer' }]
    },
    {
      required: true,
      type: 'text',
      label: 'Dirección completa *',
      name: 'direccion'
    },
    { required: true, type: 'tel', label: 'Teléfono *', name: 'telefono' },
    {
      required: true,
      type: 'date',
      label: 'Fecha de nacimiento *',
      name: 'fecha_nacimiento'
    },
    {
      required: true,
      type: 'text',
      label: 'Lugar de nacimiento *',
      name: 'lugar_nacimiento'
    },
    { required: true, type: 'text', label: 'CURP *', name: 'curp' },
    {
      required: true,
      type: 'select',
      label: 'Grado escolar *',
      name: 'grado_escolar',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'primaria', label: 'Primaria' },
        { value: 'secundaria', label: 'Secundaria' },
        { value: 'preparatoria', label: 'Preparatoria' }
      ]
    },
    {
      required: true,
      type: 'text',
      label: 'Nombre de la escuela *',
      name: 'nombre_escuela'
    },
    { required: true, type: 'text', label: 'Alergias *', name: 'alergias' },
    {
      required: true,
      type: 'text',
      label: 'Padecimientos *',
      name: 'padecimientos'
    },
    { required: true, type: 'number', label: 'Peso (kg) *', name: 'peso' },
    { required: true, type: 'async', label: 'Tutor *', name: 'uid' },
    {
      required: true,
      type: 'file',
      label: 'Foto de la porrista *',
      name: 'foto',
      accept: 'image/*'
    }
  ],

  documentFields: [
    {
      required: true,
      type: 'file',
      label: 'CURP de la porrista (PDF) *',
      name: 'curp',
      accept: 'application/pdf'
    },
    {
      required: true,
      type: 'file',
      label: 'INE del tutor (PDF) *',
      name: 'ine_tutor',
      accept: 'application/pdf'
    },
    {
      required: true,
      type: 'file',
      label: 'Acta de nacimiento (PDF) *',
      name: 'acta_nacimiento',
      accept: 'application/pdf'
    },
    {
      required: true,
      type: 'file',
      label: 'Comprobante de domicilio (PDF) *',
      name: 'comprobante_domicilio',
      accept: 'application/pdf'
    }
  ]
}
