import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  writeBatch,
  deleteField
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { db, auth } from './db/firebaseConfig'
import { HOST } from '../config'
import {
  removeCheerleaderCoordFromPorrista,
  updateCheerleaderCoord
} from './cheerleader'

const usuariosCollection = collection(db, 'usuarios')
const rolesCollection = collection(db, 'roles')
const porristasCollection = collection(db, 'porristas')

// Crear un usuario
export const createUser = async (data) => {
  try {
    // Obtener código
    let isUnique = false
    let codigo

    while (!isUnique) {
      codigo = Math.floor(100000 + Math.random() * 900000).toString()
      isUnique = await isCodeUnique(codigo)
    }

    // Enviar email
    sendEmail(data, codigo)

    // Guardar en la tabla de users
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.correo,
      codigo
    )
    const user = userCredential.user

    // Guardar en la tabla usuarios
    const userData = {
      ...data,
      uid: user.uid,
      codigo_acceso: codigo,
      fecha_registro: new Date().toISOString()
    }

    const docRef = await addDoc(usuariosCollection, userData)

    await regresarSesion()

    if (data?.porristaId && Array.isArray(data.porristaId)) {
      for (const cheer of data.porristaId) {
        const newData = {
          coordinadoraId: {
            label: data.nombre_completo,
            value: docRef.id
          }
        }
        await updateCheerleaderCoord(cheer.value, newData)
      }
    }

    return { id: docRef.id, userData }
  } catch (error) {
    console.error('Error al agregar usuario:', error)
  }
}

// Leer usuarios
export const getUsers = async () => {
  try {
    // Obtener usuarios
    const userSnapshot = await getDocs(usuariosCollection)
    const users = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    // Obtener roles
    const roleSnapshot = await getDocs(rolesCollection)
    const roles = roleSnapshot.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data().nombre
      return acc
    }, {})

    // Agregar el nombre del rol a cada usuario
    const usersWithRoles = users.map((user) => ({
      ...user,
      rol: roles[user.rol_id] || 'Tutor',
      rol_id: { label: roles[user.rol_id], value: user.rol_id }
    }))

    return usersWithRoles
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  }
}

// Usuarios de coordinadora
export const getCoordinadora = async () => {
  try {
    const usuarios = {}

    // Query 1: coordinadora_jugadores == true
    const snapshot1 = await getDocs(
      query(usuariosCollection, where('coordinadora_jugadores', '==', true))
    )
    snapshot1.docs.forEach((doc) => {
      usuarios[doc.id] = { id: doc.id, ...doc.data() }
    })

    // Query 2: coordinadora_porristas == true
    const snapshot2 = await getDocs(
      query(usuariosCollection, where('coordinadora_porristas', '==', true))
    )
    snapshot2.docs.forEach((doc) => {
      usuarios[doc.id] = { id: doc.id, ...doc.data() }
    })

    // Query 3: rol_id == 'k9wRMkDMYOoo6ehF58nD'
    const snapshot3 = await getDocs(
      query(usuariosCollection, where('rol_id', '==', 'k9wRMkDMYOoo6ehF58nD'))
    )
    snapshot3.docs.forEach((doc) => {
      usuarios[doc.id] = { id: doc.id, ...doc.data() }
    })

    // Convertir a array final sin duplicados
    return Object.values(usuarios)
  } catch (error) {
    console.error('Error al obtener coordinadoras:', error)
    return []
  }
}

export const getCoordinadorasPorristas = async () => {
  try {
    const snapshot = await getDocs(
      query(usuariosCollection, where('coordinadora_porristas', '==', true))
    )

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error al obtener coordinadoras porristas:', error)
    return []
  }
}

// Actualizar un usuario
export const updateUser = async (id, data) => {
  try {
    const dataRef = doc(db, 'usuarios', id)

    // Obtener usuario actual antes de actualizar
    const docSnap = await getDoc(dataRef)
    const prevData = docSnap.exists() ? docSnap.data() : {}

    // Verificar si el usuario actual (antes de actualizar) es coordinadora
    const esCoordinadora = prevData.coordinadora_porristas === true

    // Actualizar el usuario
    await updateDoc(dataRef, data)

    // Solo si es coordinadora se hace el manejo de porristas
    if (esCoordinadora) {
      const prevPorristas = Array.isArray(prevData.porristaId)
        ? prevData.porristaId
        : []
      const newPorristas = Array.isArray(data.porristaId) ? data.porristaId : []

      // Detectar porristas eliminadas
      const eliminadas = prevPorristas.filter(
        (prev) => !newPorristas.find((curr) => curr.value === prev.value)
      )

      for (const cheer of eliminadas) {
        await removeCheerleaderCoordFromPorrista(cheer.value)
      }

      // Actualizar coordinadoraId en las nuevas porristas
      for (const cheer of newPorristas) {
        const newData = {
          coordinadoraId: {
            label: data.nombre_completo,
            value: id
          }
        }
        await updateCheerleaderCoord(cheer.value, newData)
      }
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
  }
}

// Guardarle sus porristas
export const updateUserCoord = async (coordinadoraId, porristaData) => {
  try {
    const dataRef = doc(db, 'usuarios', coordinadoraId)
    const docSnap = await getDoc(dataRef)

    if (!docSnap.exists()) {
      console.error('Usuario coordinadora no encontrado')
      return
    }

    const userData = docSnap.data()
    let porristaIdList = Array.isArray(userData.porristaId)
      ? userData.porristaId
      : []

    const index = porristaIdList.findIndex(
      (p) => p.value === porristaData.value
    )

    if (index >= 0) {
      porristaIdList[index] = porristaData
    } else {
      porristaIdList.push(porristaData)
    }

    await updateDoc(dataRef, { porristaId: porristaIdList })
  } catch (error) {
    console.error('Error al actualizar usuario coordinadora:', error)
  }
}

// Eliminar un usuario
export const removeUser = async (id) => {
  try {
    const userRef = doc(db, 'usuarios', id)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      console.error('Usuario no encontrado')
      return
    }

    const userData = userSnap.data()

    // Validar si es una coordinadora de porristas
    if (userData?.coordinadora_porristas === true) {
      // Buscar porristas asignadas a esta coordinadora
      const q = query(
        porristasCollection,
        where('coordinadoraId.value', '==', id)
      )
      const snapshot = await getDocs(q)

      const batch = writeBatch(db)

      snapshot.forEach((docSnap) => {
        const porristaRef = doc(db, 'porristas', docSnap.id)
        batch.update(porristaRef, { coordinadoraId: deleteField() })
      })

      await batch.commit()
    }

    // Eliminar usuario (coordinadora o no)
    await deleteDoc(userRef)
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}

export const removeCheerFromCoordinator = async (
  coordinadoraId,
  porristaId
) => {
  try {
    const userRef = doc(db, 'usuarios', coordinadoraId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      console.error('Coordinadora no encontrada para remover porrista')
      return
    }

    const userData = userSnap.data()
    const porristas = Array.isArray(userData.porristaId)
      ? userData.porristaId
      : []

    const filteredPorristas = porristas.filter((p) => p.value !== porristaId)

    await updateDoc(userRef, {
      porristaId: filteredPorristas
    })
  } catch (error) {
    console.error('Error al remover porrista de coordinadora:', error)
  }
}

// Enviar correo al registrar usuario
const sendEmail = async (data, code) => {
  try {
    const newData = {
      ...data,
      nombre: data.nombre_completo,
      password: code
    }
    const response = await fetch(`${HOST}/agregar-usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    })

    if (!response.ok) {
      throw new Error('No se pudo enviar el correo.')
    }
  } catch (err) {
    console.error('Error al enviar el correo:', err)
    throw new Error('No se pudo enviar el correo.')
  }
}

// Función para verificar si el código ya existe en Firestore
const isCodeUnique = async (code) => {
  const q = query(
    collection(db, 'usuarios'),
    where('codigo_acceso', '==', code)
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.empty // Devuelve true si el código es único
}

const regresarSesion = async () => {
  const adminEmail = localStorage.getItem('email')
  const adminPassword = localStorage.getItem('mensaje')

  if (!adminEmail && !adminPassword) window.location.href = '/'

  await signInWithEmailAndPassword(auth, adminEmail, adminPassword)
}
