import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './db/firebaseConfig'
import dayjs from 'dayjs'

const pagosJugadoresCollection = collection(db, 'pagos_jugadores')
const pagosPorristaCollection = collection(db, 'pagos_porristas')

export const getPaymentsPlayers = (callback) => {
  return onSnapshot(pagosJugadoresCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const pago = doc.data()
      const pagos = pago.pagos || []

      const fecha_regis = pago.fecha_registro
      const fecha_ins = pagos.find((p) => p.tipo === 'Inscripción')
        ?.fecha_limite
        ? pagos.find((p) => p.tipo === 'Inscripción')?.fecha_limite
        : pago.fecha_registro

      const fecha_coach = pagos.find((p) => p.tipo === 'Coaching').fecha_limite
        ? pagos.find((p) => p.tipo === 'Coaching')?.fecha_limite
        : pago.fecha_registro

      const ins = pagos.find((p) => p.tipo === 'Inscripción').estatus
      let coach = 'pendiente'
      const actually = dayjs()
      if (fecha_coach) {
        const coachPago = dayjs(fecha_coach).isAfter(actually)
        coach = coachPago ? 'pagado' : 'pendiente'
      }

      const fecha_pago_ins = pagos.find(
        (p) => p.tipo === 'Inscripción'
      ).fecha_pago

      const fecha_pago_coach = pagos.find(
        (p) => p.tipo === 'Coaching'
      ).fecha_pago

      const categoria = doc.data().categoria

      return {
        id: doc.id,
        nombre: pago.nombre,
        fecha_regis,
        fecha_ins,
        fecha_coach,
        fecha_pago_ins,
        fecha_pago_coach,
        ins,
        coach,
        categoria
      }
    })
    callback(data)
  })
}

export const getPaymentsCheer = async (callback) => {
  return onSnapshot(pagosPorristaCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const pago = doc.data()
      const pagos = pago.pagos || []

      const fecha_regis = pago.fecha_registro
      const fecha_ins = pagos.find((p) => p.tipo === 'Inscripción')
        ?.fecha_limite
        ? pagos.find((p) => p.tipo === 'Inscripción')?.fecha_limite
        : pago.fecha_registro

      const fecha_coach = pagos.find((p) => p.tipo === 'Coaching').fecha_limite
        ? pagos.find((p) => p.tipo === 'Coaching')?.fecha_limite
        : pago.fecha_registro

      const ins = pagos.find((p) => p.tipo === 'Inscripción').estatus
      let coach = 'pendiente'
      const actually = dayjs()
      if (fecha_coach) {
        const coachPago = dayjs(fecha_coach).isAfter(actually)
        coach = coachPago ? 'pagado' : 'pendiente'
      }

      const fecha_pago_ins = pagos.find(
        (p) => p.tipo === 'Inscripción'
      ).fecha_pago

      const fecha_pago_coach = pagos.find(
        (p) => p.tipo === 'Coaching'
      ).fecha_pago

      const porristaId = doc.data().porristaId

      return {
        id: doc.id,
        nombre: pago.nombre,
        fecha_regis,
        fecha_ins,
        fecha_coach,
        fecha_pago_ins,
        fecha_pago_coach,
        ins,
        coach,
        porristaId
      }
    })
    callback(data)
  })
}

export const getPlayersByTempCat = (temporadaId, categoria, callback) => {
  const q = query(
    collection(db, 'pagos_jugadores'),
    where('temporadaId', '==', temporadaId),
    where('categoria', '==', categoria)
  )

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => {
      const pago = doc.data()
      const pagos = pago.pagos || []

      const fecha_regis = pago.fecha_registro
      const fecha_ins =
        pagos.find((p) => p.tipo === 'Inscripción')?.fecha_limite || fecha_regis
      const fecha_coach =
        pagos.find((p) => p.tipo === 'Coaching')?.fecha_limite || fecha_regis

      const ins =
        pagos.find((p) => p.tipo === 'Inscripción')?.estatus || 'Pendiente'
      let coach = 'pendiente'
      const actually = dayjs()
      if (fecha_coach) {
        const coachPago = dayjs(fecha_coach).isAfter(actually)
        coach = coachPago ? 'pagado' : 'pendiente'
      }

      const fecha_pago_ins =
        pagos.find((p) => p.tipo === 'Inscripción')?.fecha_pago || null
      const fecha_pago_coach =
        pagos.find((p) => p.tipo === 'Coaching')?.fecha_pago || null

      return {
        id: doc.id,
        nombre: pago.nombre,
        fecha_regis,
        fecha_ins,
        fecha_coach,
        fecha_pago_ins,
        fecha_pago_coach,
        ins,
        coach,
        temporadaId: pago.temporadaId || null,
        categoria: pago.categoria || null
      }
    })

    callback(data)
  })
}
