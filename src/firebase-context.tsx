import { createContext, FC, useContext } from "react"
import { FirebaseApp, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA520zJYS_crmNYm2qI6PZAxc0zvWE8_fA",
  authDomain: "chat-diplom-lena.firebaseapp.com",
  databaseURL:
    "https://chat-diplom-lena-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-diplom-lena",
  storageBucket: "chat-diplom-lena.appspot.com",
  messagingSenderId: "377195280156",
  appId: "1:377195280156:web:e21f8babb377c017196cd9",
  measurementId: "G-T1FPZ0HV55",
}

const app = initializeApp(firebaseConfig)

interface IFirebaseContext {
  app: FirebaseApp
}

export const FirebaseContext = createContext<IFirebaseContext>({ app })

export const FireBaseContextProvider: FC = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ app }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebaseContext = () => useContext(FirebaseContext)
