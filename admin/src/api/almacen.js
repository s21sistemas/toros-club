import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import { toast } from 'sonner'

const almacenCollection = collection(db, 'almacen')

// Agregar entrada al almacén
export const createAlmacen = async (data) => {
  try {
    const docRef = await addDoc(almacenCollection, data)
    return docRef.id
  } catch (error) {
    console.error('Error al agregar entrada en almacén:', error)
  }
}

// Obtener registro
export const getAlmacen = async (callback) => {
  return onSnapshot(almacenCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      articulo: doc.data().articuloId.label
    }))
    callback(data)
  })
}

// Actualizar inventario
export const updateAlmacen = async (id, data) => {
  try {
    delete data.articulo
    const dataRef = doc(db, 'almacen', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar almacén:', error)
  }
}

// Eliminar entrada en almacén
export const removeAlmacen = async (id) => {
  try {
    const dataRef = doc(db, 'almacen', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar entrada en almacén:', error)
  }
}

export const actualizarStockAlmacen = async (articuloId, cantidad) => {
  try {
    // Buscar el artículo en almacén
    const q = query(almacenCollection, where('articuloId', '==', articuloId))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      // Si el artículo ya existe, actualizar stock
      const docRef = doc(db, 'almacen', snapshot.docs[0].id)
      const articuloActual = snapshot.docs[0].data()

      await updateDoc(docRef, {
        stock: parseFloat(articuloActual.stock) + parseFloat(cantidad)
      })
    } else {
      // Si el artículo no existe, agregarlo al almacén
      await addDoc(almacenCollection, {
        articuloId,
        stock: cantidad,
        tipo: 'entrada',
        concepto: 'Compra de artículos',
        fecha: dayjs().format('DD/MM/YYYY')
      })
    }
  } catch (error) {
    console.error('Error al actualizar stock en almacén:', error)
  }
}

export const restarStockAlmacen = async (equipamientoIds) => {
  try {
    const stocksValidos = []

    for (const articuloId of equipamientoIds) {
      const q = query(
        collection(db, 'almacen'),
        where('articuloId.label', '==', articuloId.label)
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        toast.warning(`El artículo ${articuloId.label} no existe en almacén`)
        return false
      }

      const articuloActual = snapshot.docs[0].data()

      if (parseInt(articuloActual.stock) <= 0) {
        toast.warning(
          `No hay stock suficiente del artículo: ${articuloId.label}`
        )
        return false
      }

      stocksValidos.push({
        id: snapshot.docs[0].id,
        stock: parseInt(articuloActual.stock)
      })
    }

    // Si todos los artículos pasaron la validación, ahora sí restamos stock
    for (const { id, stock } of stocksValidos) {
      const docRef = doc(db, 'almacen', id)
      await updateDoc(docRef, { stock: stock - 1 })
    }

    return true
  } catch (error) {
    console.error('Error al restar stock en almacén:', error)
    throw error
  }
}

export const sumarStockAlmacen = async (equipamiento) => {
  try {
    const almacenRef = collection(db, 'almacen')

    for (const articuloId of equipamiento) {
      const q = query(almacenRef, where('articuloId', '==', articuloId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const stockActual = doc.data().stock || 0
          await updateDoc(doc.ref, { stock: stockActual + 1 })
        })
      }
    }
    return true
  } catch (error) {
    console.error('Error al sumar stock al almacén:', error)
    return false
  }
}
