import { FC } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import { NextComponentType, NextPageContext } from "next"
import type { AppProps } from "next/app"

import { FireBaseContextProvider } from "src/firebase-context"
import { LoggerProvider } from "src/logger"
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
        <LoggerProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LoggerProvider>
      </AuthProvider>
    </FireBaseContextProvider>
  )
}

export default MyApp
