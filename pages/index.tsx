import { useEffect } from "react"
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

const useInitialRedirect = () => {
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    const path = user ? "/groups" : "/login"

    ;(async () => await router.push(path))()
  }, [router, user])
}

const Home: NextPage = () => {
  useInitialRedirect()

  return (
    <Root>
      <CircularProgress />
    </Root>
  )
}

export default Home
