export const formOptions = {
  tipoInscripcion: [
    { value: '', label: 'Selecciona una opción' },
    { value: 'novato', label: 'Novato' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'reinscripcion', label: 'Reinscripción' }
  ],

  categoryOptions: [
    { value: '', label: 'Selecciona una opción' },
    { value: 'Sin categoría asignada', label: 'Sin categoría asignada' },
    { label: 'BT - Juvenil', value: 'BT' },
    { label: 'JR - Juvenil', value: 'JR' },
    { label: 'MG - Juvenil', value: 'MG' },
    { label: 'PW - Juvenil', value: 'PW' },
    { label: 'As - Flag Infantil Varonil', value: 'As' },
    { label: 'Hs - Flag Infantil Varonil', value: 'Hs' },
    { label: 'hs - Flag Infantil Varonil', value: 'hs' },
    { label: 'Ms (NC) - Flag Infantil Varonil', value: 'Ms (NC)' },
    { label: 'Master Flag - Flag Femenil', value: 'Master Flag' },
    { label: 'Flag Junior - Flag Femenil', value: 'Flag Junior' },
    { label: 'Flag Juvenil - Flag Femenil', value: 'Flag Juvenil' },
    { label: 'Flag Infantil - Flag Femenil', value: 'Flag Infantil' },
    { label: 'Baby Flag - Flag Femenil', value: 'Baby Flag' },
    { label: 'Mini Flag (N/C) - Flag Femenil', value: 'Mini Flag (N/C)' }
  ],

  reinscripcionOptions: [
    { value: '', label: 'Selecciona una opción' },
    { value: 'no activo', label: 'No activo actualmente' },
    { value: 'activo', label: 'Reinscrito' }
  ],

  transferenciaFields: [
    {
      required: true,
      type: 'text',
      label: 'Club anterior *',
      name: 'club_anterior'
    },
    {
      required: true,
      type: 'text',
      label: 'Temporadas jugadas *',
      name: 'temporadas_jugadas'
    },
    {
      required: true,
      type: 'select',
      label: 'Mótivo de transferencia *',
      name: 'motivo_transferencia',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'Préstamo', label: 'Préstamo' },
        { value: 'Cambio de domicilio', label: 'Cambio de domicilio' },
        { value: 'Descanso', label: 'Descanso' },
        { value: 'Transferencia definitiva', label: 'Transferencia definitiva' }
      ]
    }
  ],

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
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'hombre', label: 'Hombre' },
        { value: 'mujer', label: 'Mujer' }
      ]
    },
    {
      required: true,
      type: 'text',
      label: 'Dirección completa *',
      name: 'direccion'
    },
    { required: true, type: 'number', label: 'Teléfono *', name: 'telefono' },
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
    {
      required: false,
      type: 'number',
      label: 'No. MFL (Puede dejarlo vacío y después editarlo)',
      name: 'numero_mfl'
    },
    {
      required: true,
      type: 'select',
      label: 'Categoría *',
      name: 'categoria'
    },
    { required: true, type: 'async', label: 'Tutor *', name: 'uid' },
    {
      required: true,
      type: 'file',
      label: 'Foto del jugador *',
      name: 'foto',
      accept: 'image/*'
    }
  ],

  documentFields: [
    {
      required: false,
      type: 'file',
      label: 'CURP del jugador (PDF) *',
      name: 'curp',
      accept: 'application/pdf'
    },
    {
      required: false,
      type: 'file',
      label: 'INE del tutor (PDF) *',
      name: 'ine_tutor',
      accept: 'application/pdf'
    },
    {
      required: false,
      type: 'file',
      label: 'Acta de nacimiento (PDF) *',
      name: 'acta_nacimiento',
      accept: 'application/pdf'
    },
    {
      required: false,
      type: 'file',
      label: 'Comprobante de domicilio (PDF) *',
      name: 'comprobante_domicilio',
      accept: 'application/pdf'
    }
  ]
}
