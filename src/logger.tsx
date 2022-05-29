import { createContext, FC, useCallback, useContext } from "react"
import { addDoc, collection } from "firebase/firestore"

import { useFirebaseContext } from "./firebase-context"
import { useAuthContext } from "./login/auth-context"
import { getIsoDate } from "./utils/get-iso-date"

type LogEven =
  | "sign-in"
  | "sign-in-failure"
  | "user-created"
  | "project-created"
  | "certificate-status-updated"
  | "password-updated"

type Logger = (
  event: LogEven,
  options?: Record<string, unknown>,
) => Promise<void>

const Context = createContext<Logger>(() => Promise.resolve())

export const useLogger = () => useContext(Context)

const useVM = () => {
  const { db } = useFirebaseContext()
  const { user } = useAuthContext()

  const logger: Logger = useCallback(
    async (event, comment = {}) => {
      if (!user) {
        return
      }

      await addDoc(collection(db, "journal"), {
        userId: user.uid,
        email: user.email,
        createdAt: getIsoDate(),
        event,
        comment: JSON.stringify(comment),
      })
    },
    [db, user],
  )

  return logger
}

export const LoggerProvider: FC = (props) => {
  const { children } = props

  const logger = useVM()

  return <Context.Provider value={logger}>{children}</Context.Provider>
}
