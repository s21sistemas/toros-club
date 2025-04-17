import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'

const categoriasCollection = collection(db, 'categorias')

// Crear un categoria
export const createCategoria = async (data) => {
  try {
    data.fecha_inicio_filter = Timestamp.fromDate(new Date(data.fecha_inicio))
    data.fecha_fin_filter = Timestamp.fromDate(new Date(data.fecha_fin))

    const docRef = await addDoc(categoriasCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar categoria:', error)
  }
}

// Obtener registro
export const getCategoria = async (callback) => {
  return onSnapshot(categoriasCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date_inicio: dayjs(doc.data().fecha_inicio).format('DD/MM/YYYY'),
      date_fin: dayjs(doc.data().fecha_fin).format('DD/MM/YYYY')
    }))

    callback(data)
  })
}

export const getCategoriaByTemp = async (temporadaId) => {
  const q = query(categoriasCollection, where('temporadaId', '==', temporadaId))

  const snapshot = await getDocs(q)
  const data = snapshot.docs.map((doc) => ({
    value: doc.data().nombre_categoria,
    label: doc.data().nombre_categoria
  }))

  return data
}

export const getCategoriaByTempByNac = async (
  temporadaId,
  fecha_nacimiento,
  sexo
) => {
  const fechaNacimiento = dayjs(fecha_nacimiento, 'YYYY-MM-DD').toDate()

  const q = query(
    categoriasCollection,
    where('temporadaId', '==', temporadaId),
    where('sexo', '==', sexo),
    where('fecha_inicio_filter', '<=', fechaNacimiento),
    where('fecha_fin_filter', '>=', fechaNacimiento)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data().nombre_categoria)
}

// Actualizar un categoria
export const updateCategoria = async (id, data) => {
  try {
    delete data.date_inicio
    delete data.date_fin

    data.fecha_inicio_filter = Timestamp.fromDate(new Date(data.fecha_inicio))
    data.fecha_fin_filter = Timestamp.fromDate(new Date(data.fecha_fin))

    const dataRef = doc(db, 'categorias', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar categoria:', error)
  }
}

// Eliminar un categoria
export const removeCategoria = async (id) => {
  try {
    const dataRef = doc(db, 'categorias', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar categoria:', error)
  }
}
