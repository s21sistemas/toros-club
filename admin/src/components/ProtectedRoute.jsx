import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export const ProtectedRoute = ({ children, permiso }) => {
  const { accesos } = useAuth()

  if (!accesos?.includes(permiso)) {
    return <Navigate to='/' />
  }

  return children
}
