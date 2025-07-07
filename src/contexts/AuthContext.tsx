import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

interface AuthUser {
  uid: string
  email: string
  role: 'owner' | 'guest'
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login(email: string, pass: string): Promise<void>
  logout(): Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {}
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const ref = doc(db, 'users', fbUser.uid)
        const snap = await getDoc(ref)
        const data = snap.exists() ? snap.data() : {}
        const role = (data as any).role === 'owner' ? 'owner' : 'guest'

        setUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          role
        })
      } catch {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          role: 'guest'
        })
      }

      setLoading(false)
    })

    return () => unsub()
  }, [])

  const login = async (email: string, pass: string) => {
    setLoading(true)
    await signInWithEmailAndPassword(auth, email, pass)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}