import type { AppProps } from "next/app"

import { FireBaseContextProvider } from "../src/firebase-context"
import { AuthProvider } from "../src/login/auth-context"

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <FireBaseContextProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </FireBaseContextProvider>
  )
}

export default MyApp
