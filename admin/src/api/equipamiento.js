import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import { restarStockAlmacen, sumarStockAlmacen } from './almacen'

const equipamientoCollection = collection(db, 'equipamiento')

// Crear un equipamiento
export const createEquipamiento = async (data) => {
  try {
    const stockRestado = await restarStockAlmacen(data.equipamiento_asignado)

    if (!stockRestado) return null

    const docRef = await addDoc(equipamientoCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar equipamiento:', error)
    throw error
  }
}

// Obtener registro
export const getEquipamiento = async (callback) => {
  return onSnapshot(equipamientoCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data()

      const jugador = docData?.jugadorId?.label || 'Sin asignar'
      const equipo_prestado = Object.entries(docData)
        .filter(([key, value]) => value === true && key !== 'devuelto')
        .map(([key]) => key.replace(/_/g, ' '))
        .join(', ')

      return {
        id: doc.id,
        ...doc.data(),
        equipo_prestado,
        jugador
      }
    })
    callback(data)
  })
}

// Actualizar un equipamiento
export const updateEquipamiento = async (id, data) => {
  try {
    // Obtener el equipamiento actual antes de actualizar
    const dataRef = doc(db, 'equipamiento', id)
    const snapshot = await getDoc(dataRef)
    const currentData = snapshot.exists() ? snapshot.data() : {}

    // Equipamiento asignado actualmente y nuevo
    const equipoActual = currentData.equipamiento_asignado || []
    const equipoNuevo = data.equipamiento_asignado || []

    // Verificar si el equipo ha sido devuelto
    const seDevuelve = data.devuelto === 'SI' && currentData.devuelto !== 'SI'

    // Restar stock solo de los nuevos elementos
    const nuevosElementos = equipoNuevo.filter(
      (item) => !equipoActual.some((prev) => prev.label === item.label)
    )

    if (nuevosElementos.length > 0) {
      const stockRestado = await restarStockAlmacen(nuevosElementos)
      if (!stockRestado) return null
    }

    if (seDevuelve) await sumarStockAlmacen(equipoActual)

    delete data.equipo_prestado
    delete data.jugador

    await updateDoc(dataRef, data)
    return true
  } catch (error) {
    console.error('Error al actualizar equipamiento:', error)
  }
}

// Eliminar un equipamiento
export const removeEquipamiento = async (id) => {
  try {
    const dataRef = doc(db, 'equipamiento', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar equipamiento:', error)
  }
}
