import { createContext, FC, useCallback, useContext } from "react"
import { addDoc, collection } from "firebase/firestore"
import { nanoid } from "nanoid"

import { useFirebaseContext } from "./firebase-context"
import { useAuthContext } from "./login/auth-context"
import { LogEvent } from "./types"
import { getIsoDate } from "./utils/get-iso-date"

type Logger = (
  event: LogEvent,
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

      const id = nanoid(9)

      await addDoc(collection(db, "journal"), {
        id,
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
