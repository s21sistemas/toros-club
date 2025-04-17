import { useAuthStore } from '../store/useAuthStore'

export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  return {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    accesos: user?.accesos,
    permisos: user?.permisos
  }
}
