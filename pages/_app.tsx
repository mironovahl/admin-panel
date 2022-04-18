import { FC } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import { NextComponentType, NextPageContext } from "next"
import type { AppProps } from "next/app"

import { FireBaseContextProvider } from "src/firebase-context"
import { AuthProvider } from "src/login/auth-context"
import { MainLayout } from "src/main-layout"

type AppComponent = NextComponentType<
  NextPageContext,
  unknown,
  Record<string, unknown>
> & { layout?: FC }

const MyApp = ({ Component, pageProps }: AppProps) => {
  const Layout = (Component as AppComponent).layout ?? MainLayout

  return (
    <FireBaseContextProvider>
      <CssBaseline />
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </FireBaseContextProvider>
  )
}

export default MyApp
