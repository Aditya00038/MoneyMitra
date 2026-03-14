import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCkrkKla4abnNbeHaH_e79X9guZn5qJuXY',
  authDomain: 'parivatan-162.firebaseapp.com',
  databaseURL: 'https://parivatan-162-default-rtdb.firebaseio.com',
  projectId: 'parivatan-162',
  storageBucket: 'parivatan-162.firebasestorage.app',
  messagingSenderId: '398900619355',
  appId: '1:398900619355:web:457752e8a52aa65751b77e',
  measurementId: 'G-1ZGTX2XLRB',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Analytics is optional (fails in some environments like localhost/unsupported browsers)
export async function initAnalytics() {
  if (!(await isSupported())) return null
  return getAnalytics(app)
}

