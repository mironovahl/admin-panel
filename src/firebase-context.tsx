import { createContext, FC, useContext, useMemo } from "react"
import { FirebaseApp, initializeApp } from "firebase/app"
import { Firestore, getFirestore } from "firebase/firestore"

import { config } from "./config"

const app = initializeApp(config.firebaseConfig)

const db = getFirestore(app)

interface IFirebaseContext {
  app: FirebaseApp
  db: Firestore
}

export const FirebaseContext = createContext<IFirebaseContext>(
  {} as IFirebaseContext,
)

export const FireBaseContextProvider: FC = ({ children }) => {
  // eslint-disable-next-line @kyleshevlin/prefer-custom-hooks
  const value = useMemo(() => ({ app, db }), [])

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebaseContext = () => useContext(FirebaseContext)
