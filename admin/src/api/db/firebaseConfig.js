import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC7X0-FNbdjpvriSxihbfyeLyTRNytu4vo',
  authDomain: 'clubtoros-c8a29.firebaseapp.com',
  projectId: 'clubtoros-c8a29',
  storageBucket: 'clubtoros-c8a29.firebasestorage.app',
  messagingSenderId: '846887347766',
  appId: '1:846887347766:web:bff3f8f43645b6ac0c5a97',
  measurementId: 'G-5S51N7ED37'
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Inicializa Firestore y Auth
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { app, auth, db, storage }
