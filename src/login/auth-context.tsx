import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import {
  getAuth,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  User,
} from "firebase/auth"

import { useFirebaseContext } from "../firebase-context"

interface IFirebaseContext {
  onAuthUser: (email: string, password: string) => void
  error?: string
  user?: User
}

export const AuthContext = createContext<IFirebaseContext>(
  {} as IFirebaseContext,
)

const useAuth = () => {
  const app = useFirebaseContext()

  const [error, setError] = useState<string | undefined>()
  const [user, setUser] = useState<User | undefined>()

  const onAuthUser = useCallback(
    async (email: string, password: string) => {
      try {
        const auth = getAuth(app)

        const cred = await signInWithEmailAndPassword(auth, email, password)

        setUser(cred.user)

        const appVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {},
          auth,
        )

        return await signInWithPhoneNumber(
          auth,
          cred?.user?.phoneNumber ?? "+79225210512",
          appVerifier,
        )
      } catch (error_) {
        if (error_ instanceof Error) {
          setError(error_.message)
        }
      }
    },

    [app],
  )

  return useMemo(() => ({ onAuthUser, user, error }), [error, onAuthUser, user])
}

export const AuthProvider: FC = ({ children }) => {
  const value = useAuth()

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
