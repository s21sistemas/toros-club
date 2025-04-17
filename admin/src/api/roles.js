import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const rolesCollection = collection(db, 'roles')

// Crear un rol
export const createRole = async (data) => {
  try {
    const docRef = await addDoc(rolesCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar rol:', error)
  }
}

// Obtener registro
// 4ImLOboJDFm76mHNPdeB
export const getRoles = async (callback) => {
  return onSnapshot(rolesCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const permisos = doc.data()

      return {
        id: doc.id,
        nombre: permisos.nombre,
        accesos: permisos.accesos,
        permisos: permisos.permisos,
        accesos_view:
          permisos.accesos?.map((item) => item.value).join('\n') || 'N/A',
        permisos_view:
          permisos.permisos?.map((item) => item.value).join('\n') || 'N/A'
      }
    })
    callback(data)
  })
}

// Actualizar un rol
export const updateRole = async (id, data) => {
  try {
    const dataRef = doc(db, 'roles', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar rol:', error)
  }
}

// Eliminar un rol
export const removeRole = async (id) => {
  try {
    const dataRef = doc(db, 'roles', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar rol:', error)
  }
}
