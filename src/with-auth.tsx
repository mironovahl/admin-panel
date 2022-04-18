import { FC, Fragment, useEffect } from "react"
import { Box, CircularProgress, styled } from "@mui/material"
import { useRouter } from "next/router"

import { useAuthContext } from "./login/auth-context"

const Root = styled(Box)`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`

const useAuth = (isProtectedPage: boolean) => {
  const { user, loading } = useAuthContext()

  const router = useRouter()

  useEffect(() => {
    if (loading) {
      return
    }

    if (isProtectedPage && !user) {
      router.push("/login")

      return
    }

    if (!isProtectedPage && user) {
      router.push("/")

      return
    }
  }, [isProtectedPage, loading, router, user])

  return { loading }
}

export const WithAuth: FC<{ isProtectedPage: boolean }> = (props) => {
  const { isProtectedPage, children } = props

  const { loading } = useAuth(isProtectedPage)

  if (loading) {
    return (
      <Root>
        <CircularProgress />
      </Root>
    )
  }

  return <Fragment>{children}</Fragment>
}
