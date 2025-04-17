import {
  collection,
  doc,
  query,
  updateDoc,
  where,
  onSnapshot
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import { actualizarStockAlmacen } from './almacen'
import dayjs from 'dayjs'
import { createCompra } from './compras'

const ordenesCompraCollection = collection(db, 'ordenes_compra')

// Obtener registro
export const getCuentasPagar = async (callback) => {
  const q = query(ordenesCompraCollection, where('estatus', '==', 'pendiente'))

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      proveedor: doc.data().proveedorId.label,
      articulo: doc.data().articuloId.label,
      banco: doc.data().bancoId.label,
      fecha: dayjs.unix(doc.data().fecha.seconds).format('DD/MM/YYYY')
    }))
    callback(data)
  })
}

export const updatCuentasPagar = async (id, data) => {
  try {
    delete data.proveedor
    delete data.articulo
    delete data.banco
    delete data.fecha

    const dataRef = doc(db, 'ordenes_compra', id)
    await updateDoc(dataRef, data)

    if (data.estatus === 'pagada') {
      await actualizarStockAlmacen(data.articuloId, data.cantidad_articulos)

      const newData = {
        proveedorId: data.proveedorId,
        articuloId: data.articuloId,
        bancoId: data.bancoId,
        concepto: 'Compra de artículos',
        cantidad_articulos: data.cantidad_articulos,
        precio_articulo: data.precio_articulo,
        subtotal: data.subtotal,
        total: data.total,
        fecha: dayjs().format('DD/MM/YYYY'),
        metodo_pago: data.metodo_pago
      }

      await createCompra(newData)
    }
  } catch (error) {
    console.error('Error al actualizar orden de compra:', error)
  }
}
