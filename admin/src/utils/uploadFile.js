import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../api/db/firebaseConfig'

export const uploadFileToFirebase = async (file, path) => {
  if (!file) return null

  try {
    const fileName = `${path}/${crypto.randomUUID()}_${file.name}`
    // No es necesario convertir a Blob en la Web, el archivo ya es un Blob/File
    const storageRef = ref(storage, fileName)

    // Subir el archivo directamente
    await uploadBytes(storageRef, file)

    // Obtener y retornar la URL de descarga
    return await getDownloadURL(storageRef)
  } catch (error) {
    console.error('Error al subir imagen:', error)
    throw error
  }
}
