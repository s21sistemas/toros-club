import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db } from './db/firebaseConfig'

const usuariosCollection = collection(db, 'usuarios')
const rolesCollection = collection(db, 'roles')

export const getProfile = async (uid) => {
  try {
    // Filtrar el usuario por su UID
    const userQuery = query(usuariosCollection, where('uid', '==', uid))
    const userSnapshot = await getDocs(userQuery)

    if (userSnapshot.empty) {
      console.log('No se encontró el usuario con UID:', uid)
      return null
    }

    // Extraer los datos del usuario (asumimos que solo hay un resultado)
    const userDoc = userSnapshot.docs[0]
    const userData = { id: userDoc.id, ...userDoc.data() }

    // Obtener roles
    const roleSnapshot = await getDocs(rolesCollection)
    const roles = roleSnapshot.docs.reduce((acc, doc) => {
      const { nombre, accesos, permisos } = doc.data()

      acc[doc.id] = {
        nombre,
        accesos: accesos?.map((a) => a.value) || [],
        permisos: permisos?.map((p) => p.value) || []
      }

      return acc
    }, {})

    const rolData = roles[userData.rol_id]

    return {
      ...userData,
      rol: rolData?.nombre || 'Sin rol',
      accesos: rolData?.accesos || [],
      permisos: rolData?.permisos || []
    }
  } catch {
    return null
  }
}

export const updateProfile = async (id, data) => {
  try {
    const dataRef = doc(db, 'usuarios', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
  }
}

// Función para subir una imagen
export const uploadUserPhoto = async (file, userId) => {
  try {
    if (!file) throw new Error('No se seleccionó ninguna imagen.')

    const storage = getStorage()
    const fileName = `${Date.now()}-${file.name}`
    const storagePath = `usuarios/${userId}/${fileName}`
    const storageRef = ref(storage, storagePath)

    await uploadBytes(storageRef, file)

    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
  } catch (error) {
    console.error('Error al subir la imagen:', error)
    return null
  }
}

// Función para guardar la imagen en la bd
export const updateUserPhoto = async (userId, photoURL) => {
  try {
    const userRef = doc(db, 'usuarios', userId)
    await updateDoc(userRef, { photoURL })
    console.log('Foto actualizada correctamente en Firestore')
  } catch (error) {
    console.error('Error al actualizar la foto en Firestore:', error)
  }
}
