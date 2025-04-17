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
import dayjs from 'dayjs'

const gastosCollection = collection(db, 'gastos')

// Registrar gasto
export const createGasto = async (data) => {
  try {
    data.fecha = Timestamp.now()
    const docRef = await addDoc(gastosCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al registrar gasto:', error)
  }
}

// Obtener registro
export const getGastos = async (callback) => {
  return onSnapshot(gastosCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      banco: doc.data()?.bancoId.label,
      fecha: dayjs.unix(doc.data().fecha.seconds).format('DD/MM/YYYY')
    }))
    callback(data)
  })
}

// Actualizar gasto
export const updateGasto = async (id, data) => {
  try {
    delete data.banco
    delete data.fecha

    const dataRef = doc(db, 'gastos', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar gasto:', error)
  }
}

// Eliminar gasto
export const removeGasto = async (id) => {
  try {
    const dataRef = doc(db, 'gastos', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar gasto:', error)
  }
}
