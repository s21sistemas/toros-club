import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAtGUX2LG4Ua6IQO1Cf9PuMP4GkZ80RA50',
  authDomain: 'toros-1453e.firebaseapp.com',
  projectId: 'toros-1453e',
  storageBucket: 'toros-1453e.firebasestorage.app',
  messagingSenderId: '898581498892',
  appId: '1:898581498892:web:48e49c9bd5a0e15ed8f229'
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Inicializa Firestore y Auth
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { app, auth, db, storage }
