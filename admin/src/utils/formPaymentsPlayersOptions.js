export const formOptions = {
  inscriptionFields: [
    { required: true, type: 'number', label: 'Beca (%) *', name: 'beca' },
    {
      required: true,
      type: 'number',
      label: 'Descuento por equipo propio (%) *',
      name: 'descuento'
    },
    {
      required: true,
      type: 'select',
      label: 'Estatus *',
      name: 'estatus',
      opcSelect: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' }
      ]
    },
    {
      required: true,
      type: 'number',
      label: 'Submonto *',
      name: 'submonto'
    },
    {
      required: true,
      type: 'number',
      label: 'Monto final *',
      name: 'monto'
    },
    {
      required: false,
      type: 'select',
      label: 'Método de pago (si no se ha pagado, dejar vacía)',
      name: 'metodo_pago',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'transferencia bancaria', label: 'Transferencia bancaria' },
        { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'cheques', label: ' Cheques' }
      ]
    },
    {
      required: true,
      type: 'select',
      label: 'Prorroga *',
      name: 'prorroga',
      opcSelect: [
        { value: 'false', label: 'No' },
        { value: 'true', label: 'Sí' }
      ]
    },
    {
      required: true,
      type: 'date',
      label: 'Fecha límite de pago *',
      name: 'fecha_limite',
      condition: (formData) => formData.prorroga === 'true' // Solo se muestra si prórroga es "true"
    },
    {
      required: false,
      type: 'date',
      label: 'Fecha de pago (si no se ha pagado, dejar vacía)',
      name: 'fecha_pago'
    },
    {
      required: false,
      type: 'number',
      label: 'Total abonado',
      name: 'total_abonado'
    },
    {
      required: false,
      type: 'number',
      label: 'Total restante (monto final - total abonado)',
      name: 'total_restante'
    },
    {
      required: false,
      type: 'select',
      label: '¿Abonará? *',
      name: 'abono',
      opcSelect: [
        { value: 'NO', label: 'No' },
        { value: 'SI', label: 'Sí' }
      ]
    }
  ],
  coachingFields: [
    {
      required: false,
      type: 'date',
      label: 'Fecha inicial',
      name: 'fecha_inicial'
    },
    {
      required: false,
      type: 'date',
      label: 'Fecha final',
      name: 'fecha_final'
    },
    {
      required: true,
      type: 'select',
      label: 'Estatus *',
      name: 'estatus',
      opcSelect: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' }
      ]
    },
    {
      required: false,
      type: 'date',
      label: 'Fecha de pago',
      name: 'fecha_pago',
      condition: (formData) => formData.estatus === 'pagado'
    },
    {
      required: true,
      type: 'number',
      label: 'Descuento ($) *',
      name: 'descuento'
    },
    {
      required: true,
      type: 'number',
      label: 'Submonto *',
      name: 'submonto'
    },
    {
      required: true,
      type: 'number',
      label: 'Monto final *',
      name: 'monto'
    },
    {
      required: false,
      type: 'select',
      label: 'Método de pago (si no se ha pagado, dejar vacía)',
      name: 'metodo_pago',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'transferencia bancaria', label: 'Transferencia bancaria' },
        { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'cheques', label: ' Cheques' }
      ]
    },
    {
      required: false,
      type: 'number',
      label: 'Total abonado',
      name: 'total_abonado'
    },
    {
      required: false,
      type: 'number',
      label: 'Total restante (monto final - total abonado)',
      name: 'total_restante'
    },
    {
      required: false,
      type: 'select',
      label: '¿Abonará? *',
      name: 'abono',
      opcSelect: [
        { value: 'NO', label: 'No' },
        { value: 'SI', label: 'Sí' }
      ]
    }
  ],
  tunelFields: [
    {
      required: true,
      type: 'select',
      label: 'Estatus *',
      name: 'estatus',
      opcSelect: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' }
      ]
    },
    { required: true, type: 'number', label: 'Monto total *', name: 'monto' },
    {
      required: false,
      type: 'date',
      label: 'Fecha de pago (si no se ha pagado, dejar vacía)',
      name: 'fecha_pago'
    },
    {
      required: false,
      type: 'select',
      label: 'Método de pago (si no se ha pagado, dejar vacía)',
      name: 'metodo_pago',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'transferencia bancaria', label: 'Transferencia bancaria' },
        { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'cheques', label: ' Cheques' }
      ]
    },
    {
      required: false,
      type: 'number',
      label: 'Total abonado',
      name: 'total_abonado'
    },
    {
      required: false,
      type: 'number',
      label: 'Total restante (monto final - total abonado)',
      name: 'total_restante'
    },
    {
      required: false,
      type: 'select',
      label: '¿Abonará? *',
      name: 'abono',
      opcSelect: [
        { value: 'NO', label: 'No' },
        { value: 'SI', label: 'Sí' }
      ]
    }
  ],
  botiquinFields: [
    {
      required: true,
      type: 'select',
      label: 'Estatus *',
      name: 'estatus',
      opcSelect: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' }
      ]
    },
    { required: true, type: 'number', label: 'Monto total *', name: 'monto' },
    {
      required: false,
      type: 'date',
      label: 'Fecha de pago (si no se ha pagado, dejar vacía)',
      name: 'fecha_pago'
    },
    {
      required: false,
      type: 'select',
      label: 'Método de pago (si no se ha pagado, dejar vacía)',
      name: 'metodo_pago',
      opcSelect: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'transferencia bancaria', label: 'Transferencia bancaria' },
        { value: 'tarjeta', label: 'Tarjeta de crédito/débito' },
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'cheques', label: ' Cheques' }
      ]
    },
    {
      required: false,
      type: 'number',
      label: 'Total abonado',
      name: 'total_abonado'
    },
    {
      required: false,
      type: 'number',
      label: 'Total restante (monto final - total abonado)',
      name: 'total_restante'
    },
    {
      required: false,
      type: 'select',
      label: '¿Abonará? *',
      name: 'abono',
      opcSelect: [
        { value: 'NO', label: 'No' },
        { value: 'SI', label: 'Sí' }
      ]
    }
  ],
  paymentsFields: [
    {
      required: false,
      type: 'number',
      label: 'Monto pendiente restante *',
      name: 'pagos_total_pendiente'
    },
    {
      required: false,
      type: 'number',
      label: 'Monto pagado *',
      name: 'pagos_total_pagado'
    },
    {
      required: true,
      type: 'number',
      label: 'Monto total a pagar *',
      name: 'pagos_total'
    }
  ],
  paymentsCoachingField: [
    {
      required: true,
      type: 'number',
      label: 'Monto pendiente a pagar del coaching *',
      name: 'monto_pendiente_coach'
    },
    {
      required: true,
      type: 'number',
      label: 'Monto pagado del coaching *',
      name: 'monto_pagado_coach'
    },
    {
      required: true,
      type: 'number',
      label: 'Historial pagado del coaching *',
      name: 'historial_total_pagado'
    }
  ],
  paymentsCompletosFields: [
    {
      required: false,
      type: 'number',
      label: 'Total pendiente restante (los 4 pagos) *',
      name: 'monto_total_pendiente'
    },
    {
      required: false,
      type: 'number',
      label: 'Total pagado (los 4 pagos) *',
      name: 'monto_total_pagado'
    },
    {
      required: true,
      type: 'number',
      label: 'Total a pagar (los 4 pagos) *',
      name: 'monto_total'
    }
  ]
}
