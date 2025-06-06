import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'

const tallasCollection = collection(db, 'tallas')

// Registrar
export const createTalla = async (data) => {
  try {
    data.nombre = data.jugadorId.label
    const docRef = await addDoc(tallasCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al registrar:', error)
  }
}

// Obtener registro
export const getTalla = async (callback) => {
  return onSnapshot(tallasCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const tipo_categoria = doc.data().tipo_categoria
      const tallas =
        tipo_categoria === 'Equipado'
          ? `Jersey (${doc.data().talla_jersey}), Funda (${
              doc.data().talla_funda
            })`
          : `Playera/Blusa (${
              doc.data().talla_playera_blusa
            }), Short/Leggins (${doc.data().talla_short_leggins})`

      return {
        id: doc.id,
        ...doc.data(),
        tallas,
        nombre: doc.data()?.jugadorId.label,
        jugadorId: {
          label: doc.data()?.jugadorId.label,
          value: doc.data()?.jugadorId.value
        }
      }
    })
    callback(data)
  })
}

// Actualizar
export const updateTalla = async (id, data) => {
  try {
    delete data.tallas
    const dataRef = doc(db, 'tallas', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar:', error)
  }
}

// Eliminar
export const removeTalla = async (id) => {
  try {
    const dataRef = doc(db, 'tallas', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar:', error)
  }
}
