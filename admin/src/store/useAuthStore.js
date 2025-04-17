import { create } from 'zustand'
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../api/db/firebaseConfig'
import { getProfile } from '../api/checkAuth'
import { toast } from 'sonner'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: null,

  setUser: async (user) => {
    const userAuth = await getProfile(user?.uid)
    set({ user: userAuth, isAuthenticated: !!userAuth })
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      console.log(userCredential)

      const user = userCredential.user
      await useAuthStore.getState().setUser(user)
      window.location.href = '/'
    } catch (error) {
      console.log('Error al iniciar sesión:', error.code)
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          toast.error('Correo o contraseña incorrectos.')
          break
        case 'auth/invalid-email':
          toast.error('El correo no es válido.')
          break
        case 'auth/too-many-requests':
          toast.error('Demasiados intentos fallidos. Intenta más tarde.')
          break
        default:
          toast.error('Error al iniciar sesión. Intenta nuevamente.')
          break
      }
    }
  },

  logout: async () => {
    try {
      await signOut(auth)
      set({ user: null, isAuthenticated: false })
      window.location.href = '/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
}))

onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user)
})
