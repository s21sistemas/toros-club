import { z } from 'zod'

export const jugadorPorristaSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, 'El nombre solo puede contener letras'),
  apellido_p: z
    .string({ required_error: 'El apellido paterno es requerido' })
    .min(1, 'El apellido paterno es requerido')
    .regex(
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/,
      'El apellido solo puede contener letras'
    ),
  apellido_m: z
    .string({ required_error: 'El apellido materno es requerido' })
    .min(1, 'El apellido materno es requerido')
    .regex(
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/,
      'El apellido solo puede contener letras'
    ),
  direccion: z
    .string({ required_error: 'La dirección es requerida' })
    .min(1, 'La dirección es requerida'),
  telefono: z
    .string({ required_error: 'El teléfono es requerido' })
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(15, 'El teléfono debe tener máximo 15 dígitos'),
  curp: z
    .string({ required_error: 'La CURP es requerida' })
    .length(18, 'La CURP debe tener 18 caracteres'),
  peso: z
    .string({ required_error: 'El peso es requerido' })
    .min(1, 'El peso es requerido'),
  numero_mfl: z
    .string()
    .min(6, 'El número de MFL debe de tener un mínimo de 6 caracteres')
    .max(8, 'El número de MFL debe de tener un máximo de 8 caracteres')
    .optional()
})

export const proveedorSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido'),
  limite_credito: z.string({ required_error: 'El límite es requerido' }).min(1),

  datos_contacto: z.object({
    nombre_contacto: z
      .string({ required_error: 'El nombre de contacto es requerido' })
      .min(1, 'El nombre de contacto es requerido')
      .regex(
        /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/,
        'El nombre de contacto solo puede contener letras'
      ),
    telefono: z
      .string({ required_error: 'El teléfono es requerido' })
      .min(10, 'El teléfono debe tener al menos 10 dígitos')
      .max(15, 'El teléfono debe tener máximo 15 dígitos'),
    celular: z
      .string({ required_error: 'El celular es requerido' })
      .min(10, 'El celular debe tener al menos 10 dígitos')
      .max(15, 'El celular debe tener máximo 15 dígitos'),
    cp: z
      .string({ required_error: 'El código postal es requerido' })
      .regex(/^\d{5}$/, 'El código postal debe tener exactamente 5 dígitos')
  }),

  datos_fiscales: z.object({
    rfc: z
      .string({ required_error: 'El RFC es requerida' })
      .min(12, 'El RFC debe tener mínimo 12 caracteres')
      .max(13, 'El RFC debe tener máximo 13 caracteres'),
    cp: z
      .string({ required_error: 'El código postal es requerido' })
      .regex(/^\d{5}$/, 'El código postal debe tener exactamente 5 dígitos')
  })
})

export const almacenSchema = z.object({
  stock: z.string({ required_error: 'El stock es requerido' }).min(1)
})

export const articulosSchema = z.object({
  precio_compra: z
    .string({ required_error: 'El precio de compra es requerido' })
    .min(1),
  precio_venta: z
    .string({ required_error: 'El precio de venta es requerido' })
    .min(1),
  precio_reposicion: z
    .string({ required_error: 'El precio de reposición es requerido' })
    .min(1)
})

export const gastosSchema = z.object({
  total: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'El total debe ser un número' })
      .min(1, 'El total debe ser mayor a cero')
  ),
  subtotal: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'El subtotal debe ser un número' })
      .min(1, 'El subtotal debe ser mayor a cero')
      .optional()
  )
})

export const comprasSchema = z.object({
  cantidad_articulos: z
    .string({ required_error: 'La cantidad de articulos es requerido' })
    .min(1),
  total: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'El total debe ser un número' })
      .min(1, 'El total debe ser mayor a cero')
  ),
  subtotal: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'El subtotal debe ser un número' })
      .min(1, 'El subtotal debe ser mayor a cero')
      .optional()
  )
})

export const ordenesSchema = z.object({
  cantidad_articulos: z
    .string({ required_error: 'La cantidad de articulos es requerido' })
    .min(1),
  total: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'El total debe ser un número' })
      .min(1, 'El total debe ser mayor a cero')
  ),
  subtotal: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: 'El subtotal debe ser un número' })
      .min(1, 'El subtotal debe ser mayor a cero')
      .optional()
  )
})

export const usuarioSchema = z.object({
  nombre_completo: z
    .string({ required_error: 'El nombre es requerido' })
    .min(1, 'El nombre es requerido')
    .regex(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, 'El nombre solo puede contener letras'),
  celular: z
    .string({ required_error: 'El celular es requerido' })
    .min(10, 'El celular debe tener al menos 10 dígitos')
    .max(15, 'El celular debe tener máximo 15 dígitos'),
  correo: z
    .string({ required_error: 'El correo es requerido' })
    .email('El correo no es válido')
})
