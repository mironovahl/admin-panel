import { FC, Fragment, useEffect } from "react"
import { Box, CircularProgress, styled } from "@mui/material"
import { useRouter } from "next/router"

import { useAuthContext } from "./login/auth-context"
import { UserRole } from "./types"

const Root = styled(Box)`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`

const useAuth = (arg: Props) => {
  const { isProtectedPage, roles } = arg
  const { user, userRole, loading } = useAuthContext()

  const router = useRouter()

  useEffect(() => {
    if (loading) {
      return
    }

    if (isProtectedPage && !user) {
      router.push("/login")

      return
    }

    if (isProtectedPage && !roles.includes(userRole)) {
      router.push("/")

      return
    }

    if (!isProtectedPage && user) {
      router.push("/")

      return
    }
  }, [isProtectedPage, loading, roles, router, user, userRole])

  return { loading }
}

interface Props {
  isProtectedPage: boolean
  roles: (UserRole["role"] | null)[]
}

export const WithAuth: FC<Props> = (props) => {
  const { children, ...rest } = props

  const { loading } = useAuth(rest)

  if (loading) {
    return (
      <Root>
        <CircularProgress />
      </Root>
    )
  }

  return <Fragment>{children}</Fragment>
}
