import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Auth, getAuth, User } from "firebase/auth"

import { useFirebaseContext } from "../firebase-context"

interface IAuthContext {
  auth: Auth
  error?: string
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
  tempUser?: User
  setTempUser: Dispatch<SetStateAction<User | undefined>>
  step: number
  setStep: Dispatch<SetStateAction<number>>
  loading: boolean
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext)

const useAuth = () => {
  const { app } = useFirebaseContext()
  const auth = getAuth(app)

  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null)
  const [tempUser, setTempUser] = useState<User | undefined>()
  const [step, setStep] = useState(0)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
  }, [auth])

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
    }),
    [auth, loading, step, tempUser, user],
  )
}

export const AuthProvider: FC = ({ children }) => {
  const value = useAuth()

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
