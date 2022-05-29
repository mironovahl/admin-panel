import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Auth, getAuth, signOut, User } from "firebase/auth"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useRouter } from "next/router"

import { CollectionType, UserRole } from "src/types"

import { useFirebaseContext } from "../firebase-context"

interface IAuthContext {
  auth: Auth
  error?: string
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  tempUser: User | null
  setTempUser: Dispatch<SetStateAction<User | null>>
  step: number
  setStep: Dispatch<SetStateAction<number>>
  loading: boolean
  logoutAsync: () => Promise<void>
  userRole: "admin" | "user" | null
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext)

const useAuth = () => {
  const { app, db } = useFirebaseContext()
  const auth = getAuth(app)

  const router = useRouter()

  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null)
  const [tempUser, setTempUser] = useState<User | null>(null)
  const [step, setStep] = useState(0)
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null)

  const [loading, setLoading] = useState(true)

  const logoutAsync = useCallback(async () => {
    await signOut(auth)
    await router.push("/login")
  }, [auth, router])

  useEffect(() => {
    auth.onAuthStateChanged(async (currentUser) => {
      setLoading(true)
      setUser(currentUser)

      if (currentUser) {
        const q = query(
          collection(db, CollectionType.USER_ROLES),
          where("userId", "==", currentUser?.uid),
        )

        const querySnapshot = await getDocs(q)

        querySnapshot.forEach((doc) => {
          const fetchedUser = doc.data() as UserRole

          if (fetchedUser?.userId === currentUser?.uid) {
            setUserRole(fetchedUser?.role ?? null)
          }
        })
      }

      if (!currentUser) {
        setUserRole(null)
      }

      setLoading(false)
    })
  }, [auth, db, step])

  return useMemo(
    () => ({
      auth,
      user,
      setUser,
      tempUser,
      setTempUser,
      step,
      setStep,
      loading,
      logoutAsync,
      userRole,
    }),
    [auth, loading, logoutAsync, step, tempUser, user, userRole],
  )
}

export const AuthProvider: FC = ({ children }) => {
  const value = useAuth()

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
