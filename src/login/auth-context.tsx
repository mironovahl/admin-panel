import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react"
import { Auth, getAuth, User } from "firebase/auth"

import { useFirebaseContext } from "../firebase-context"

interface IFirebaseContext {
  auth: Auth
  error?: string
  user?: User
  setUser: Dispatch<SetStateAction<User | undefined>>
  tempUser?: User
  setTempUser: Dispatch<SetStateAction<User | undefined>>
  step: number
  setStep: Dispatch<SetStateAction<number>>
}

export const AuthContext = createContext<IFirebaseContext>(
  {} as IFirebaseContext,
)

const useAuth = () => {
  const app = useFirebaseContext()
  const auth = getAuth(app)

  const [user, setUser] = useState<User | undefined>()
  const [tempUser, setTempUser] = useState<User | undefined>()
  const [step, setStep] = useState(0)

  return useMemo(
    () => ({ auth, user, setUser, tempUser, setTempUser, step, setStep }),
    [auth, step, tempUser, user],
  )
}

export const AuthProvider: FC = ({ children }) => {
  const value = useAuth()

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
