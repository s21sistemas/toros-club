import {
  BarChart3,
  Users,
  BoomBox,
  CircleUserRound,
  IdCard,
  Landmark,
  BaggageClaim,
  Shirt,
  Warehouse,
  ClipboardList,
  CreditCard,
  BookMarked,
  Mail,
  NotepadTextDashed
} from 'lucide-react'

export const routes = [
  { path: '/', label: 'Dashboard', Icon: BarChart3 },

  { path: '/jugadores', label: 'Jugadores', Icon: Users },
  { path: '/porristas', label: 'Porristas', Icon: BoomBox },
  { path: '/proveedores', label: 'Proveedores', Icon: BaggageClaim },
  { path: '/bancos', label: 'Bancos', Icon: Landmark },
  { path: '/utileria', label: 'Utilería', Icon: Shirt },
  {
    label: 'Gestión deportiva',
    Icon: NotepadTextDashed,
    children: [
      { path: '/temporadas', label: 'Temporadas' },
      { path: '/categorias', label: 'Categorías' }
    ]
  },
  {
    label: 'Gestión de pagos',
    Icon: CreditCard,
    children: [
      { path: '/pagos-jugadores', label: 'Jugadores' },
      { path: '/pagos-porristas', label: 'Porristas' },
      { path: '/calendario-pagos', label: 'Calendario' },
      { path: '/caja', label: 'Caja' },
      { path: '/historial', label: 'Historial' }
    ]
  },
  {
    label: 'Inventario',
    Icon: Warehouse,
    children: [
      { path: '/almacen', label: 'Almacén' },
      { path: '/articulos', label: 'Artículos' },
      { path: '/gastos', label: 'Gastos' }
    ]
  },
  {
    label: 'Compras',
    Icon: ClipboardList,
    children: [
      { path: '/compras', label: 'Compras' },
      { path: '/orden-compras', label: 'Orden de compras' },
      { path: '/cuentas-pagar', label: 'Cuentas a pagar' }
    ]
  },
  {
    label: 'Correos',
    Icon: Mail,
    children: [
      { path: '/correos', label: 'Correos enviados' },
      { path: '/enviar-correo', label: 'Enviar correo' }
    ]
  },
  {
    label: 'Configuración',
    Icon: IdCard,
    children: [
      { path: '/usuarios', label: 'Usuarios' },
      { path: '/modulos', label: 'Módulos' },
      { path: '/roles', label: 'Accesos' }
    ]
  },
  { path: '/reportes', label: 'Reportes', Icon: BookMarked }
]
