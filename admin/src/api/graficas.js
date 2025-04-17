import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
dayjs.locale('es')

const jugadoresCollection = collection(db, 'jugadores')
const porristasCollection = collection(db, 'porristas')

const generarDataPorMes = (data, key) => {
  const agrupado = {}

  data.forEach((item) => {
    const fecha = item.fecha_registro?.toDate?.()
    if (!fecha) return

    const mes = dayjs(fecha).format('MMMM')
    if (!agrupado[mes]) agrupado[mes] = { jugadores: 0, porristas: 0 }

    agrupado[mes][key] += 1
  })

  return agrupado
}

export const getPlayers = async (callback) => {
  return onSnapshot(jugadoresCollection, (snapshot) => {
    const rawData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    const agrupado = generarDataPorMes(rawData, 'jugadores')
    callback(agrupado)
  })
}

export const getCheerleaders = async (callback) => {
  return onSnapshot(porristasCollection, (snapshot) => {
    const rawData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    const agrupado = generarDataPorMes(rawData, 'porristas')
    callback(agrupado)
  })
}
