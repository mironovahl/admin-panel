import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { getAuth, signInWithEmailAndPassword, User } from "firebase/auth"

import { useFirebaseContext } from "../firebase-context"

interface IFirebaseContext {
  onAuthUser: (email: string, password: string) => void
  error?: string
}

export const AuthContext = createContext<IFirebaseContext>(
  {} as IFirebaseContext,
)

export const AuthProvider: FC = ({ children }) => {
  const { app } = useFirebaseContext()
  const auth = getAuth(app)

  const [error, setError] = useState()
  const [user, setUser] = useState<User>()

  const onAuthUser = useCallback(
    (email: string, password: string) => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user

          setUser(user)
        })
        .catch((error) => {
          setError(error.message)
        })
    },
    [auth],
  )

  const value = useMemo(() => ({ onAuthUser, error }), [error, onAuthUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
