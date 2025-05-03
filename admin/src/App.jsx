import { Toaster } from 'sonner'
import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Sidebar } from './components/Sidebar'
import { Navbar } from './components/Navbar'
import Loading from './components/Loading'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'

const UsersPage = lazy(() => import('./pages/UsersPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const JugadoresPage = lazy(() => import('./pages/JugadoresPage'))
const TemporadasPage = lazy(() => import('./pages/TemporadasPage'))
const CostosJugadorPage = lazy(() => import('./pages/CostosJugadorPage'))
const CostosPorristaPage = lazy(() => import('./pages/CostosPorristaPage'))
const CategoriasPage = lazy(() => import('./pages/CategoriasPage'))
const PorristasPage = lazy(() => import('./pages/PorristasPage'))
const PagosJugadoresPage = lazy(() => import('./pages/PagosJugadoresPage'))
const PagosPorristasPage = lazy(() => import('./pages/PagosPorristasPage'))
const RolesPage = lazy(() => import('./pages/RolesPage'))
const ModulosPage = lazy(() => import('./pages/ModulosPage'))
const ProveedoresPage = lazy(() => import('./pages/ProveedoresPage'))
const CalendarioPagosPage = lazy(() => import('./pages/CalendarioPagosPage'))
const EquipamientoPage = lazy(() => import('./pages/EquipamientoPage'))
const ArticulosPage = lazy(() => import('./pages/ArticulosPage'))
const OrdenCompraPage = lazy(() => import('./pages/OrdenCompraPage'))
const AlmacenPage = lazy(() => import('./pages/AlmacenPage'))
const CuentasPagarPage = lazy(() => import('./pages/CuentasPagarPage'))
const ReportesPage = lazy(() => import('./pages/ReportesPage'))
const GastosPage = lazy(() => import('./pages/GastosPage'))
const ComprasPage = lazy(() => import('./pages/ComprasPage'))
const PerfilPage = lazy(() => import('./pages/PerfilPage'))
const BancosPage = lazy(() => import('./pages/BancosPage'))
const CajaPage = lazy(() => import('./pages/CajaPage'))
const HistorialPage = lazy(() => import('./pages/HistorialPage'))
const AlertaPage = lazy(() => import('./pages/AlertaPage'))
const EnviarCorreoPage = lazy(() => import('./pages/EnviarCorreoPage'))
const SubirDocumentosPage = lazy(() => import('./pages/SubirDocumentosPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

export default function App() {
  const { isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (isAuthenticated === null) {
    return <Loading />
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Toaster richColors position='bottom-right' />

        <Routes>
          <Route path='/subir-documentos' element={<SubirDocumentosPage />} />

          <Route
            path='*'
            element={
              isAuthenticated ? (
                <div className='flex h-screen bg-gray-100'>
                  <Sidebar
                    sidebarOpen={sidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                  <div className='flex-1 flex flex-col overflow-hidden'>
                    <Navbar toggleSidebar={toggleSidebar} />
                    <main className='flex-1 overflow-auto p-4'>
                      <Routes>
                        <Route index path='/' element={<AdminPage />} />

                        <Route
                          path='/jugadores'
                          element={
                            <ProtectedRoute permiso='jugadores'>
                              <JugadoresPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/porristas'
                          element={
                            <ProtectedRoute permiso='porristas'>
                              <PorristasPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/proveedores'
                          element={
                            <ProtectedRoute permiso='proveedores'>
                              <ProveedoresPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/bancos'
                          element={
                            <ProtectedRoute permiso='bancos'>
                              <BancosPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/utileria'
                          element={
                            <ProtectedRoute permiso='utileria'>
                              <EquipamientoPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/temporadas'
                          element={
                            <ProtectedRoute permiso='temporadas'>
                              <TemporadasPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/categorias'
                          element={
                            <ProtectedRoute permiso='categorias'>
                              <CategoriasPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/costos-jugador'
                          element={
                            <ProtectedRoute permiso='costos-jugador'>
                              <CostosJugadorPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/costos-porrista'
                          element={
                            <ProtectedRoute permiso='costos-porrista'>
                              <CostosPorristaPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/pagos-jugadores'
                          element={
                            <ProtectedRoute permiso='pagos-jugadores'>
                              <PagosJugadoresPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/pagos-porristas'
                          element={
                            <ProtectedRoute permiso='pagos-porristas'>
                              <PagosPorristasPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/calendario-pagos'
                          element={
                            <ProtectedRoute permiso='calendario-pagos'>
                              <CalendarioPagosPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/caja'
                          element={
                            <ProtectedRoute permiso='caja'>
                              <CajaPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/historial'
                          element={
                            <ProtectedRoute permiso='historial'>
                              <HistorialPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/almacen'
                          element={
                            <ProtectedRoute permiso='almacen'>
                              <AlmacenPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/articulos'
                          element={
                            <ProtectedRoute permiso='articulos'>
                              <ArticulosPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/gastos'
                          element={
                            <ProtectedRoute permiso='gastos'>
                              <GastosPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/compras'
                          element={
                            <ProtectedRoute permiso='compras'>
                              <ComprasPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/orden-compras'
                          element={
                            <ProtectedRoute permiso='orden-compras'>
                              <OrdenCompraPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/cuentas-pagar'
                          element={
                            <ProtectedRoute permiso='cuentas-pagar'>
                              <CuentasPagarPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/correos'
                          element={
                            <ProtectedRoute permiso='correos'>
                              <AlertaPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/enviar-correo'
                          element={
                            <ProtectedRoute permiso='enviar-correo'>
                              <EnviarCorreoPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/usuarios'
                          element={
                            <ProtectedRoute permiso='usuarios'>
                              <UsersPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/roles'
                          element={
                            <ProtectedRoute permiso='roles'>
                              <RolesPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path='/modulos'
                          element={
                            <ProtectedRoute permiso='modulos'>
                              <ModulosPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path='/reportes'
                          element={
                            <ProtectedRoute permiso='reportes'>
                              <ReportesPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route path='/perfil' element={<PerfilPage />} />
                        <Route path='/login' element={<Navigate to='/' />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              ) : (
                <Routes>
                  <Route path='*' element={<LoginPage />} />
                </Routes>
              )
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
