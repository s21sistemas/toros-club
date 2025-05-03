import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const jugadoresCollection = collection(db, 'jugadores')
const porristasCollection = collection(db, 'porristas')

// Obtener registro
export const getPlayersByUID = async (uid) => {
  const q = query(jugadoresCollection, where('uid', '==', uid))
  const snapshot = await getDocs(q)

  const data = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const user = await getUserByUID(doc.data().uid)
      const nombre = `${doc.data().nombre} ${doc.data().apellido_p} ${
        doc.data().apellido_m
      }`

      return {
        ...doc.data(),
        id: doc.id,
        nombre_completo: nombre,
        uid: { value: doc.data().uid, label: user?.nombre_completo }
      }
    })
  )

  return data
}

const getUserByUID = async (uid) => {
  try {
    const usersRef = collection(db, 'usuarios') // Referencia a la colección "usuarios"
    const q = query(usersRef, where('uid', '==', uid)) // Filtrar por id igual a uid
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Si se encontraron documentos, devolver el primero
      return querySnapshot.docs[0].data()
    } else {
      console.log('No se encontró un usuario con ese ID.')
      return null
    }
  } catch (error) {
    console.error('Error buscando usuario:', error)
    return null
  }
}

export const getCheerleaderByUID = async (uid) => {
  const q = query(porristasCollection, where('uid', '==', uid))
  const snapshot = await getDocs(q)

  const data = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const user = await getUserByUID(doc.data().uid)
      const nombre = `${doc.data().nombre} ${doc.data().apellido_p} ${
        doc.data().apellido_m
      }`

      return {
        ...doc.data(),
        id: doc.id,
        nombre_completo: nombre,
        uid: { value: doc.data().uid, label: user?.nombre_completo }
      }
    })
  )

  return data
}
