import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { db, auth } from './db/firebaseConfig'
import { EMAIL_HOST } from '../config'

const usuariosCollection = collection(db, 'usuarios')
const rolesCollection = collection(db, 'roles')

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
    sendEmail(data.correo, codigo)

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
      rol: roles[user.rol_id] || 'Sin rol',
      rol_id: { label: roles[user.rol_id], value: user.rol_id }
    }))

    return usersWithRoles
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  }
}

// Actualizar un usuario
export const updateUser = async (id, data) => {
  try {
    const dataRef = doc(db, 'usuarios', id)
    await updateDoc(dataRef, data)
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
  }
}

// Eliminar un usuario
export const removeUser = async (id) => {
  try {
    const dataRef = doc(db, 'usuarios', id)
    await deleteDoc(dataRef)
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}

// Enviar correo al registrar usuario
const sendEmail = async (email, code) => {
  try {
    const response = await fetch(EMAIL_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
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
