import { ReactNode, useEffect } from "react"
import { Box, CircularProgress, styled } from "@mui/material"
import type { NextPage } from "next"
import { useRouter } from "next/router"

import { useAuthContext } from "src/login/auth-context"

const Root = styled(Box)`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`

const routes = new Map([
  ["admin", "/projects"],
  ["user", "/profile"],
  [null, "/login"],
])

const useInitialRedirect = () => {
  const { userRole, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) {
      return
    }

    const path = routes.get(userRole)

    if (path) {
      ;(async () => await router.push(path))()
    }
  }, [loading, router, userRole])
}

const Home: NextPage = () => {
  useInitialRedirect()

  return (
    <Root>
      <CircularProgress />
    </Root>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(Home as any).layout = (props: { children: ReactNode }) => {
  const { children } = props

  return <Root>{children}</Root>
}

export default Home
