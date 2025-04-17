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

const ordenesCompraCollection = collection(db, 'ordenes_compra')

// Crear orden de compra
export const createOrdenCompra = async (data) => {
  try {
    data.estatus = 'pendiente'
    data.fecha = Timestamp.now()
    const docRef = await addDoc(ordenesCompraCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar orden de compra:', error)
  }
}

// Obtener registro
export const getOrdenCompras = async (callback) => {
  return onSnapshot(ordenesCompraCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const docData = doc.data()
      const newData = {
        id: doc.id,
        ...doc.data(),
        proveedor: docData.proveedorId.label,
        articulo: docData.articuloId.label,
        banco: docData.bancoId.label,
        fecha: dayjs.unix(doc.data().fecha.seconds).format('DD/MM/YYYY')
      }
      return newData
    })

    callback(data)
  })
}

// Actualizar orden de compra
export const updateOrdenCompra = async (id, data) => {
  try {
    delete data.proveedor
    delete data.articulo
    delete data.banco
    delete data.fecha

    const dataRef = doc(db, 'ordenes_compra', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar orden de compra:', error)
  }
}

// Eliminar orden de compra
export const removeOrdenCompra = async (id) => {
  try {
    const dataRef = doc(db, 'ordenes_compra', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar orden de compra:', error)
  }
}
