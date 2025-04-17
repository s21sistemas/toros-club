import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc
} from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import axios from 'axios'
import { toast } from 'sonner'
import { HOST } from '../config'
import { useModalStore } from '../store/useModalStore'

const alertasCollection = collection(db, 'alertas')

// Agregar entrada al almacén
export const createAlerta = async (data) => {
  const resetFormData = useModalStore.getState().resetFormData

  const promise = async () => {
    try {
      data.estatus = 'pendiente'
      data.nombre_tutor = data.correoId.tutor
      data.tutor = `${data.correoId.tutor} (${data.correoId.correo})`
      data.tutorId = data.correoId.value
      data.correo = data.correoId.correo
      data.fecha = dayjs().format('DD/MM/YYYY')

      const correoData = {
        correo: data.correo,
        asunto: data.asunto,
        nombre_tutor: data.nombre_tutor,
        mensaje: data.mensaje
      }

      const res = await axios.post(`${HOST}/enviar-correo`, correoData)

      if (res.status === 200) {
        resetFormData()
        const docRef = await addDoc(alertasCollection, data)
        return docRef.id
      }
    } catch (error) {
      console.error('Error al agregar registro:', error)
      throw new Error('Ah ocurrido un error')
    }
  }

  toast.promise(promise(), {
    loading: 'Enviando correo...',
    success: 'Correo enviado correctamente',
    error: 'Falló al enviar el correo.'
  })
}

// Obtener registro
export const getAlerta = async (callback) => {
  return onSnapshot(alertasCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(data)
  })
}

export const removeAlerta = async (id) => {
  try {
    const dataRef = doc(db, 'alertas', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar entrada en almacén:', error)
  }
}
